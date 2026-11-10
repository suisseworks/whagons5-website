import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * The visitor's country as the CDN or proxy reports it (the same headers the
 * middleware uses to pick a language), so the home page can draw the local
 * plug standard. Country only, never stored; null when unknown.
 */
export function GET(request: NextRequest) {
  const raw = (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-country-code') ||
    request.geo?.country ||
    ''
  ).toUpperCase();
  const country = /^[A-Z]{2}$/.test(raw) && raw !== 'XX' && raw !== 'T1' ? raw : null;
  return NextResponse.json({ country }, { headers: { 'Cache-Control': 'private, no-store' } });
}
