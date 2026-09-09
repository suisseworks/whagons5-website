import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ScorePage from '../../components/hotel-score/ScorePage';
import { isLanguage } from '../../lib/locales';

export function generateStaticParams(){return [{lang:'es'},{lang:'en'}];}
export function generateMetadata({params}:{params:{lang:string}}):Metadata{
  const es=params.lang==='es';const title='Whagons Hotel Operations Score';
  const description=es?'Responde diez preguntas y recibe tu score de control operativo y un plan de mejora para tu hotel por correo.':'Answer ten questions and receive your operational control score and hotel improvement plan by email.';
  const url=`https://whagons.com/${es?'es':'en'}/hotel-operations-score`;
  return {title,description,alternates:{canonical:url,languages:{es:'https://whagons.com/es/hotel-operations-score',en:'https://whagons.com/en/hotel-operations-score'}},openGraph:{title,description,url,type:'website',images:['/images/industries/hoteleria.jpg']}};
}
export default function Page({params}:{params:{lang:string}}){if(!isLanguage(params.lang))notFound();return <ScorePage lang={params.lang}/>;}
