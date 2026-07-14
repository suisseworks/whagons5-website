import HospitalityAnalytics from './HospitalityAnalytics';
import styles from './Hospitality.module.css';

const departments = [
  ['01', 'Front desk', 'Capture the request, set the operational handoff in motion, and see whether follow-up has happened.'],
  ['02', 'Housekeeping', 'Own room-readiness exceptions, inspections, corrective actions, and cross-shift carryover.'],
  ['03', 'Engineering', 'Receive complete requests, work against due times, attach completion evidence, and flag exceptions.'],
  ['04', 'Operations leaders', 'See late work, escalation, repeated failure points, and where a handoff needs intervention.'],
  ['05', 'Regional teams', 'Compare the same agreed workflow across properties without forcing every hotel into one generic process.'],
];

const moments = [
  ['Guest request to resolution', 'The guest-facing team can see who owns the operating response and whether follow-up is still required.'],
  ['Room exception to release', 'The teams preparing, inspecting, repairing, and releasing the room share one visible chain of work.'],
  ['Inspection finding to correction', 'A failed standard creates assigned corrective work and manager verification instead of another static report.'],
  ['Open item to next shift', 'Unfinished work carries forward with context, ownership, and timing rather than an informal message.'],
];

export default function HotelOperationsPage() {
  return (
    <>
      <HospitalityAnalytics page="us_hotel_operations" />
      <main className={styles.page}>
        <section className={`${styles.hero} ${styles.subpageHero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Built for the work between hotel departments</p>
            <h1>One operating layer. <span>Every handoff visible.</span></h1>
            <p className={styles.heroLead}>
              Hotels already have systems of record. Whagons focuses on the work that moves
              between people, departments, shifts, and properties after a request or standard
              needs action.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="/en/handoff-scan" data-track="operations_scan_click">
                Request a Handoff Scan
              </a>
              <a className={styles.textButton} href="/en/platform">
                See the control model <span>↗</span>
              </a>
            </div>
          </div>
          <aside className={styles.departmentMap}>
            <span>Guest-facing request</span>
            <strong>Front desk</strong>
            <i aria-hidden="true" />
            <strong>Operating department</strong>
            <i aria-hidden="true" />
            <strong>Manager verification</strong>
            <small>Owner · due time · escalation · proof</small>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Department-level clarity</p>
            <h2>Give each team the part of the workflow it owns.</h2>
            <p>
              The goal is not to make every employee a project manager. Each role sees the work,
              context, standard, and next action required from that role.
            </p>
          </div>
          <div className={styles.departmentGrid}>
            {departments.map(([number, name, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.handoffMoments}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>High-value handoff moments</p>
            <h2>Start where ambiguity creates guest or manager risk.</h2>
            <p>
              A strong first workflow crosses a boundary, happens often enough to observe, and
              matters enough that the hotel will measure whether it improves.
            </p>
          </div>
          <div className={styles.momentGrid}>
            {moments.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.fitSectionWide}`}>
          <div>
            <p className={styles.eyebrow}>Independent hotels</p>
            <h2>Control one property without enterprise overhead.</h2>
            <p>Begin with one workflow, one sponsor, and the people already responsible for doing the work.</p>
          </div>
          <div>
            <p className={styles.eyebrow}>Management companies</p>
            <h2>Standardize the control, not every local detail.</h2>
            <p>Define what must be owned, timed, proven, and reviewed while allowing property-specific roles and terminology.</p>
          </div>
          <div>
            <p className={styles.eyebrow}>Multi-property operators</p>
            <h2>Expand after one workflow is proven.</h2>
            <p>Use the day-45 replication brief to decide whether the same operating pattern belongs at another property.</p>
          </div>
        </section>

        <section className={styles.finalCta}>
          <p className={styles.eyebrow}>Sacramento launch market</p>
          <h2>Which handoff costs your managers the most follow-up?</h2>
          <a className={styles.primaryButton} href="/en/handoff-scan" data-track="operations_final_scan_click">
            Map It in 20 Minutes
          </a>
          <p>No generic demo and no obligation to purchase the pilot.</p>
        </section>
      </main>
    </>
  );
}
