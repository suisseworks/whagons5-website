import { NextRequest, NextResponse } from 'next/server';

// Cache for segment IDs to avoid fetching on every request
let segmentCache: { [key: string]: string | null } = {};
let segmentCacheTimestamp = 0;
const SEGMENT_CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

/**
 * Fetch segment ID by name from Flodesk API
 */
async function getSegmentIdByName(
  apiKey: string,
  segmentName: string
): Promise<string | null> {
  // Check cache first
  if (segmentCache[segmentName] && Date.now() - segmentCacheTimestamp < SEGMENT_CACHE_TTL) {
    return segmentCache[segmentName];
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
    const segmentsUrl = 'https://api.flodesk.com/v1/segments';
    
    // Fetch all segments (may need pagination for many segments)
    let allSegments: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${segmentsUrl}?page=${page}&per_page=50`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch segments: ${response.status}`);
        break;
      }

      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        allSegments = allSegments.concat(data.data);
        
        // Check if there are more pages
        if (data.meta && page < data.meta.total_pages) {
          page++;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    // Find segment by name
    const segment = allSegments.find((s: any) => s.name === segmentName);
    const segmentId = segment?.id || null;

    // Update cache
    segmentCache[segmentName] = segmentId;
    segmentCacheTimestamp = Date.now();

    return segmentId;
  } catch (error) {
    console.error(`Error fetching segment "${segmentName}":`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, industry, country, language } = body;

    // Validate required fields
    if (!name || !email || !company || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get Flodesk API key from environment
    const apiKey = process.env.FLODESK_API_KEY;
    if (!apiKey) {
      console.error('FLODESK_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Flodesk API endpoint - https://api.flodesk.com/v1/subscribers
    const flodeskUrl = process.env.FLODESK_API_URL || 'https://api.flodesk.com/v1/subscribers';

    // Get segment IDs from Flodesk API by name
    const segmentNameEnglish = 'Whagons5-waitlist-ENGLISH';
    const segmentNameSpanish = 'Whagons5-waitlist-ESPANOL';
    
    const targetSegmentName = language === 'es' ? segmentNameSpanish : segmentNameEnglish;
    const segmentId = await getSegmentIdByName(apiKey, targetSegmentName);
    
    if (!segmentId) {
      console.warn(`Segment "${targetSegmentName}" not found in Flodesk`);
    }

    // Prepare data for Flodesk API
    // Flodesk requires 'email' and optionally accepts first_name, last_name, custom_fields, segment_ids, etc.
    const flodeskData: any = {
      email: email.trim(),
      first_name: name.trim().split(' ')[0] || name.trim(),
      last_name: name.trim().split(' ').slice(1).join(' ') || '',
    };

    // Add segment_ids if available
    if (segmentId) {
      flodeskData.segment_ids = [segmentId];
    }

    // Add custom fields for additional data
    flodeskData.custom_fields = {
      company: company.trim(),
      industry: industry,
      country: country || 'Unknown',
      language: language || 'en',
      source: 'whagons-website',
    };

    // Flodesk uses Basic Auth: username = API key, password = blank
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

    // Call Flodesk API
    const response = await fetch(flodeskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(flodeskData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flodesk API error:', response.status, errorText);
      
      // Return success to user even if API call fails (graceful degradation)
      // Log the error for debugging
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you! We\'ll be in touch soon.',
          // Include error in development only
          ...(process.env.NODE_ENV === 'development' && { debug: errorText })
        },
        { status: 200 }
      );
    }

    const result = await response.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll be in touch soon.',
      data: result,
    });
  } catch (error) {
    console.error('Error submitting to Flodesk:', error);
    
    // Return success to user even on error (graceful degradation)
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you! We\'ll be in touch soon.',
        ...(process.env.NODE_ENV === 'development' && { error: String(error) })
      },
      { status: 200 }
    );
  }
}
