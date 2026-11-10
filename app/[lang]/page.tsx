import { Language, isLanguage } from '../lib/locales';
import HomePage from '../components/home/HomePage';

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang: Language = isLanguage(params.lang) ? params.lang : 'es';
  return <HomePage lang={lang} />;
}
