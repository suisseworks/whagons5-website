import HospitalityAnalytics from './HospitalityAnalytics';
import HotelWorkflowPreview from './HotelWorkflowPreview';
import styles from './Hospitality.module.css';

const controls = [
  ['01', 'Capture', 'Turn a request, finding, or recurring standard into visible work with the context the next person needs.'],
  ['02', 'Own', 'Give the handoff a responsible role, a due time, and a clear status instead of leaving it in conversation.'],
  ['03', 'Escalate', 'Define who needs to know when work approaches or passes its operating deadline.'],
  ['04', 'Prove', 'Require the note, photo, checklist, or acknowledgment that shows the standard was met.'],
  ['05', 'Review', 'Give managers one place to see open work, late work, exceptions, and repeated failure points.'],
];

const workflows = [
  {
    name: 'Guest issues',
    handoff: 'Front desk → operating department → guest follow-up',
    outcome: 'Keep ownership and the service-recovery follow-through visible across shifts.',
  },
  {
    name: 'Maintenance requests',
    handoff: 'Reporter → engineering → room or area release',
    outcome: 'Connect the request, response deadline, completion evidence, and operational acknowledgment.',
  },
  {
    name: 'Room readiness',
    handoff: 'Housekeeping → inspection → front desk',
    outcome: 'Make exceptions and release decisions visible without replacing the PMS room-status record.',
  },
  {
    name: 'Standards and inspections',
    handoff: 'Finding → corrective action → manager verification',
    outcome: 'Turn a failed standard into owned corrective work with proof and an audit trail.',
  },
  {
    name: 'Shift handoffs',
    handoff: 'Outgoing team → incoming team → department leader',
    outcome: 'Carry unresolved work forward with an owner and due time instead of a message that disappears.',
  },
];

export default function HospitalityPlatformPage() {
  return (
    <>
      <HospitalityAnalytics page="us_hospitality_platform" />
      <main className={styles.page}>
        <section className={`${styles.hero} ${styles.subpageHero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Hotel workflow control · Built around the handoff</p>
            <h1>Make hotel work <span>accountable.</span></h1>
            <p className={styles.heroLead}>
              Whagons gives each selected workflow an owner, due time, escalation path, proof
              requirement, and manager view. It operates alongside the hotel&apos;s PMS and existing systems.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="/en/handoff-scan" data-track="platform_scan_click">
                Find a Handoff Leak
              </a>
              <a className={styles.textButton} href="/en/hotel-operations">
                Explore hotel workflows <span>↗</span>
              </a>
            </div>
            <div className={styles.heroFacts}>
              <span>One workflow first</span>
              <span>Hotel-specific configuration</span>
              <span>No PMS replacement</span>
            </div>
          </div>
          <div className={styles.controlStack} aria-label="Five hotel workflow controls">
            {controls.map(([number, title]) => (
              <div key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <i aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The control model</p>
            <h2>Five controls managers can inspect.</h2>
            <p>
              The product is not the promise. The promise is that selected hotel work stops
              depending on memory, message history, and repeated manager follow-up.
            </p>
          </div>
          <div className={styles.controlCards}>
            {controls.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.darkSection}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Where it applies</p>
            <h2>Configure the handoffs the hotel already runs.</h2>
            <p>
              Start with the workflow whose delay or ambiguity creates the most management effort.
              Expand only after the first workflow is operating and measurable.
            </p>
          </div>
          <div className={styles.workflowRows}>
            {workflows.map((workflow, index) => (
              <article key={workflow.name}>
                <span>0{index + 1}</span>
                <h3>{workflow.name}</h3>
                <strong>{workflow.handoff}</strong>
                <p>{workflow.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.productSection}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>What teams use</p>
            <h2>One operating record from request to verification.</h2>
            <p>
              Configure hotel roles, terminology, priorities, checklists, due times, and status
              views around the selected workflow. Managers review the exceptions instead of
              reconstructing the story from separate channels.
            </p>
          </div>
          <HotelWorkflowPreview />
        </section>

        <section className={`${styles.section} ${styles.boundarySection}`}>
          <div>
            <p className={styles.eyebrow}>Whagons is</p>
            <h2>The operating layer for work between hotel systems and teams.</h2>
            <ul>
              <li>A place to own, time, escalate, document, and review selected workflows.</li>
              <li>A configurable layer for frontline execution and manager visibility.</li>
              <li>A focused implementation that begins with operational evidence.</li>
            </ul>
          </div>
          <div>
            <p className={styles.eyebrow}>Whagons is not</p>
            <h2>A replacement for every system the property already uses.</h2>
            <ul>
              <li>Not a property management system, booking engine, or point-of-sale system.</li>
              <li>Not a promise that software alone fixes adoption or management discipline.</li>
              <li>Not a platform-wide transformation required before value can be tested.</li>
            </ul>
          </div>
        </section>

        <section className={styles.finalCta}>
          <p className={styles.eyebrow}>Start with evidence</p>
          <h2>Map one real handoff before discussing software.</h2>
          <a className={styles.primaryButton} href="/en/handoff-scan" data-track="platform_final_scan_click">
            Request a Free Handoff Scan
          </a>
          <p>Free 20-minute working session for hotels in the Sacramento metro launch market.</p>
        </section>
      </main>
    </>
  );
}
