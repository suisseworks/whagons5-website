import { useState, FormEvent } from 'react';
import Nav from '../components/Nav';
import CustomCursor from '../components/CustomCursor';
import ScrollReveal from '../components/ScrollReveal';

const INDUSTRIES = [
  { n: '01', name: 'HOTELERIA', desc: 'Control de housekeeping, mantenimiento y solicitudes en tiempo real' },
  { n: '02', name: 'RETAIL', desc: 'Auditorias, aperturas y cierres coordinados entre sucursales' },
  { n: '03', name: 'MANTENIMIENTO INDUSTRIAL', desc: 'Ordenes de trabajo, activos y mantenimiento preventivo' },
  { n: '04', name: 'FARMA Y ALIMENTOS', desc: 'Registros auditables, trazabilidad y cumplimiento regulatorio' },
  { n: '05', name: 'EDUCACION Y SALUD', desc: 'Gestion de instalaciones, rondas y protocolos operativos' },
  { n: '06', name: 'CONSTRUCCION', desc: 'Seguimiento de avance, seguridad y recursos en campo' },
];

const INDUSTRY_OPTIONS = [
  'Hoteleria / Hospitalidad',
  'Retail / Comercio',
  'Mantenimiento Industrial',
  'Farma / Alimentos',
  'Educacion',
  'Construccion',
  'Otra',
];

const TEAM_SIZES = [
  '1\u201310 personas',
  '11\u201350 personas',
  '51\u2013200 personas',
  '200+ personas',
];

export default function Home() {
  const [briefSubmitted, setBriefSubmitted] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleBriefSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBriefSubmitted(true);
  };

  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <>
      <CustomCursor />
      <Nav />
      <ScrollReveal />

      {/* ══ HERO ══════════════════════════════════ */}
      <section id="hero">
        <div className="hero-bg-word" aria-hidden="true">OPERA</div>

        <div className="hero-ticker" aria-hidden="true">
          <span>Gestion operacional</span>
          <span className="ticker-dot">&#9679;</span>
          <span>Tiempo real</span>
          <span className="ticker-dot">&#9679;</span>
          <span>Cualquier industria</span>
        </div>

        <div className="hero-stamp">Est. 2021</div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          <div className="scroll-label">Scroll</div>
        </div>

        <div className="hero-headline">
          <span className="hl-line"><span>TUS EQUIPOS,</span></span>
          <span className="hl-line outline"><span>SIEMPRE</span></span>
          <span className="hl-line accent"><span>EN CONTROL.</span></span>
        </div>

        <div className="hero-foot">
          <p className="hero-desc">
            Conecta equipos operativos, centraliza tareas y analiza tu operacion
            en tiempo real &mdash; para cualquier industria, sin importar el dispositivo.
          </p>
          <div className="hero-ctas">
            <a href="#brief" className="cta-primary">Obten tu brief &rarr;</a>
            <a href="#demo" className="cta-ghost">Solicitar demo <span>&nearr;</span></a>
          </div>
        </div>
      </section>

      {/* ── STATEMENT ──────────────────────────── */}
      <section id="statement">
        <div className="eyebrow r">El problema</div>
        <div className="stmt r d1">
          La mayoria de las operaciones funcionan <em>sin datos reales.</em> Los
          equipos trabajan, pero nadie sabe exactamente como, cuando ni donde. Lo
          que no se mide, no existe.
        </div>
      </section>

      {/* ── HOW ────────────────────────────────── */}
      <section id="how">
        <div className="how-top r">
          <div className="how-title">COMO FUNCIONA</div>
          <div className="eyebrow" style={{ alignSelf: 'flex-end' }}>3 pasos</div>
        </div>
        <div className="how-steps">
          <div className="h-step r">
            <div className="hs-n">01</div>
            <div className="hs-t">Configura tu operacion</div>
            <p className="hs-d">
              Define equipos, roles, activos y checklists en minutos. Sin necesidad
              de IT. Sin migraciones complicadas.
            </p>
          </div>
          <div className="h-step r d1">
            <div className="hs-n">02</div>
            <div className="hs-t">Asigna y ejecuta</div>
            <p className="hs-d">
              Tus colaboradores reciben y reportan tareas desde la app &mdash; con o
              sin internet &mdash; con evidencia fotografica.
            </p>
          </div>
          <div className="h-step r d2">
            <div className="hs-n">03</div>
            <div className="hs-t">Mide y decide</div>
            <p className="hs-d">
              Dashboard en tiempo real. Eficiencia, cumplimiento y rendimiento de
              cada equipo en un solo lugar.
            </p>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────── */}
      <section id="industries">
        <div className="ind-top r">
          <div className="ind-title">INDUSTRIAS</div>
          <div className="ind-sub">10+ sectores</div>
        </div>
        <div className="r">
          {INDUSTRIES.map(ind => (
            <div className="ind-row" key={ind.n}>
              <span className="i-n">{ind.n}</span>
              <span className="i-name">{ind.name}</span>
              <span className="i-desc">{ind.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRIEF ──────────────────────────────── */}
      <section id="brief">
        <div className="brief-top r">
          <div className="brief-title">
            BRIEF<br />GRATUITO
          </div>
          <p className="brief-sub">
            Dejanos tu correo e industria. Te enviamos un brief personalizado con
            modulos, flujos y resultados esperados.
          </p>
        </div>
        <div className="brief-body">
          <div className="brief-info r">
            <p>
              Descubre en minutos si Whagons es la solucion para tu operacion
              &mdash; sin una llamada de ventas.
            </p>
            <ul>
              <li>Modulos recomendados para tu industria</li>
              <li>Flujos de trabajo sugeridos</li>
              <li>Resultados esperados con datos reales</li>
              <li>Sin spam, solo informacion relevante</li>
            </ul>
          </div>
          <div className="r d1">
            {!briefSubmitted ? (
              <form id="brief-form" onSubmit={handleBriefSubmit}>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="b-email">Correo electronico</label>
                  <input className="f-inp" id="b-email" type="email" placeholder="tu@empresa.com" required />
                </div>
                <div className="f-line">
                  <label className="f-lbl" htmlFor="b-ind">Industria</label>
                  <select className="f-inp" id="b-ind" required defaultValue="">
                    <option value="" disabled>Selecciona</option>
                    {INDUSTRY_OPTIONS.map(opt => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="f-actions">
                  <button type="submit" className="btn-black">Recibir brief &rarr;</button>
                  <p className="f-note">Sin spam. Solo informacion relevante para tu industria.</p>
                </div>
              </form>
            ) : (
              <div className="f-success" style={{ display: 'block' }}>
                Perfecto &mdash; revisa tu correo en los proximos minutos.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── DEMO ───────────────────────────────── */}
      <section id="demo">
        <div className="demo-top r">
          <div className="demo-title">
            SOLICITA<br />UN DEMO
          </div>
          <p className="demo-sub">
            Un especialista te contacta con una demo personalizada para tu industria.
            Sin compromiso.
          </p>
        </div>
        <div className="demo-body">
          <div className="r">
            <ul className="demo-perks">
              <li className="demo-perk">
                <span className="dp-n">01</span>
                <span className="dp-t">Setup en menos de un dia. Sin migraciones ni dependencia de IT.</span>
              </li>
              <li className="demo-perk">
                <span className="dp-n">02</span>
                <span className="dp-t">Demo 100% adaptado a tu industria y caso de uso real.</span>
              </li>
              <li className="demo-perk">
                <span className="dp-n">03</span>
                <span className="dp-t">Sin contratos anuales forzados. Empiezas cuando estas listo.</span>
              </li>
              <li className="demo-perk">
                <span className="dp-n">04</span>
                <span className="dp-t">Te contactamos en menos de 24 horas habiles.</span>
              </li>
            </ul>
          </div>
          <div className="r d1">
            {!demoSubmitted ? (
              <form id="demo-form" onSubmit={handleDemoSubmit}>
                <div className="demo-form-grid">
                  <div className="f-line">
                    <label className="f-lbl">Nombre</label>
                    <input className="f-inp" type="text" placeholder="Juan Garcia" required />
                  </div>
                  <div className="f-line">
                    <label className="f-lbl">Empresa</label>
                    <input className="f-inp" type="text" placeholder="Acme Corp" required />
                  </div>
                  <div className="f-line">
                    <label className="f-lbl">Correo</label>
                    <input className="f-inp" type="email" placeholder="juan@empresa.com" required />
                  </div>
                  <div className="f-line">
                    <label className="f-lbl">Telefono</label>
                    <input className="f-inp" type="tel" placeholder="+506 8888 0000" />
                  </div>
                  <div className="f-line span2">
                    <label className="f-lbl">Industria</label>
                    <select className="f-inp" required defaultValue="">
                      <option value="" disabled>Selecciona</option>
                      {INDUSTRY_OPTIONS.map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="f-line span2">
                    <label className="f-lbl">Tamano del equipo operativo</label>
                    <select className="f-inp">
                      {TEAM_SIZES.map(size => (
                        <option key={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="f-actions" style={{ marginTop: 40 }}>
                  <button type="submit" className="btn-black">Solicitar demo &rarr;</button>
                  <p className="f-note">Te contactamos en menos de 24 horas habiles.</p>
                </div>
              </form>
            ) : (
              <div className="f-success" style={{ display: 'block' }}>
                Recibido &mdash; un especialista se pondra en contacto pronto.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────── */}
      <section id="contact">
        <div className="contact-inner r">
          <div className="contact-h">
            &#191;TIENES<br />PREGUNTAS?
          </div>
          <div className="contact-links">
            <a href="mailto:info@whagons.com" className="c-link">&#9993; info@whagons.com</a>
            <a href="https://wa.me/50684102321" className="c-link" target="_blank" rel="noopener noreferrer">
              &nearr; WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer>
        <div className="f-logo">
          <img src="/whagons.svg" alt="Whagons" style={{ height: 16, width: 'auto', opacity: 0.6 }} />
        </div>
        <div className="f-tag">Si se puede medir, se puede mejorar.</div>
        <div className="f-copy">&copy; 2025 Whagons International</div>
      </footer>
    </>
  );
}
