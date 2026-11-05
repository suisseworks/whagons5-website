import { NextRequest } from 'next/server';

import {
  checklistRepo,
  codeMatches,
  createChecklistStore,
  createCodeGate,
  validateChecklistComment,
} from '../../lib/cronus-checklist.mjs';
import { clientAddress, createRateLimiter, noStoreJson, originAllowed, readBody, requestId } from '../../lib/cronus-request';

// Comments on the project checklist of the Cronus review site
// (/clients/cronus2/next-steps). Stored as GitHub issue comments; see
// DEMO_REQUEST_SETUP.md. Both reading and posting need the access code.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const postLimiter = createRateLimiter(10 * 60 * 1000, 20);
const gate = createCodeGate();
let store: ReturnType<typeof createChecklistStore> | null = null;

function getStore() {
  const token = process.env.CRONUS_CHECKLIST_GITHUB_TOKEN?.trim();
  if (!token || !process.env.CRONUS_CHECKLIST_CODE?.trim()) return null;
  if (!store) store = createChecklistStore({ token, repo: checklistRepo(process.env) });
  return store;
}

// null when the code is right; otherwise the response to send.
function checkCode(request: NextRequest) {
  const address = clientAddress(request);
  if (gate.blocked(address)) return noStoreJson({ error: 'RATE_LIMITED' }, 429, { 'Retry-After': String(gate.windowSeconds) });
  if (codeMatches(process.env.CRONUS_CHECKLIST_CODE, request.headers.get('x-checklist-code') || '')) return null;
  gate.fail(address);
  return noStoreJson({ error: 'UNAUTHORIZED' }, 401);
}

function log(event: Record<string, unknown>) {
  console.info(JSON.stringify({ event: 'cronus_checklist', ...event }));
}

export async function GET(request: NextRequest) {
  const id = requestId(request);
  const s = getStore();
  if (!s) return noStoreJson({ error: 'NOT_CONFIGURED' }, 503);
  const denied = checkCode(request);
  if (denied) return denied;
  try {
    return noStoreJson(await s.list());
  } catch (error) {
    log({ requestId: id, action: 'list', ok: false, status: (error as { status?: number }).status, message: (error as Error).message });
    return noStoreJson({ error: 'UNAVAILABLE', requestId: id }, 503);
  }
}

export async function POST(request: NextRequest) {
  const id = requestId(request);
  if (!originAllowed(request.headers.get('origin'))) return noStoreJson({ error: 'FORBIDDEN' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return noStoreJson({ error: 'INVALID' }, 400);
  const s = getStore();
  if (!s) return noStoreJson({ error: 'NOT_CONFIGURED' }, 503);
  const denied = checkCode(request);
  if (denied) return denied;

  const raw = await readBody(request, MAX_BODY_BYTES);
  if (!raw) return noStoreJson({ error: 'TOO_LARGE' }, 413);
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return noStoreJson({ error: 'INVALID' }, 400);
  }
  const result = validateChecklistComment(body);
  if (!result.ok || !result.comment) return result.code === 'SPAM' ? noStoreJson({ ok: true }) : noStoreJson({ error: 'INVALID' }, 400);
  if (postLimiter.limited(request)) {
    return noStoreJson({ error: 'RATE_LIMITED' }, 429, { 'Retry-After': String(postLimiter.windowSeconds) });
  }

  try {
    const comment = await s.add(result.comment);
    log({ requestId: id, action: 'comment', ok: true, item: result.comment.item });
    return noStoreJson({ ok: true, comment });
  } catch (error) {
    log({ requestId: id, action: 'comment', ok: false, item: result.comment.item, status: (error as { status?: number }).status, message: (error as Error).message });
    return noStoreJson({ error: 'UNAVAILABLE', requestId: id }, 503);
  }
}
