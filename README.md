# Whagons Website

A Next.js website for Whagons 5, featuring a modern design with fog effects and multi-language support.

## Features

- Next.js 14 with App Router
- TypeScript
- Multi-language support (English/Spanish)
- Flodesk API integration for lead capture
- Responsive design
- Dark mode theme

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
FLODESK_API_KEY=your_flodesk_api_key_here
FLODESK_API_URL=https://api.flodesk.com/v1/subscribers  # Optional, defaults to this URL
```

**Note:** The segment IDs are automatically fetched from Flodesk API by name. Make sure you have segments named:
- "Whagons5-waitlist-ENGLISH" (for English subscribers)
- "Whagons5-waitlist-ESPANOL" (for Spanish subscribers)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Flodesk API Integration

The signup form submits data to `/api/flowdesk` which then forwards it to the Flodesk API. The API route handles:

- Subscriber creation with name, email, company, industry, country, and language
- Automatic assignment to language-specific segments (English or Spanish)
- Error handling and graceful degradation
- Environment variable configuration for API key and segment IDs

### API Endpoint

The Flodesk API endpoint can be configured via the `FLODESK_API_URL` environment variable. Default is `https://api.flodesk.com/v1/subscribers`.

The API uses Basic Auth authentication (username = API key, password blank) using the `FLODESK_API_KEY` environment variable.

## Project Structure

```
app/
  ├── api/
  │   └── flowdesk/
  │       └── route.ts          # Flodesk API integration
  ├── components/
  │   ├── FogEffect.tsx          # Animated fog background
  │   └── SignupForm.tsx         # Lead capture form
  ├── lib/
  │   └── i18n.ts                # Translations
  ├── what-is-whagons/
  │   └── page.tsx               # What is Whagons page
  ├── layout.tsx                 # Root layout
  ├── page.tsx                   # Home page
  └── globals.css                # Global styles
```

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `FLODESK_API_KEY` (required): Your Flodesk API key
- `FLODESK_API_URL` (optional): Flodesk API endpoint URL (defaults to `https://api.flodesk.com/v1/subscribers`)

## Notes

- The Flodesk API integration uses Basic Auth authentication (username = API key, password blank)
- Custom fields (company, industry, country, language, source) are sent in the `custom_fields` object
- Subscribers are automatically added to the appropriate segment based on their selected language
- **Segment IDs are automatically fetched from Flodesk API** by searching for segments named:
  - "Whagons5-waitlist-ENGLISH" (for English subscribers)
  - "Whagons5-waitlist-ESPANOL" (for Spanish subscribers)
- Segment IDs are cached for 1 hour to improve performance and reduce API calls
- Make sure these segments exist in your Flodesk account with the exact names above
