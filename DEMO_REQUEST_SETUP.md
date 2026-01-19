# Demo Request Landing Page Setup

## Overview
The demo request landing page is available at: **`/demo`**

This page allows visitors to request a Whagons 5 demo by filling out a form with:
- Name
- Email
- Company Name
- Industry (dropdown)

The form automatically captures the visitor's country and integrates with Flodesk API to:
1. Create/update the subscriber in Flodesk
2. Add them to the "WHAGONS-5-DEMO-REQUEST" segment

## Environment Variables Required

Add these to your `.env` file (or `.env.local` for local development):

```env
VITE_FLODESK_API_KEY=your_flodesk_api_key_here
VITE_FLODESK_SEGMENT_ID=your_segment_id_here  # Optional - will auto-detect if not provided
```

## Getting Your Flodesk API Key

1. Log in to your Flodesk account
2. Go to Settings → Integrations → API
3. Generate or copy your API key
4. Add it to your `.env` file as `VITE_FLODESK_API_KEY`

## Getting Your Segment ID

### Option 1: Auto-Detection (Recommended)
The code will automatically search for a segment named "WHAGONS-5-DEMO-REQUEST" and use its ID. Just make sure the segment exists in Flodesk with that exact name.

### Option 2: Manual Configuration
1. In Flodesk, go to Segments
2. Find or create the segment "WHAGONS-5-DEMO-REQUEST"
3. Copy the segment ID from the URL or segment details
4. Add it to your `.env` file as `VITE_FLODESK_SEGMENT_ID`

## Creating the Segment in Flodesk

1. Log in to Flodesk
2. Navigate to **Segments**
3. Click **Create Segment**
4. Name it: **WHAGONS-5-DEMO-REQUEST**
5. Save the segment
6. Note the segment ID (found in the URL or segment settings)

## Link to Share

Once deployed, share this link in your emails:
```
https://yourdomain.com/demo
```

Or for local testing:
```
http://localhost:5175/demo
```

## Custom Fields in Flodesk

Make sure your Flodesk account has these custom fields set up:
- `company` (Text)
- `industry` (Text)
- `country` (Text)

These will be automatically populated when someone submits the demo request form.

## Testing

1. Start your development server
2. Navigate to `/demo`
3. Fill out the form
4. Check your Flodesk account to verify:
   - The subscriber was created/updated
   - They were added to the "WHAGONS-5-DEMO-REQUEST" segment
   - Custom fields are populated correctly

## Troubleshooting

### API Key Issues
- Make sure `VITE_FLODESK_API_KEY` is set correctly
- Verify the API key has the necessary permissions
- Check browser console for error messages

### Segment Issues
- Ensure the segment "WHAGONS-5-DEMO-REQUEST" exists in Flodesk
- Verify the segment ID if using `VITE_FLODESK_SEGMENT_ID`
- Check that the segment name matches exactly (case-sensitive)

### CORS Issues
- Flodesk API should handle CORS correctly
- If issues persist, check Flodesk API documentation for CORS settings

## API Endpoints Used

1. **Create/Update Subscriber**: `POST https://api.flodesk.com/v1/subscribers`
2. **Get Segments**: `GET https://api.flodesk.com/v1/segments`
3. **Add to Segment**: `POST https://api.flodesk.com/v1/subscribers/{email}/segments`
