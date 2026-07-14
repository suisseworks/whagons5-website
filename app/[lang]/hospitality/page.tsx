import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { lang: string } }) {
  if (params.lang !== 'en') redirect('/es');
  redirect('/en');
}
