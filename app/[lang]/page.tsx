import { Language } from '../lib/i18n';
import HomePage from '../components/home/HomePage';

export default function Home({ params }: { params: { lang: string } }) {
  const lang: Language = params.lang === 'en' ? 'en' : 'es';
  return <HomePage lang={lang} />;
}
