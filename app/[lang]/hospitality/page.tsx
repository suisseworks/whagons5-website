import { redirect } from 'next/navigation';

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  if (params.lang !== 'en') redirect('/es');
  redirect('/en');
}
