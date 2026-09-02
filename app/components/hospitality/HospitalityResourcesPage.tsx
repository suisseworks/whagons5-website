import type { BlogPostMeta } from '../../lib/blog';
import type { Language } from '../../lib/i18n';
import HospitalityAnalytics from './HospitalityAnalytics';
import styles from './Hospitality.module.css';

const content = {
  en: {
    eyebrow: 'Hotel operations field notes',
    title: <>Practical control for <span>real hotel handoffs.</span></>,
    lead: 'Short operating guides for hotel leaders working on shift continuity, guest-issue ownership, maintenance response, room readiness, and frontline adoption.',
    primaryCta: 'Request a tailored demo',
    secondaryCta: 'See the platform',
    currentFocus: 'Current focus',
    focus: ['Ownership', 'Due times', 'Escalation', 'Completion proof', 'Manager visibility'],
    latest: 'Latest resources',
    sectionTitle: 'Use the ideas before buying the software.',
    sectionLead: 'Each guide is designed to help a hotel inspect or improve one operating handoff, whether or not Whagons is the right next step.',
    readTime: 'min read',
    finalEyebrow: 'Turn an idea into an operating map',
    finalTitle: 'Bring one hotel handoff that is failing today.',
    finalCta: 'Request your demo',
    finalNote: 'We will use one real workflow from your hotel—not a generic product tour.',
  },
  es: {
    eyebrow: 'Notas de campo para operaciones hoteleras',
    title: <>Control práctico para <span>entregas reales del hotel.</span></>,
    lead: 'Guías breves para líderes hoteleros que trabajan continuidad entre turnos, solicitudes de huéspedes, mantenimiento, habitaciones listas y adopción en el piso.',
    primaryCta: 'Solicitar un demo personalizado',
    secondaryCta: 'Ver la plataforma',
    currentFocus: 'Enfoque actual',
    focus: ['Responsables', 'Plazos', 'Escalamientos', 'Evidencia de cierre', 'Visibilidad gerencial'],
    latest: 'Recursos recientes',
    sectionTitle: 'Usa las ideas antes de comprar el software.',
    sectionLead: 'Cada guía ayuda a un hotel a revisar o mejorar una entrega operativa, incluso si Whagons no es el siguiente paso correcto.',
    readTime: 'min de lectura',
    finalEyebrow: 'Convierte una idea en un mapa operativo',
    finalTitle: 'Trae una entrega del hotel que hoy esté fallando.',
    finalCta: 'Solicitar mi demo',
    finalNote: 'Usaremos un flujo real de tu hotel, no un recorrido genérico del producto.',
  },
} as const;

export default function HospitalityResourcesPage({ posts, lang }: { posts: BlogPostMeta[]; lang: Language }) {
  const t = content[lang];
  const articleBase = lang === 'en' ? '/en/resources' : '/es/blog';
  const demoHref = `/${lang}/demo`;
  const platformHref = lang === 'en' ? '/en/platform' : '/es/plataforma';

  return (
    <>
      <HospitalityAnalytics page={`${lang}_hospitality_resources`} market={lang === 'es' ? 'latam' : 'us'} />
      <main className={styles.page}>
        <section className={`${styles.hero} ${styles.resourceHero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className={styles.heroLead}>{t.lead}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={demoHref} data-track="resources_demo_click">
                {t.primaryCta}
              </a>
              <a className={styles.textButton} href={platformHref}>
                {t.secondaryCta} <span>→</span>
              </a>
            </div>
          </div>
          <div className={styles.resourceIndex}>
            <span>{t.currentFocus}</span>
            {t.focus.map((item) => <strong key={item}>{item}</strong>)}
          </div>
        </section>

        <section className={`${styles.section} ${styles.resourcesSection}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{t.latest}</p>
            <h2>{t.sectionTitle}</h2>
            <p>{t.sectionLead}</p>
          </div>
          <div className={styles.resourceGrid}>
            {posts.map((post, index) => (
              <a href={`${articleBase}/${post.slug}`} className={styles.resourceCard} key={post.slug}>
                <span>0{index + 1}</span>
                <div>
                  <p>{post.tags.slice(0, 2).join(' · ')}</p>
                  <h3>{post.title}</h3>
                  <strong>{post.description}</strong>
                  <small>
                    {new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC',
                    })} · {post.readingTime} {t.readTime}
                  </small>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <p className={styles.eyebrow}>{t.finalEyebrow}</p>
          <h2>{t.finalTitle}</h2>
          <a className={styles.primaryButton} href={demoHref} data-track="resources_final_demo_click">
            {t.finalCta}
          </a>
          <p>{t.finalNote}</p>
        </section>
      </main>
    </>
  );
}
