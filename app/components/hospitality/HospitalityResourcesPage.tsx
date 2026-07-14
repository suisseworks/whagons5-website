import type { BlogPostMeta } from '../../lib/blog';
import HospitalityAnalytics from './HospitalityAnalytics';
import styles from './Hospitality.module.css';

export default function HospitalityResourcesPage({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <>
      <HospitalityAnalytics page="us_hospitality_resources" />
      <main className={styles.page}>
        <section className={`${styles.hero} ${styles.resourceHero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Hotel operations field notes</p>
            <h1>Practical control for <span>real hotel handoffs.</span></h1>
            <p className={styles.heroLead}>
              Short operating guides for hotel leaders working on shift continuity, guest-issue
              ownership, maintenance response, room readiness, and frontline adoption.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="/en/handoff-scan" data-track="resources_scan_click">
                Request a Handoff Scan
              </a>
              <a className={styles.textButton} href="/en/platform">
                See the platform <span>↗</span>
              </a>
            </div>
          </div>
          <div className={styles.resourceIndex}>
            <span>Current focus</span>
            <strong>Ownership</strong>
            <strong>Due times</strong>
            <strong>Escalation</strong>
            <strong>Completion proof</strong>
            <strong>Manager visibility</strong>
          </div>
        </section>

        <section className={`${styles.section} ${styles.resourcesSection}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Latest resources</p>
            <h2>Use the ideas before buying the software.</h2>
            <p>
              Each guide is designed to help a hotel inspect or improve one operating handoff,
              whether or not Whagons is the right next step.
            </p>
          </div>
          <div className={styles.resourceGrid}>
            {posts.map((post, index) => (
              <a href={`/en/resources/${post.slug}`} className={styles.resourceCard} key={post.slug}>
                <span>0{index + 1}</span>
                <div>
                  <p>{post.tags.slice(0, 2).join(' · ')}</p>
                  <h2>{post.title}</h2>
                  <strong>{post.description}</strong>
                  <small>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC',
                    })} · {post.readingTime} min read
                  </small>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <p className={styles.eyebrow}>Turn an idea into an operating map</p>
          <h2>Bring one hotel handoff that is failing today.</h2>
          <a className={styles.primaryButton} href="/en/handoff-scan" data-track="resources_final_scan_click">
            Request a Free Handoff Scan
          </a>
          <p>You receive a one-page score and one improvement usable without Whagons.</p>
        </section>
      </main>
    </>
  );
}
