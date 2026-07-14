import HospitalityAnalytics from './HospitalityAnalytics';
import HotelWorkflowPreview from './HotelWorkflowPreview';
import styles from './Hospitality.module.css';

const leakScenarios = [
  {
    number: '01',
    title: 'A guest issue crosses departments.',
    text: 'Front desk reports it. Maintenance receives it. The next shift cannot tell who owns the follow-through.',
  },
  {
    number: '02',
    title: 'A due time exists only in conversation.',
    text: 'The request is important, but no escalation happens until a manager asks why it is still open.',
  },
  {
    number: '03',
    title: 'Completion is reported without proof.',
    text: 'The task sounds finished, but the photo, checklist, approval, or guest follow-up is missing.',
  },
];

const pilotStack = [
  ['01', 'One-Day Handoff Leak Map', 'Choose the real workflow and expose where ownership or visibility breaks.'],
  ['02', 'Seven-Day Workflow Launch', 'Put the first agreed workflow live within seven business days when hotel inputs arrive on time.'],
  ['03', 'Manager Escalation Blueprint', 'Define due times, escalation paths, and the view managers use to intervene.'],
  ['04', 'Frontline Adoption Launch', 'Train the people doing the work with role-specific guidance and optional bilingual materials.'],
  ['05', 'Weekly Handoff Control Review', 'Review late work, exceptions, adoption, and changes with the hotel sponsor.'],
  ['06', 'Results and Replication Brief', 'At day 45, document what changed and whether another workflow or property should follow.'],
];

function HandoffBoard() {
  return (
    <div className={styles.handoffBoard} aria-label="Illustrative hotel handoff timeline">
      <div className={styles.boardHeader}>
        <div>
          <span className={styles.boardKicker}>Illustrative handoff</span>
          <strong>Guest-floor A/C issue</strong>
        </div>
        <span className={styles.boardLive}>Manager visible</span>
      </div>
      <div className={styles.boardRow}>
        <span className={styles.boardDot}>1</span>
        <div><strong>Issue captured</strong><small>Front desk · 8:42 AM</small></div>
        <span className={styles.boardStatus}>Owned</span>
      </div>
      <div className={styles.boardRow}>
        <span className={styles.boardDot}>2</span>
        <div><strong>Engineering assigned</strong><small>Due 9:30 AM · escalation set</small></div>
        <span className={`${styles.boardStatus} ${styles.boardStatusWarn}`}>12 min left</span>
      </div>
      <div className={styles.boardRow}>
        <span className={styles.boardDot}>3</span>
        <div><strong>Proof and follow-up</strong><small>Photo · note · front desk acknowledgment</small></div>
        <span className={styles.boardStatus}>Required</span>
      </div>
      <div className={styles.boardFooter}>
        <span>Owner</span><span>Due time</span><span>Escalation</span><span>Proof</span><span>Visibility</span>
      </div>
    </div>
  );
}

export default function HospitalityPage() {
  return (
    <>
      <HospitalityAnalytics page="us_hospitality" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Whagons Hospitality · Sacramento launch market</p>
            <h1>
              Know what&apos;s owned.<br />
              What&apos;s late.<br />
              <span>What&apos;s done to standard.</span>
            </h1>
            <p className={styles.heroLead}>
              Put guest issues, maintenance, inspections, room readiness, and shift handoffs
              under visible control without replacing your PMS or chasing every update.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="/en/handoff-scan" data-track="hero_scan_click">
                Request a 20-Minute Handoff Leak Scan
              </a>
              <a className={styles.textButton} href="#pilot" data-track="hero_pilot_click">
                See the 45-day pilot <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className={styles.heroFacts}>
              <span>One property</span>
              <span>First workflow in 7 business days</span>
              <span>No PMS replacement</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <HandoffBoard />
            <p>Operational example, not a claimed customer result.</p>
          </div>
        </section>

        <section className={styles.section} id="handoffs">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The operating problem</p>
            <h2>The request is rarely the problem. The handoff is.</h2>
            <p>
              Hotel systems record reservations and stays. Whagons controls the work that must
              happen across people, departments, and shifts after something needs attention.
            </p>
          </div>
          <div className={styles.scenarioGrid}>
            {leakScenarios.map((scenario) => (
              <article className={styles.scenarioCard} key={scenario.number}>
                <span>{scenario.number}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.text}</p>
              </article>
            ))}
          </div>
          <div className={styles.controlStrip} aria-label="Five controls for a reliable handoff">
            {['A named owner', 'A visible due time', 'An escalation path', 'Proof of completion', 'Manager visibility'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.scanPanel}`} id="scan">
          <div className={styles.scanIntro}>
            <p className={styles.eyebrow}>Free 20-minute working session</p>
            <h2>Find where one hotel handoff breaks.</h2>
            <p>
              Bring one recent guest issue, maintenance request, room-readiness problem, or
              inspection finding. We will map the handoff instead of delivering a generic demo.
            </p>
            <a className={styles.lightButton} href="/en/handoff-scan" data-track="scan_section_click">
              Request My Handoff Scan
            </a>
          </div>
          <ol className={styles.scanSteps}>
            <li><span>01</span><div><strong>Bring one real example.</strong><p>No slide deck or process documentation required.</p></div></li>
            <li><span>02</span><div><strong>Score the five controls.</strong><p>Ownership, due time, escalation, proof, and manager visibility.</p></div></li>
            <li><span>03</span><div><strong>Receive a one-page map.</strong><p>Within one business day, including one improvement usable without Whagons.</p></div></li>
          </ol>
        </section>

        <section className={styles.section} id="pilot">
          <div className={styles.pilotHeader}>
            <div>
              <p className={styles.eyebrow}>The focused implementation</p>
              <h2>45-Day Hotel Handoff Control Pilot</h2>
              <p>
                Start with two high-consequence workflows at one property. Measure whether
                ownership, timeliness, proof, and manager visibility improve before expanding.
              </p>
            </div>
            <div className={styles.priceCard}>
              <span>Design-partner pilot</span>
              <strong>$2,500</strong>
              <small>50% at kickoff · 50% when the first workflow is live</small>
            </div>
          </div>
          <div className={styles.stackGrid}>
            {pilotStack.map(([number, title, text]) => (
              <article className={styles.stackCard} key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className={styles.guarantee}>
            <p className={styles.eyebrow}>Workflow Live Guarantee</p>
            <h3>The implementation risk should sit with us when the delay is ours.</h3>
            <p>
              If the hotel provides the agreed sponsor, workflow information, users, decisions,
              and attendance on time, the first workflow is scheduled to go live within seven
              business days. If Whagons misses for a Whagons-controlled reason, the second payment
              is deferred and implementation continues at no added cost. If it is still not live
              14 calendar days later for a Whagons-controlled reason, the hotel may cancel and owes
              no second payment.
            </p>
          </div>
          <p className={styles.pilotCredit}>
            The full pilot fee is credited toward the first annual agreement when signed within
            15 days of the day-45 results review. The pilot itself requires no annual commitment.
          </p>
        </section>

        <section className={`${styles.section} ${styles.productSection}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The operating layer</p>
            <h2>Configure the workflow. Keep the hotel&apos;s existing systems.</h2>
            <p>
              Hotel roles, terminology, groups, due times, escalation rules, checklists, photos,
              approvals, and dashboards are configured around the selected workflow.
            </p>
          </div>
          <HotelWorkflowPreview />
        </section>

        <section className={`${styles.section} ${styles.proofSection}`} id="proof">
          <div className={styles.proofLead}>
            <p className={styles.eyebrow}>Proof, stated accurately</p>
            <h2>The U.S. hotel pilot program is new. The operating foundation is not.</h2>
            <p>
              Whagons has existing operational users in Latin America. We do not present those
              outcomes as U.S. hotel results. The first Sacramento-area design partner will
              establish the first local hotel baseline.
            </p>
          </div>
          <div className={styles.awardCard}>
            <span aria-hidden="true">★</span>
            <div>
              <strong>Innovative Product of the Year</strong>
              <p>Exphore Expo Hoteles &amp; Restaurantes · 2017</p>
              <small>Awarded under the former DingDone name</small>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.fitSection}`}>
          <div className={styles.fitColumn}>
            <p className={styles.eyebrow}>Good pilot fit</p>
            <h2>Start when one handoff matters enough to measure.</h2>
            <ul>
              <li>A manager can sponsor one property and make timely decisions.</li>
              <li>The workflow crosses departments, people, or shifts.</li>
              <li>The hotel can identify users and attend a short weekly review.</li>
            </ul>
          </div>
          <div className={styles.fitColumn}>
            <p className={styles.eyebrow}>Not the right fit</p>
            <h2>Do not start with a platform-wide transformation.</h2>
            <ul>
              <li>You need a PMS replacement rather than workflow control.</li>
              <li>No internal owner can participate in implementation.</li>
              <li>You require guaranteed revenue, guest-score, or labor outcomes.</li>
            </ul>
          </div>
        </section>

        <section className={styles.finalCta}>
          <p className={styles.eyebrow}>One workflow. Twenty minutes.</p>
          <h2>Bring the handoff your managers are tired of chasing.</h2>
          <a className={styles.primaryButton} href="/en/handoff-scan" data-track="final_scan_click">
            Request a Hotel Handoff Leak Scan
          </a>
          <p>Available to hotels and hotel management companies in the Sacramento metro launch market.</p>
        </section>
      </main>
    </>
  );
}
