import { NextRequest, NextResponse } from 'next/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 240;
const APP_USER_AGENT = 'Whagons Website (whagons.com)';

function clean(value: unknown, maxLength = MAX_FIELD_LENGTH): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function requestCountry(request: NextRequest): string {
  const value =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    'Unknown';
  return clean(value, 20).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Quietly accept bot submissions so the hidden field cannot be used to probe validation.
    if (clean(body.website)) {
      return NextResponse.json({ success: true });
    }

    const submission = {
      name: clean(body.name, 120),
      company: clean(body.company, 160),
      role: clean(body.role, 120),
      email: clean(body.email, 200).toLowerCase(),
      phone: clean(body.phone, 40),
      propertyCount: clean(body.propertyCount, 80),
      workflowCategory: clean(body.workflowCategory, 160),
      preferredContact: clean(body.preferredContact, 20),
      source: clean(body.source, 120) || 'direct',
      campaign: clean(body.campaign, 120),
      medium: clean(body.medium, 120),
      pageVariant: clean(body.pageVariant, 80) || 'us-hospitality-v1',
      market: 'us',
      language: 'en-US',
      offer: '20-minute-hotel-handoff-leak-scan',
      consent: body.consent === true,
    };

    if (
      !submission.name ||
      !submission.company ||
      !submission.role ||
      !submission.email ||
      !submission.propertyCount ||
      !submission.workflowCategory ||
      !submission.preferredContact ||
      !submission.consent
    ) {
      return NextResponse.json(
        { success: false, message: 'Please complete all required fields and contact consent.' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(submission.email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid work email.' },
        { status: 400 }
      );
    }

    if (submission.preferredContact === 'Phone' && !submission.phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide a phone number when phone is preferred.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FLODESK_API_KEY?.trim();
    const segmentId = process.env.FLODESK_SEGMENT_HANDOFF_SCAN_ID?.trim();
    const assignedOwner = process.env.WHAGONS_US_SCAN_OWNER?.trim();

    // Do not allow U.S. requests to fall into an unmonitored generic subscriber list.
    if (!apiKey || !segmentId || !assignedOwner) {
      console.error('U.S. hospitality scan routing is not fully configured');
      return NextResponse.json(
        {
          success: false,
          message: 'The scan request route is not available yet. Please email info@whagons.com.',
        },
        { status: 503 }
      );
    }

    const [firstName, ...lastNameParts] = submission.name.split(/\s+/);
    const flodeskPayload = {
      email: submission.email,
      first_name: firstName,
      last_name: lastNameParts.join(' '),
      segment_ids: [segmentId],
      custom_fields: {
        company: submission.company,
        role: submission.role,
        phone: submission.phone,
        property_count: submission.propertyCount,
        workflow_category: submission.workflowCategory,
        preferred_contact: submission.preferredContact,
        country: requestCountry(request),
        language: submission.language,
        market: submission.market,
        source: submission.source,
        campaign: submission.campaign,
        medium: submission.medium,
        page_variant: submission.pageVariant,
        offer: submission.offer,
        assigned_owner: assignedOwner,
        contact_consent: 'yes',
      },
    };

    const flodeskUrl = process.env.FLODESK_API_URL || 'https://api.flodesk.com/v1/subscribers';
    const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
    const response = await fetch(flodeskUrl, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
        'User-Agent': APP_USER_AGENT,
      },
      body: JSON.stringify(flodeskPayload),
    });

    if (!response.ok) {
      console.error('U.S. hospitality scan submission failed', response.status);
      return NextResponse.json(
        {
          success: false,
          message: 'Your request could not be submitted. Please email info@whagons.com.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your handoff scan request was received.',
    });
  } catch (error) {
    console.error('U.S. hospitality scan request failed', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Your request could not be submitted. Please email info@whagons.com.',
      },
      { status: 500 }
    );
  }
}
