import { notFound } from 'next/navigation';

// Route unknown localized URLs through the localized error boundary so visitors
// keep their selected language, navigation and recovery links.
export default function Page() {
  notFound();
}
