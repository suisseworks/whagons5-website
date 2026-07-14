import HandoffScanForm from './HandoffScanForm';
import HospitalityAnalytics from './HospitalityAnalytics';
import styles from './Hospitality.module.css';

export default function HandoffScanPage() {
  return (
    <>
      <HospitalityAnalytics page="handoff_scan" />
      <main className={styles.page}>
        <section className={`${styles.hero} ${styles.scanHero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Free · 20 minutes · Sacramento launch market</p>
            <h1>Find where one hotel handoff breaks.</h1>
            <p className={styles.heroLead}>
              Bring one recent guest issue, maintenance request, room-readiness problem, shift
              handoff, or inspection finding. We will map what happened and show where control was lost.
            </p>
            <div className={styles.heroFacts}>
              <span>No generic demo</span>
              <span>One-page score within one business day</span>
              <span>No purchase obligation</span>
            </div>
          </div>
          <aside className={styles.scanScorecard}>
            <span className={styles.boardKicker}>Your handoff score</span>
            {['Ownership', 'Due time', 'Escalation', 'Proof', 'Manager visibility'].map((item, index) => (
              <div key={item}><span>0{index + 1}</span><strong>{item}</strong><i aria-hidden="true" /></div>
            ))}
          </aside>
        </section>

        <section className={`${styles.section} ${styles.scanDetails}`}>
          <div>
            <p className={styles.eyebrow}>What to bring</p>
            <h2>A real example, not a prepared presentation.</h2>
            <p>
              Choose something recent enough that you remember who reported it, who received it,
              when it became late, and how completion was confirmed.
            </p>
          </div>
          <div>
            <p className={styles.eyebrow}>What you receive</p>
            <ul>
              <li>A current-state handoff map.</li>
              <li>A score across the five operating controls.</li>
              <li>One process improvement usable without Whagons.</li>
              <li>A fit, not-yet, or no-fit recommendation.</li>
            </ul>
          </div>
        </section>

        <section className={`${styles.section} ${styles.formSection}`} id="request-form">
          <div className={styles.formIntro}>
            <p className={styles.eyebrow}>Request the working session</p>
            <h2>Tell us which handoff you want to examine.</h2>
            <p>
              Your request is reviewed directly by the U.S. hospitality lead, not sent to the
              Latin America WhatsApp route or a generic newsletter list.
            </p>
          </div>
          <HandoffScanForm />
        </section>

        <section className={styles.scanFootnote}>
          <strong>Bilingual rollout is available when it helps frontline adoption.</strong>
          <p>We will ask what languages the people performing the selected workflow use day to day.</p>
        </section>
      </main>
    </>
  );
}
