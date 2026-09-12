import HandoffScanForm from './HandoffScanForm';
import HospitalityAnalytics from './HospitalityAnalytics';

const controls = ['Ownership', 'Due time', 'Escalation', 'Proof', 'Manager visibility'];

export default function HandoffScanPage() {
  return (
    <>
      <HospitalityAnalytics page="handoff_scan" />
      <main className="pg">
        <section className="pg-hero">
          <div className="pg-hero-inner pg-hero-split">
            <div className="pg-hero-copy">
              <p className="pg-eyebrow">Free · 20 minutes · Sacramento launch market</p>
              <h1>Find where one hotel handoff breaks.</h1>
              <p className="pg-lead">
                Bring one recent guest issue, maintenance request, room-readiness problem, shift
                handoff, or inspection finding. We will map what happened and show where control was lost.
              </p>
              <ul className="pg-points">
                <li>No generic demo</li>
                <li>One-page score within one business day</li>
                <li>No purchase obligation</li>
              </ul>
            </div>
            <div className="pg-panel" id="request-form">
              <p className="pg-eyebrow">Request the working session</p>
              <h2 style={{ fontSize: '1.5rem' }}>Tell us which handoff you want to examine.</h2>
              <p className="pg-small" style={{ marginTop: 10, marginBottom: 24 }}>
                Your request is reviewed directly by the U.S. hospitality lead, not sent to the
                Latin America WhatsApp route or a generic newsletter list.
              </p>
              <HandoffScanForm />
            </div>
          </div>
        </section>

        <section className="pg-section">
          <div className="pg-split">
            <div>
              <p className="pg-eyebrow">What to bring</p>
              <h2>A real example, not a prepared presentation.</h2>
              <p className="pg-text" style={{ marginTop: 14 }}>
                Choose something recent enough that you remember who reported it, who received it,
                when it became late, and how completion was confirmed.
              </p>
              <p className="pg-eyebrow" style={{ marginTop: 36 }}>What you receive</p>
              <ul className="pg-checks">
                <li>A current-state handoff map.</li>
                <li>A score across the five operating controls.</li>
                <li>One process improvement usable without Whagons.</li>
                <li>A fit, not-yet, or no-fit recommendation.</li>
              </ul>
            </div>
            <div className="pg-card pg-card-raised" style={{ padding: 28 }}>
              <p className="pg-eyebrow" style={{ marginBottom: 4 }}>Your handoff score</p>
              <ol className="pg-steps">
                {controls.map((item, index) => (
                  <li key={item}>
                    <span className="pg-num">0{index + 1}</span>
                    <h3>{item}</h3>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="pg-cta">
          <div>
            <h2>Bilingual rollout is available when it helps frontline adoption.</h2>
            <p className="pg-text">We will ask what languages the people performing the selected workflow use day to day.</p>
            <div className="pg-actions">
              <a className="pg-btn-secondary" href="#request-form">Request the working session</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
