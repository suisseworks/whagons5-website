import { Language, isLanguage } from '../lib/locales';
import HomePage from '../components/home/HomePage';

export default function Home({ params }: { params: { lang: string } }) {
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  return <HomePage lang={lang} />;
}
