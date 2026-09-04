import Image from 'next/image';
import { Language, routeFor } from '../../lib/locales';
import styles from './HomePage.module.css';

const content = {
  en: {
    heroEyebrow: 'Operations software for hotels',
    heroTitle: <><span>Hotel operations.</span><em>No blind spots.</em></>,
    heroLead:
      'Connect guest requests, room readiness, maintenance, inspections, and shifts in one operating view. Every job gets an owner, a due time, and proof it was done.',
    primaryCta: 'Request a tailored demo',
    secondaryCta: 'See how it works',
    heroPoints: ['Works alongside your PMS', 'Mobile + web', 'Configured to your operation', 'Across Latin America'],
    heroAlt: 'Hotel pool and guest areas at sunset',
    liveWorkflow: 'Illustrative hotel workflow',
    managerView: 'Manager view',
    workflowTitle: 'Guest room A/C issue',
    room: 'Room 418',
    workflowRows: [
      ['Guest request', 'Front desk', 'Captured'],
      ['Engineering', 'Due 10:30', 'In progress'],
      ['Guest follow-up', 'Photo + note', 'Next'],
    ],
    workflowControls: ['Owner', 'Due time', 'Escalation', 'Evidence'],
    signalItems: [
      ['Guest requests', 'One visible owner'],
      ['Room readiness', 'Across departments'],
      ['Maintenance', 'Planned and reactive'],
      ['Standards', 'Evidence on every shift'],
    ],
    signalAria: 'Hotel operating moments',
    problemEyebrow: 'The operational layer',
    problemTitle: 'The work between teams should never disappear between shifts.',
    problemText:
      'Your PMS knows the stay. Whagons coordinates the work around it—across front desk, housekeeping, engineering, food and beverage, security, and leadership.',
    moments: [
      {
        number: '01',
        title: 'Guest requests',
        text: 'Route every request to the right team, set the response time, and keep the front desk informed through resolution.',
        tag: 'Service recovery',
      },
      {
        number: '02',
        title: 'Room readiness',
        text: 'Connect housekeeping, inspections, and maintenance so blockers are visible before they affect the guest.',
        tag: 'Cross-team handoffs',
      },
      {
        number: '03',
        title: 'Maintenance',
        text: 'Manage preventive plans and urgent work orders with ownership, priority, history, photos, and completion evidence.',
        tag: 'Assets + work orders',
      },
      {
        number: '04',
        title: 'Quality & compliance',
        text: 'Turn standards into repeatable checklists, inspections, approvals, and auditable records for every property.',
        tag: 'SOPs + inspections',
      },
    ],
    processEyebrow: 'From signal to certainty',
    processTitle: <>Capture it. Coordinate it. <em>Prove it.</em></>,
    processLead:
      'Whagons makes the full operational loop visible—from the first signal on the floor to a verified result managers can review.',
    platformCta: 'Explore the platform',
    steps: [
      ['Capture', 'Create work from a phone, computer, form, QR code, schedule, or connected system.'],
      ['Coordinate', 'Assign owners, due times, priorities, approvals, and escalation rules that match the hotel.'],
      ['Improve', 'Verify completion, review patterns, and use real operating data to strengthen the next shift.'],
    ],
    productEyebrow: 'A clearer operating picture',
    productTitle: 'One view for every shift. The right detail for every role.',
    productText:
      'Frontline teams see what to do next. Managers see exceptions before they become guest problems. Leaders see the patterns behind performance.',
    dashboardTitle: 'Hotel operations',
    dashboardSubtitle: 'Today · All departments · Illustrative',
    dashboardMetrics: [
      ['Open', '38'],
      ['On time', '91%'],
      ['At risk', '6'],
      ['Completed', '124'],
    ],
    dashboardFeed: 'Live workflow',
    now: 'Now',
    dashboardRows: [
      ['Room 418 · A/C', 'Engineering', '12 min left'],
      ['Arrival inspection', 'Housekeeping', 'Review'],
      ['Pool checklist', 'Recreation', 'Completed'],
    ],
    capabilities: [
      ['Workflow automation', 'Move recurring and reactive work forward automatically.'],
      ['Mobile fieldwork', 'Photos, forms, signatures, QR, barcode, GPS, and NFC.'],
      ['Escalations & approvals', 'Keep important work moving without manager follow-up.'],
      ['Analytics & AI', 'Find delays, recurring issues, and the next action faster.'],
      ['SOPs & knowledge', 'Keep procedures and training where the work happens.'],
      ['API & integrations', 'Connect the hotel systems your teams already rely on.'],
    ],
    featuresPrompt: 'Need the complete capability map?',
    featuresCta: 'Explore all features',
    proofEyebrow: 'Experience beyond the hotel lobby',
    proofTitle: 'Built on years of real operational work.',
    proofText:
      'Whagons supports operational teams across Latin America. Our hotel focus brings that same discipline to the moments where service, teams, and shifts meet.',
    awardTitle: 'Innovative Product of the Year',
    awardEvent: 'Exphore Hotels & Restaurants Expo · 2017',
    awardNote: 'Awarded under the former DingDone name',
    proofCardEyebrow: 'Designed for practical adoption',
    proofCardTitle: 'Keep the PMS. Start with one workflow. Make the result visible.',
    proofCardItems: ['No PMS replacement', 'Mobile and desktop', 'Configured around hotel roles'],
    marketsEyebrow: 'One platform, more markets',
    priorityMarket: 'Priority market',
    marketsTitle: 'Hotels are the focus. Other operational teams are welcome.',
    marketsText:
      'The same operating principles—clear ownership, visible timing, consistent standards, and verified completion—also support complex work in other industries.',
    featuredMarket: ['Hospitality', 'The priority market for Whagons: guest service, rooms, maintenance, inspections, and every handoff between them.'],
    featuredLink: 'Explore hotel operations',
    markets: [
      ['Retail', 'Multi-location execution'],
      ['Industrial maintenance', 'Assets and field work'],
      ['Pharma & food', 'Traceability and compliance'],
      ['Health & education', 'Protocols and standards'],
      ['Construction', 'Progress and site control'],
    ],
    exploreMarket: 'Explore',
    finalEyebrow: 'Your operation, made visible',
    finalTitle: 'See Whagons around one real workflow from your hotel.',
    finalText:
      'We will focus the conversation on your teams, your handoffs, and the operational result you need—not a generic product tour.',
    finalCta: 'Request your demo',
  },
  es: {
    heroEyebrow: 'Software de operaciones para hoteles',
    heroTitle: <><span>Operación hotelera.</span><em>Sin puntos ciegos.</em></>,
    heroLead:
      'Conecta solicitudes de huéspedes, habitaciones, mantenimiento, inspecciones y turnos en una sola vista operativa. Cada tarea tiene responsable, plazo y evidencia de cierre.',
    primaryCta: 'Solicitar un demo personalizado',
    secondaryCta: 'Ver cómo funciona',
    heroPoints: ['Funciona junto a tu PMS', 'Móvil + web', 'Configurado para tu operación', 'En toda Latinoamérica'],
    heroAlt: 'Piscina y áreas de huéspedes de un hotel al atardecer',
    liveWorkflow: 'Flujo hotelero ilustrativo',
    managerView: 'Vista gerencial',
    workflowTitle: 'Problema de A/C en habitación',
    room: 'Habitación 418',
    workflowRows: [
      ['Solicitud del huésped', 'Recepción', 'Registrada'],
      ['Ingeniería', 'Vence 10:30', 'En progreso'],
      ['Seguimiento al huésped', 'Foto + nota', 'Siguiente'],
    ],
    workflowControls: ['Responsable', 'Plazo', 'Escalamiento', 'Evidencia'],
    signalItems: [
      ['Solicitudes de huéspedes', 'Un responsable visible'],
      ['Habitaciones listas', 'Entre departamentos'],
      ['Mantenimiento', 'Preventivo y reactivo'],
      ['Estándares', 'Evidencia en cada turno'],
    ],
    signalAria: 'Momentos operativos del hotel',
    problemEyebrow: 'La capa operativa',
    problemTitle: 'El trabajo entre equipos no debería perderse entre turnos.',
    problemText:
      'Tu PMS conoce la estadía. Whagons coordina el trabajo a su alrededor: recepción, ama de llaves, ingeniería, alimentos y bebidas, seguridad y liderazgo.',
    moments: [
      {
        number: '01',
        title: 'Solicitudes de huéspedes',
        text: 'Dirige cada solicitud al equipo correcto, define el tiempo de respuesta y mantén informada a recepción hasta resolverla.',
        tag: 'Recuperación del servicio',
      },
      {
        number: '02',
        title: 'Habitaciones listas',
        text: 'Conecta limpieza, inspecciones y mantenimiento para detectar bloqueos antes de que afecten al huésped.',
        tag: 'Entregas entre equipos',
      },
      {
        number: '03',
        title: 'Mantenimiento',
        text: 'Gestiona planes preventivos y órdenes urgentes con responsable, prioridad, historial, fotos y evidencia de cierre.',
        tag: 'Activos + órdenes',
      },
      {
        number: '04',
        title: 'Calidad y cumplimiento',
        text: 'Convierte estándares en listas, inspecciones, aprobaciones y registros auditables para cada propiedad.',
        tag: 'SOPs + inspecciones',
      },
    ],
    processEyebrow: 'De la señal a la certeza',
    processTitle: <>Captura. Coordina. <em>Comprueba.</em></>,
    processLead:
      'Whagons hace visible todo el ciclo operativo: desde la primera señal en el piso hasta un resultado verificado que la gerencia puede revisar.',
    platformCta: 'Explorar la plataforma',
    steps: [
      ['Captura', 'Crea trabajo desde un teléfono, computadora, formulario, código QR, programación o sistema conectado.'],
      ['Coordina', 'Asigna responsables, plazos, prioridades, aprobaciones y reglas de escalamiento según el hotel.'],
      ['Mejora', 'Verifica el cierre, revisa patrones y usa datos reales para fortalecer el siguiente turno.'],
    ],
    productEyebrow: 'Una imagen operativa más clara',
    productTitle: 'Una vista para cada turno. El detalle correcto para cada rol.',
    productText:
      'El personal ve qué hacer ahora. Los gerentes ven excepciones antes de que se conviertan en problemas para el huésped. Los líderes ven los patrones detrás del desempeño.',
    dashboardTitle: 'Operaciones del hotel',
    dashboardSubtitle: 'Hoy · Todos los departamentos · Ilustrativo',
    dashboardMetrics: [
      ['Abiertas', '38'],
      ['A tiempo', '91%'],
      ['En riesgo', '6'],
      ['Completadas', '124'],
    ],
    dashboardFeed: 'Flujo en vivo',
    now: 'Ahora',
    dashboardRows: [
      ['Hab. 418 · A/C', 'Ingeniería', '12 min restantes'],
      ['Inspección de llegada', 'Ama de llaves', 'Revisar'],
      ['Lista de piscina', 'Recreación', 'Completada'],
    ],
    capabilities: [
      ['Automatización de flujos', 'Mueve automáticamente el trabajo recurrente y reactivo.'],
      ['Trabajo móvil', 'Fotos, formularios, firmas, QR, códigos, GPS y NFC.'],
      ['Escalamientos y aprobaciones', 'Mantén el trabajo importante en marcha sin perseguir avances.'],
      ['Analítica e IA', 'Detecta demoras, problemas recurrentes y la próxima acción.'],
      ['SOPs y conocimiento', 'Ubica procedimientos y capacitación donde ocurre el trabajo.'],
      ['API e integraciones', 'Conecta los sistemas que los equipos del hotel ya utilizan.'],
    ],
    featuresPrompt: '¿Necesitas el mapa completo de capacidades?',
    featuresCta: 'Explorar todas las funcionalidades',
    proofEyebrow: 'Experiencia más allá del lobby',
    proofTitle: 'Construido sobre años de trabajo operativo real.',
    proofText:
      'Whagons apoya equipos operativos en América Latina. Nuestro enfoque hotelero lleva esa misma disciplina a los momentos donde se encuentran el servicio, los equipos y los turnos.',
    awardTitle: 'Producto Innovador del Año',
    awardEvent: 'Exphore Expo Hoteles & Restaurantes · 2017',
    awardNote: 'Premio recibido bajo el nombre anterior DingDone',
    proofCardEyebrow: 'Diseñado para una adopción práctica',
    proofCardTitle: 'Conserva el PMS. Empieza con un flujo. Haz visible el resultado.',
    proofCardItems: ['Sin reemplazar el PMS', 'Móvil y escritorio', 'Configurado según los roles del hotel'],
    marketsEyebrow: 'Una plataforma, más mercados',
    priorityMarket: 'Mercado prioritario',
    marketsTitle: 'Los hoteles son el foco. Otros equipos operativos también son bienvenidos.',
    marketsText:
      'Los mismos principios operativos —responsabilidad clara, tiempos visibles, estándares consistentes y cierres verificados— apoyan trabajo complejo en otras industrias.',
    featuredMarket: ['Hotelería', 'El mercado prioritario de Whagons: servicio al huésped, habitaciones, mantenimiento, inspecciones y cada entrega entre equipos.'],
    featuredLink: 'Explorar operaciones hoteleras',
    markets: [
      ['Retail', 'Ejecución en múltiples sedes'],
      ['Mantenimiento industrial', 'Activos y trabajo en campo'],
      ['Farma y alimentos', 'Trazabilidad y cumplimiento'],
      ['Salud y educación', 'Protocolos y estándares'],
      ['Construcción', 'Avance y control en obra'],
    ],
    exploreMarket: 'Explorar',
    finalEyebrow: 'Tu operación, visible',
    finalTitle: 'Mira Whagons aplicado a un flujo real de tu hotel.',
    finalText:
      'Enfocaremos la conversación en tus equipos, tus entregas y el resultado operativo que necesitas; no en un recorrido genérico del producto.',
    finalCta: 'Solicitar mi demo',
  },
  pt: {
    heroEyebrow: 'Software de operações para hotéis',
    heroTitle: <><span>Operações hoteleiras.</span><em>Sem pontos cegos.</em></>,
    heroLead: 'Conecte solicitações de hóspedes, preparação de quartos, manutenção, inspeções e turnos em uma única visão operacional. Cada tarefa tem responsável, prazo e evidência de conclusão.',
    primaryCta: 'Solicitar uma demo personalizada',
    secondaryCta: 'Ver como funciona',
    heroPoints: ['Funciona junto ao seu PMS', 'Celular + web', 'Configurado para sua operação', 'Em toda a América Latina'],
    heroAlt: 'Piscina e áreas de hóspedes de um hotel ao entardecer',
    liveWorkflow: 'Fluxo hoteleiro ilustrativo',
    managerView: 'Visão gerencial',
    workflowTitle: 'Problema no ar-condicionado do quarto',
    room: 'Quarto 418',
    workflowRows: [
      ['Solicitação do hóspede', 'Recepção', 'Registrada'],
      ['Manutenção', 'Prazo 10:30', 'Em andamento'],
      ['Retorno ao hóspede', 'Foto + nota', 'Próximo'],
    ],
    workflowControls: ['Responsável', 'Prazo', 'Escalonamento', 'Evidência'],
    signalItems: [
      ['Solicitações de hóspedes', 'Um responsável visível'],
      ['Quartos prontos', 'Entre departamentos'],
      ['Manutenção', 'Planejada e reativa'],
      ['Padrões', 'Evidência em cada turno'],
    ],
    signalAria: 'Momentos operacionais do hotel',
    problemEyebrow: 'A camada operacional',
    problemTitle: 'O trabalho entre equipes não deveria desaparecer entre turnos.',
    problemText: 'Seu PMS conhece a estadia. O Whagons coordena o trabalho ao redor dela — recepção, governança, manutenção, alimentos e bebidas, segurança e liderança.',
    moments: [
      { number: '01', title: 'Solicitações de hóspedes', text: 'Direcione cada solicitação à equipe certa, defina o tempo de resposta e mantenha a recepção informada até a solução.', tag: 'Recuperação do serviço' },
      { number: '02', title: 'Quartos prontos', text: 'Conecte governança, inspeções e manutenção para tornar bloqueios visíveis antes de afetarem o hóspede.', tag: 'Entregas entre equipes' },
      { number: '03', title: 'Manutenção', text: 'Gerencie planos preventivos e ordens urgentes com responsável, prioridade, histórico, fotos e evidência.', tag: 'Ativos + ordens' },
      { number: '04', title: 'Qualidade e conformidade', text: 'Transforme padrões em listas, inspeções, aprovações e registros auditáveis para cada propriedade.', tag: 'POPs + inspeções' },
    ],
    processEyebrow: 'Do sinal à certeza',
    processTitle: <>Capture. Coordene. <em>Comprove.</em></>,
    processLead: 'O Whagons torna visível todo o ciclo operacional: do primeiro sinal no local até um resultado verificado que a gestão pode analisar.',
    platformCta: 'Conhecer a plataforma',
    steps: [
      ['Capture', 'Crie tarefas por celular, computador, formulário, QR code, programação ou sistema conectado.'],
      ['Coordene', 'Defina responsáveis, prazos, prioridades, aprovações e regras de escalonamento adequadas ao hotel.'],
      ['Melhore', 'Verifique a conclusão, identifique padrões e use dados reais para fortalecer o próximo turno.'],
    ],
    productEyebrow: 'Uma visão operacional mais clara',
    productTitle: 'Uma visão para cada turno. O detalhe certo para cada função.',
    productText: 'As equipes sabem o que fazer agora. Gestores veem exceções antes que se tornem problemas para o hóspede. Líderes enxergam os padrões por trás do desempenho.',
    dashboardTitle: 'Operações do hotel',
    dashboardSubtitle: 'Hoje · Todos os departamentos · Ilustrativo',
    dashboardMetrics: [['Abertas', '38'], ['No prazo', '91%'], ['Em risco', '6'], ['Concluídas', '124']],
    dashboardFeed: 'Fluxo ao vivo',
    now: 'Agora',
    dashboardRows: [['Quarto 418 · A/C', 'Manutenção', '12 min restantes'], ['Inspeção de chegada', 'Governança', 'Revisar'], ['Lista da piscina', 'Recreação', 'Concluída']],
    capabilities: [
      ['Automação de fluxos', 'Mova automaticamente o trabalho recorrente e reativo.'],
      ['Trabalho móvel', 'Fotos, formulários, assinaturas, QR, código de barras, GPS e NFC.'],
      ['Escalonamentos e aprovações', 'Mantenha o trabalho importante avançando sem cobranças manuais.'],
      ['Análises e IA', 'Encontre atrasos, problemas recorrentes e a próxima ação com mais rapidez.'],
      ['POPs e conhecimento', 'Mantenha procedimentos e treinamento onde o trabalho acontece.'],
      ['API e integrações', 'Conecte os sistemas de hotel que suas equipes já utilizam.'],
    ],
    featuresPrompt: 'Quer ver todas as capacidades?',
    featuresCta: 'Ver as funcionalidades na demo',
    proofEyebrow: 'Experiência além do lobby',
    proofTitle: 'Construído com anos de trabalho operacional real.',
    proofText: 'O Whagons apoia equipes operacionais na América Latina. Nosso foco em hotéis leva essa mesma disciplina aos momentos em que serviço, equipes e turnos se encontram.',
    awardTitle: 'Produto Inovador do Ano',
    awardEvent: 'Exphore Expo Hotéis e Restaurantes · 2017',
    awardNote: 'Prêmio recebido sob o nome anterior DingDone',
    proofCardEyebrow: 'Projetado para adoção prática',
    proofCardTitle: 'Mantenha o PMS. Comece com um fluxo. Torne o resultado visível.',
    proofCardItems: ['Sem substituir o PMS', 'Celular e computador', 'Configurado para as funções do hotel'],
    marketsEyebrow: 'Uma plataforma, mais mercados',
    priorityMarket: 'Mercado prioritário',
    marketsTitle: 'Hotéis são o foco. Outras equipes operacionais também são bem-vindas.',
    marketsText: 'Os mesmos princípios — responsabilidade clara, prazos visíveis, padrões consistentes e conclusões verificadas — apoiam trabalhos complexos em outros setores.',
    featuredMarket: ['Hotelaria', 'O mercado prioritário do Whagons: serviço ao hóspede, quartos, manutenção, inspeções e cada entrega entre equipes.'],
    featuredLink: 'Explorar operações hoteleiras',
    markets: [['Varejo', 'Execução em várias unidades'], ['Manutenção industrial', 'Ativos e trabalho em campo'], ['Farmacêutica e alimentos', 'Rastreabilidade e conformidade'], ['Saúde e educação', 'Protocolos e padrões'], ['Construção', 'Progresso e controle no local']],
    exploreMarket: 'Explorar',
    finalEyebrow: 'Sua operação, visível',
    finalTitle: 'Veja o Whagons aplicado a um fluxo real do seu hotel.',
    finalText: 'Vamos concentrar a conversa em suas equipes, suas entregas e no resultado operacional que você precisa — não em uma apresentação genérica do produto.',
    finalCta: 'Solicitar minha demo',
  },
  de: {
    heroEyebrow: 'Betriebssoftware für Hotels',
    heroTitle: <><span>Hotelbetrieb.</span><em>Ohne blinde Flecken.</em></>,
    heroLead: 'Verbinden Sie Gästeanfragen, Zimmerbereitschaft, Wartung, Inspektionen und Schichten in einer operativen Ansicht. Jede Aufgabe erhält eine verantwortliche Person, eine Frist und einen Abschlussnachweis.',
    primaryCta: 'Individuelle Demo anfordern',
    secondaryCta: 'So funktioniert es',
    heroPoints: ['Ergänzt Ihr PMS', 'Mobil + Web', 'Auf Ihren Betrieb zugeschnitten', 'In ganz Lateinamerika'],
    heroAlt: 'Hotelpool und Gästebereiche bei Sonnenuntergang',
    liveWorkflow: 'Beispielhafter Hotelablauf',
    managerView: 'Managementansicht',
    workflowTitle: 'Klimaanlage im Gästezimmer',
    room: 'Zimmer 418',
    workflowRows: [['Gästeanfrage', 'Rezeption', 'Erfasst'], ['Haustechnik', 'Fällig 10:30', 'In Bearbeitung'], ['Rückmeldung an Gast', 'Foto + Notiz', 'Als Nächstes']],
    workflowControls: ['Verantwortlich', 'Frist', 'Eskalation', 'Nachweis'],
    signalItems: [['Gästeanfragen', 'Eine sichtbare Verantwortung'], ['Zimmerbereitschaft', 'Abteilungsübergreifend'], ['Wartung', 'Geplant und reaktiv'], ['Standards', 'Nachweis in jeder Schicht']],
    signalAria: 'Operative Momente im Hotel',
    problemEyebrow: 'Die operative Ebene',
    problemTitle: 'Arbeit zwischen Teams darf beim Schichtwechsel nicht verschwinden.',
    problemText: 'Ihr PMS kennt den Aufenthalt. Whagons koordiniert die Arbeit darum herum — zwischen Rezeption, Housekeeping, Haustechnik, Gastronomie, Sicherheit und Leitung.',
    moments: [
      { number: '01', title: 'Gästeanfragen', text: 'Leiten Sie jede Anfrage an das richtige Team weiter, setzen Sie eine Reaktionszeit und halten Sie die Rezeption bis zur Lösung informiert.', tag: 'Servicewiederherstellung' },
      { number: '02', title: 'Zimmerbereitschaft', text: 'Verbinden Sie Housekeeping, Inspektionen und Wartung, damit Hindernisse sichtbar werden, bevor sie Gäste beeinträchtigen.', tag: 'Teamübergaben' },
      { number: '03', title: 'Wartung', text: 'Steuern Sie vorbeugende Pläne und dringende Aufträge mit Verantwortung, Priorität, Verlauf, Fotos und Nachweisen.', tag: 'Anlagen + Aufträge' },
      { number: '04', title: 'Qualität und Compliance', text: 'Machen Sie aus Standards wiederholbare Checklisten, Inspektionen, Freigaben und auditierbare Nachweise.', tag: 'SOPs + Inspektionen' },
    ],
    processEyebrow: 'Vom Signal zur Gewissheit',
    processTitle: <>Erfassen. Koordinieren. <em>Nachweisen.</em></>,
    processLead: 'Whagons macht den gesamten operativen Kreislauf sichtbar — vom ersten Signal vor Ort bis zum geprüften Ergebnis für das Management.',
    platformCta: 'Plattform kennenlernen',
    steps: [['Erfassen', 'Erstellen Sie Aufgaben per Smartphone, Computer, Formular, QR-Code, Zeitplan oder angebundenem System.'], ['Koordinieren', 'Definieren Sie Verantwortliche, Fristen, Prioritäten, Freigaben und Eskalationsregeln passend zum Hotel.'], ['Verbessern', 'Prüfen Sie Abschlüsse, erkennen Sie Muster und stärken Sie mit echten Betriebsdaten die nächste Schicht.']],
    productEyebrow: 'Ein klareres Betriebsbild',
    productTitle: 'Eine Ansicht für jede Schicht. Die richtigen Details für jede Rolle.',
    productText: 'Mitarbeitende sehen, was als Nächstes zu tun ist. Führungskräfte erkennen Ausnahmen, bevor sie zu Gästeproblemen werden. Die Leitung sieht die Muster hinter der Leistung.',
    dashboardTitle: 'Hotelbetrieb',
    dashboardSubtitle: 'Heute · Alle Abteilungen · Beispiel',
    dashboardMetrics: [['Offen', '38'], ['Pünktlich', '91%'], ['Gefährdet', '6'], ['Erledigt', '124']],
    dashboardFeed: 'Live-Ablauf',
    now: 'Jetzt',
    dashboardRows: [['Zimmer 418 · Klima', 'Haustechnik', 'Noch 12 Min.'], ['Anreiseinspektion', 'Housekeeping', 'Prüfen'], ['Pool-Checkliste', 'Freizeit', 'Erledigt']],
    capabilities: [['Workflow-Automatisierung', 'Bringen Sie wiederkehrende und reaktive Arbeit automatisch voran.'], ['Mobile Arbeit', 'Fotos, Formulare, Unterschriften, QR, Barcode, GPS und NFC.'], ['Eskalationen und Freigaben', 'Halten Sie wichtige Arbeit ohne manuelles Nachfassen in Bewegung.'], ['Analysen und KI', 'Erkennen Sie Verzögerungen, wiederkehrende Probleme und nächste Schritte schneller.'], ['SOPs und Wissen', 'Stellen Sie Verfahren und Schulungen dort bereit, wo die Arbeit stattfindet.'], ['API und Integrationen', 'Verbinden Sie die Hotelsysteme, auf die Ihre Teams bereits vertrauen.']],
    featuresPrompt: 'Möchten Sie alle Funktionen sehen?',
    featuresCta: 'Funktionen in der Demo ansehen',
    proofEyebrow: 'Erfahrung über die Hotellobby hinaus',
    proofTitle: 'Auf jahrelanger echter Betriebserfahrung aufgebaut.',
    proofText: 'Whagons unterstützt operative Teams in Lateinamerika. Unser Hotelfokus bringt dieselbe Disziplin an die Schnittstellen von Service, Teams und Schichten.',
    awardTitle: 'Innovatives Produkt des Jahres',
    awardEvent: 'Exphore Hotel- und Restaurantmesse · 2017',
    awardNote: 'Ausgezeichnet unter dem früheren Namen DingDone',
    proofCardEyebrow: 'Für die praktische Einführung entwickelt',
    proofCardTitle: 'Behalten Sie Ihr PMS. Starten Sie mit einem Ablauf. Machen Sie das Ergebnis sichtbar.',
    proofCardItems: ['Kein PMS-Ersatz', 'Mobil und Desktop', 'Auf Hotelrollen zugeschnitten'],
    marketsEyebrow: 'Eine Plattform, weitere Märkte',
    priorityMarket: 'Schwerpunktmarkt',
    marketsTitle: 'Hotels stehen im Mittelpunkt. Andere operative Teams sind ebenfalls willkommen.',
    marketsText: 'Dieselben Prinzipien — klare Verantwortung, sichtbare Fristen, einheitliche Standards und geprüfte Abschlüsse — unterstützen komplexe Arbeit in weiteren Branchen.',
    featuredMarket: ['Hotellerie', 'Der Schwerpunktmarkt von Whagons: Gästeservice, Zimmer, Wartung, Inspektionen und jede Übergabe dazwischen.'],
    featuredLink: 'Hotelbetrieb entdecken',
    markets: [['Einzelhandel', 'Umsetzung an mehreren Standorten'], ['Industrielle Instandhaltung', 'Anlagen und Außeneinsätze'], ['Pharma und Lebensmittel', 'Rückverfolgbarkeit und Compliance'], ['Gesundheit und Bildung', 'Protokolle und Standards'], ['Bauwesen', 'Fortschritt und Baustellenkontrolle']],
    exploreMarket: 'Entdecken',
    finalEyebrow: 'Ihr Betrieb, sichtbar gemacht',
    finalTitle: 'Erleben Sie Whagons anhand eines echten Ablaufs Ihres Hotels.',
    finalText: 'Wir konzentrieren uns auf Ihre Teams, Ihre Übergaben und das operative Ergebnis, das Sie benötigen — nicht auf eine allgemeine Produkttour.',
    finalCta: 'Demo anfordern',
  },
  it: {
    heroEyebrow: 'Software operativo per hotel',
    heroTitle: <><span>Operazioni alberghiere.</span><em>Senza punti ciechi.</em></>,
    heroLead: 'Collega richieste degli ospiti, preparazione delle camere, manutenzione, ispezioni e turni in un’unica vista operativa. Ogni attività ha un responsabile, una scadenza e una prova di completamento.',
    primaryCta: 'Richiedi una demo personalizzata',
    secondaryCta: 'Scopri come funziona',
    heroPoints: ['Funziona insieme al tuo PMS', 'Mobile + web', 'Configurato per la tua operatività', 'In tutta l’America Latina'],
    heroAlt: 'Piscina e aree ospiti di un hotel al tramonto',
    liveWorkflow: 'Flusso alberghiero di esempio',
    managerView: 'Vista gestionale',
    workflowTitle: 'Problema A/C nella camera',
    room: 'Camera 418',
    workflowRows: [['Richiesta dell’ospite', 'Reception', 'Registrata'], ['Manutenzione', 'Scadenza 10:30', 'In corso'], ['Riscontro all’ospite', 'Foto + nota', 'Prossimo']],
    workflowControls: ['Responsabile', 'Scadenza', 'Escalation', 'Prova'],
    signalItems: [['Richieste degli ospiti', 'Un responsabile visibile'], ['Camere pronte', 'Tra reparti'], ['Manutenzione', 'Pianificata e reattiva'], ['Standard', 'Prove a ogni turno']],
    signalAria: 'Momenti operativi dell’hotel',
    problemEyebrow: 'Il livello operativo',
    problemTitle: 'Il lavoro tra i team non dovrebbe perdersi tra un turno e l’altro.',
    problemText: 'Il tuo PMS conosce il soggiorno. Whagons coordina il lavoro che lo circonda — reception, housekeeping, manutenzione, ristorazione, sicurezza e direzione.',
    moments: [
      { number: '01', title: 'Richieste degli ospiti', text: 'Indirizza ogni richiesta al team giusto, definisci il tempo di risposta e tieni informata la reception fino alla risoluzione.', tag: 'Recupero del servizio' },
      { number: '02', title: 'Camere pronte', text: 'Collega housekeeping, ispezioni e manutenzione per rendere visibili i blocchi prima che incidano sull’ospite.', tag: 'Passaggi tra team' },
      { number: '03', title: 'Manutenzione', text: 'Gestisci piani preventivi e ordini urgenti con responsabile, priorità, cronologia, foto e prove.', tag: 'Asset + ordini' },
      { number: '04', title: 'Qualità e conformità', text: 'Trasforma gli standard in checklist, ispezioni, approvazioni e registri verificabili per ogni struttura.', tag: 'SOP + ispezioni' },
    ],
    processEyebrow: 'Dal segnale alla certezza',
    processTitle: <>Acquisisci. Coordina. <em>Dimostra.</em></>,
    processLead: 'Whagons rende visibile l’intero ciclo operativo: dal primo segnale sul campo a un risultato verificato che la direzione può esaminare.',
    platformCta: 'Scopri la piattaforma',
    steps: [['Acquisisci', 'Crea attività da telefono, computer, modulo, codice QR, pianificazione o sistema collegato.'], ['Coordina', 'Assegna responsabili, scadenze, priorità, approvazioni e regole di escalation adatte all’hotel.'], ['Migliora', 'Verifica il completamento, individua gli schemi e usa dati reali per rafforzare il turno successivo.']],
    productEyebrow: 'Un quadro operativo più chiaro',
    productTitle: 'Una vista per ogni turno. Il dettaglio giusto per ogni ruolo.',
    productText: 'Il personale vede cosa fare ora. I manager individuano le eccezioni prima che diventino problemi per l’ospite. La direzione vede gli schemi dietro le prestazioni.',
    dashboardTitle: 'Operazioni dell’hotel',
    dashboardSubtitle: 'Oggi · Tutti i reparti · Esempio',
    dashboardMetrics: [['Aperte', '38'], ['Puntuali', '91%'], ['A rischio', '6'], ['Completate', '124']],
    dashboardFeed: 'Flusso in tempo reale',
    now: 'Ora',
    dashboardRows: [['Camera 418 · A/C', 'Manutenzione', '12 min rimasti'], ['Ispezione arrivo', 'Housekeeping', 'Revisione'], ['Checklist piscina', 'Ricreazione', 'Completata']],
    capabilities: [['Automazione dei flussi', 'Fai avanzare automaticamente il lavoro ricorrente e reattivo.'], ['Lavoro mobile', 'Foto, moduli, firme, QR, codici a barre, GPS e NFC.'], ['Escalation e approvazioni', 'Mantieni in movimento il lavoro importante senza solleciti manuali.'], ['Analisi e IA', 'Individua più rapidamente ritardi, problemi ricorrenti e prossime azioni.'], ['SOP e conoscenza', 'Porta procedure e formazione dove avviene il lavoro.'], ['API e integrazioni', 'Collega i sistemi alberghieri già utilizzati dai tuoi team.']],
    featuresPrompt: 'Vuoi vedere tutte le funzionalità?',
    featuresCta: 'Vedi le funzionalità nella demo',
    proofEyebrow: 'Esperienza oltre la lobby',
    proofTitle: 'Costruito su anni di vero lavoro operativo.',
    proofText: 'Whagons supporta team operativi in America Latina. Il nostro focus sugli hotel porta la stessa disciplina nei momenti in cui servizio, team e turni si incontrano.',
    awardTitle: 'Prodotto innovativo dell’anno',
    awardEvent: 'Exphore Expo Hotel e Ristoranti · 2017',
    awardNote: 'Premio ricevuto con il precedente nome DingDone',
    proofCardEyebrow: 'Progettato per un’adozione concreta',
    proofCardTitle: 'Mantieni il PMS. Inizia da un flusso. Rendi visibile il risultato.',
    proofCardItems: ['Nessuna sostituzione del PMS', 'Mobile e desktop', 'Configurato sui ruoli dell’hotel'],
    marketsEyebrow: 'Una piattaforma, più mercati',
    priorityMarket: 'Mercato prioritario',
    marketsTitle: 'Gli hotel sono il focus. Anche altri team operativi sono i benvenuti.',
    marketsText: 'Gli stessi principi — responsabilità chiara, tempi visibili, standard coerenti e completamenti verificati — supportano il lavoro complesso in altri settori.',
    featuredMarket: ['Ospitalità', 'Il mercato prioritario di Whagons: servizio agli ospiti, camere, manutenzione, ispezioni e ogni passaggio tra i team.'],
    featuredLink: 'Esplora le operazioni alberghiere',
    markets: [['Vendita al dettaglio', 'Esecuzione in più sedi'], ['Manutenzione industriale', 'Asset e lavoro sul campo'], ['Farmaceutica e alimentare', 'Tracciabilità e conformità'], ['Sanità e istruzione', 'Protocolli e standard'], ['Costruzioni', 'Avanzamento e controllo del sito']],
    exploreMarket: 'Esplora',
    finalEyebrow: 'La tua operatività, visibile',
    finalTitle: 'Scopri Whagons applicato a un flusso reale del tuo hotel.',
    finalText: 'Concentreremo la conversazione sui tuoi team, sui passaggi e sul risultato operativo di cui hai bisogno — non su un tour generico del prodotto.',
    finalCta: 'Richiedi la mia demo',
  },
} as const;

const marketSlugs = ['retail', 'mantenimiento', 'farmaceutica', 'salud-educacion', 'construccion'];
const hotelMomentAnchors = ['guest-requests', 'room-readiness', 'engineering', 'inspection-correction'];

const customerNames = [
  'Grupo El Lagar',
  'Colegio Humboldt',
  'Rythmia',
  'IQS',
  'Grupo Colono',
  'Refritec',
];

const customerProof = {
  en: {
    eyebrow: 'Public customer evidence',
    title: 'Teams that have trusted Whagons.',
    text: 'With a presence across Latin America, published customer voices and an operational case make the result more concrete than a feature list alone.',
    clientsLabel: 'Organizations that have trusted Whagons',
    testimonialsLabel: 'What operations leaders have said',
    testimonials: [
      {
        quote: 'Whagons makes it easier to control day-to-day processes. It is a very useful and easy-to-use tool.',
        name: 'Leela Wernscheid',
        role: 'Operations Manager · Colegio Humboldt',
      },
      {
        quote: 'I am very satisfied, because keeping more than 1,500 employees aligned around one discipline is not easy.',
        name: 'Guido Tenorio',
        role: 'Operations Manager · Grupo El Lagar',
      },
      {
        quote: 'I recommend Whagons 100%. I believe in the tool and in the people behind Whagons.',
        name: 'Jorge Varela',
        role: 'General Manager · Rythmia',
      },
      {
        quote: 'Whagons has made ISO 9001:2015 certification easier.',
        name: 'Isaac Mena Chacón',
        role: 'Quality Manager · IQS',
      },
      {
        quote: 'Whagons has been very important because it allows us to monitor the company’s different areas.',
        name: 'William Ulate Loaiza',
        role: 'Operations Manager · Grupo Colono',
      },
      {
        quote: 'At Refritec we are 100% satisfied with Whagons because of our experience and the improvements achieved through its implementation.',
        name: 'Jonathan Gaitán',
        role: 'Manager · Refritec',
      },
    ],
    caseLabel: 'Anonymized case published by Whagons',
    caseTitle: 'From repeat visits to a digital equipment history.',
    caseText: 'A refrigeration maintenance team changed its operating flow in 60 days.',
    caseMetrics: [['−80%', 'repeat visits'], ['2 days → 4 hours', 'resolution time'], ['100%', 'digital equipment history']],
    sourceLabel: 'See public evidence',
  },
  es: {
    eyebrow: 'Evidencia pública de clientes',
    title: 'Equipos que han confiado en Whagons.',
    text: 'Con presencia en toda Latinoamérica, voces de clientes y un caso operativo publicado hacen el resultado más concreto que una lista de funcionalidades.',
    clientsLabel: 'Organizaciones que han confiado en Whagons',
    testimonialsLabel: 'Lo que han dicho líderes de operaciones',
    testimonials: [
      {
        quote: 'Facilita tener un control sobre los procesos del día a día. Es una herramienta muy útil y sencilla de utilizar.',
        name: 'Leela Wernscheid',
        role: 'Gerente de Operaciones · Colegio Humboldt',
      },
      {
        quote: 'De mi parte estoy muy satisfecho, porque controlar más de 1.500 empleados en una disciplina no es sencillo.',
        name: 'Guido Tenorio',
        role: 'Gerente de Operaciones · Grupo El Lagar',
      },
      {
        quote: 'Recomiendo Whagons al 100%. Creo en la herramienta y en la gente que trabaja para Whagons.',
        name: 'Jorge Varela',
        role: 'Gerente General · Rythmia',
      },
      {
        quote: 'Con Whagons, la certificación ISO 9001:2015 se ha facilitado.',
        name: 'Isaac Mena Chacón',
        role: 'Gerente de Calidad · IQS',
      },
      {
        quote: 'Whagons ha sido de gran importancia porque nos permite monitorear las diferentes áreas de la empresa.',
        name: 'William Ulate Loaiza',
        role: 'Gerente de Operaciones · Grupo Colono',
      },
      {
        quote: 'En Refritec estamos 100% satisfechos con Whagons por la experiencia vivida y las mejoras logradas con la implementación de esta herramienta.',
        name: 'Jonathan Gaitán',
        role: 'Gerente · Refritec',
      },
    ],
    caseLabel: 'Caso anonimizado publicado por Whagons',
    caseTitle: 'De visitas repetidas a un historial digital de equipos.',
    caseText: 'Un equipo de mantenimiento de refrigeración cambió su flujo operativo en 60 días.',
    caseMetrics: [['−80%', 'visitas repetidas'], ['2 días → 4 horas', 'tiempo de resolución'], ['100%', 'historial digital de equipos']],
    sourceLabel: 'Ver evidencia pública',
  },
  pt: {
    eyebrow: 'Evidência pública de clientes',
    title: 'Equipes que confiaram no Whagons.',
    text: 'Com presença em toda a América Latina, depoimentos publicados e um caso operacional tornam o resultado mais concreto do que uma lista de funcionalidades.',
    clientsLabel: 'Organizações que confiaram no Whagons',
    testimonialsLabel: 'O que líderes de operações disseram',
    testimonials: [
      { quote: 'Facilita o controle dos processos do dia a dia. É uma ferramenta muito útil e fácil de usar.', name: 'Leela Wernscheid', role: 'Gerente de Operações · Colegio Humboldt' },
      { quote: 'Estou muito satisfeito, porque manter mais de 1.500 funcionários alinhados em uma disciplina não é simples.', name: 'Guido Tenorio', role: 'Gerente de Operações · Grupo El Lagar' },
      { quote: 'Recomendo o Whagons 100%. Acredito na ferramenta e nas pessoas por trás do Whagons.', name: 'Jorge Varela', role: 'Gerente Geral · Rythmia' },
      { quote: 'Com o Whagons, a certificação ISO 9001:2015 ficou mais fácil.', name: 'Isaac Mena Chacón', role: 'Gerente de Qualidade · IQS' },
      { quote: 'O Whagons tem sido muito importante porque nos permite monitorar as diferentes áreas da empresa.', name: 'William Ulate Loaiza', role: 'Gerente de Operações · Grupo Colono' },
      { quote: 'Na Refritec estamos 100% satisfeitos com o Whagons pela experiência e pelas melhorias alcançadas com sua implementação.', name: 'Jonathan Gaitán', role: 'Gerente · Refritec' },
    ],
    caseLabel: 'Caso anonimizado publicado pelo Whagons',
    caseTitle: 'De visitas repetidas a um histórico digital de equipamentos.',
    caseText: 'Uma equipe de manutenção de refrigeração mudou seu fluxo operacional em 60 dias.',
    caseMetrics: [['−80%', 'visitas repetidas'], ['2 dias → 4 horas', 'tempo de resolução'], ['100%', 'histórico digital de equipamentos']],
    sourceLabel: 'Ver evidência pública',
  },
  de: {
    eyebrow: 'Öffentliche Kundennachweise',
    title: 'Teams, die Whagons vertraut haben.',
    text: 'Mit Präsenz in ganz Lateinamerika machen veröffentlichte Kundenstimmen und ein Betriebsfall das Ergebnis greifbarer als eine reine Funktionsliste.',
    clientsLabel: 'Organisationen, die Whagons vertraut haben',
    testimonialsLabel: 'Was Betriebsleiter berichtet haben',
    testimonials: [
      { quote: 'Whagons erleichtert die Kontrolle der täglichen Abläufe. Es ist ein sehr nützliches und einfach zu bedienendes Werkzeug.', name: 'Leela Wernscheid', role: 'Betriebsleiterin · Colegio Humboldt' },
      { quote: 'Ich bin sehr zufrieden, denn mehr als 1.500 Mitarbeitende in einer Disziplin auszurichten, ist nicht einfach.', name: 'Guido Tenorio', role: 'Betriebsleiter · Grupo El Lagar' },
      { quote: 'Ich empfehle Whagons zu 100 %. Ich glaube an das Werkzeug und an die Menschen hinter Whagons.', name: 'Jorge Varela', role: 'Geschäftsführer · Rythmia' },
      { quote: 'Mit Whagons wurde die ISO-9001:2015-Zertifizierung erleichtert.', name: 'Isaac Mena Chacón', role: 'Qualitätsleiter · IQS' },
      { quote: 'Whagons ist sehr wichtig, weil wir damit die verschiedenen Bereiche des Unternehmens überwachen können.', name: 'William Ulate Loaiza', role: 'Betriebsleiter · Grupo Colono' },
      { quote: 'Bei Refritec sind wir mit Whagons, unserer Erfahrung und den Verbesserungen durch die Einführung zu 100 % zufrieden.', name: 'Jonathan Gaitán', role: 'Geschäftsführer · Refritec' },
    ],
    caseLabel: 'Von Whagons veröffentlichter anonymisierter Fall',
    caseTitle: 'Von Wiederholungsbesuchen zur digitalen Anlagenhistorie.',
    caseText: 'Ein Kältetechnik-Team veränderte seinen Betriebsablauf in 60 Tagen.',
    caseMetrics: [['−80 %', 'Wiederholungsbesuche'], ['2 Tage → 4 Stunden', 'Lösungszeit'], ['100 %', 'digitale Anlagenhistorie']],
    sourceLabel: 'Öffentliche Nachweise ansehen',
  },
  it: {
    eyebrow: 'Prove pubbliche dei clienti',
    title: 'Team che hanno scelto Whagons.',
    text: 'Con una presenza in tutta l’America Latina, testimonianze pubblicate e un caso operativo rendono il risultato più concreto di un semplice elenco di funzionalità.',
    clientsLabel: 'Organizzazioni che hanno scelto Whagons',
    testimonialsLabel: 'Cosa hanno detto i responsabili operativi',
    testimonials: [
      { quote: 'Whagons facilita il controllo dei processi quotidiani. È uno strumento molto utile e facile da usare.', name: 'Leela Wernscheid', role: 'Responsabile Operazioni · Colegio Humboldt' },
      { quote: 'Sono molto soddisfatto, perché allineare più di 1.500 dipendenti in una disciplina non è semplice.', name: 'Guido Tenorio', role: 'Responsabile Operazioni · Grupo El Lagar' },
      { quote: 'Raccomando Whagons al 100%. Credo nello strumento e nelle persone dietro Whagons.', name: 'Jorge Varela', role: 'Direttore Generale · Rythmia' },
      { quote: 'Con Whagons, la certificazione ISO 9001:2015 è diventata più semplice.', name: 'Isaac Mena Chacón', role: 'Responsabile Qualità · IQS' },
      { quote: 'Whagons è stato molto importante perché ci permette di monitorare le diverse aree dell’azienda.', name: 'William Ulate Loaiza', role: 'Responsabile Operazioni · Grupo Colono' },
      { quote: 'In Refritec siamo soddisfatti al 100% di Whagons, dell’esperienza e dei miglioramenti ottenuti con la sua implementazione.', name: 'Jonathan Gaitán', role: 'Direttore · Refritec' },
    ],
    caseLabel: 'Caso anonimo pubblicato da Whagons',
    caseTitle: 'Dalle visite ripetute a uno storico digitale degli impianti.',
    caseText: 'Un team di manutenzione della refrigerazione ha trasformato il proprio flusso operativo in 60 giorni.',
    caseMetrics: [['−80%', 'visite ripetute'], ['2 giorni → 4 ore', 'tempo di risoluzione'], ['100%', 'storico digitale degli impianti']],
    sourceLabel: 'Vedi le prove pubbliche',
  },
} as const;

export default function HomePage({ lang }: { lang: Language }) {
  const t = content[lang];
  const proof = customerProof[lang];
  const hasLocalizedDetailPages = lang === 'en' || lang === 'es';
  const demoHref = routeFor(lang, 'demo');
  // The localized launch pages do not have a separate platform detail page yet.
  // From the process section, send visitors forward to the detailed feature
  // overview instead of linking back to the section they are already viewing.
  const platformHref = hasLocalizedDetailPages
    ? routeFor(lang, 'platform')
    : routeFor(lang, 'features');
  const featuresHref = hasLocalizedDetailPages ? routeFor(lang, 'features') : demoHref;
  const hotelHref = routeFor(lang, 'hotels');
  const industriesHref = routeFor(lang, 'markets');

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className={styles.heroLead}>{t.heroLead}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={demoHref}>{t.primaryCta}<span aria-hidden="true">→</span></a>
            <a className={styles.textButton} href="#how-it-works">{t.secondaryCta}<span aria-hidden="true">↓</span></a>
          </div>
          <div className={styles.heroPoints}>
            {t.heroPoints.map((point) => <span key={point}>{point}</span>)}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src="/images/industries/hoteleria.jpg"
            alt={t.heroAlt}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.photoWash} />
          <div className={styles.workflowCard}>
            <div className={styles.workflowHead}>
              <div>
                <span>{t.liveWorkflow}</span>
                <strong>{t.workflowTitle}</strong>
                <small>{t.room}</small>
              </div>
              <span className={styles.liveStatus}><i />{t.managerView}</span>
            </div>
            <div className={styles.workflowBody}>
              {t.workflowRows.map(([title, detail, status], index) => (
                <div className={styles.workflowRow} key={title}>
                  <span className={styles.workflowNumber}>{index + 1}</span>
                  <div><strong>{title}</strong><small>{detail}</small></div>
                  <span className={index === 1 ? styles.statusWarm : styles.status}>{status}</span>
                </div>
              ))}
            </div>
            <div className={styles.workflowFoot}>
              {t.workflowControls.map((control) => <span key={control}>{control}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.signalStrip} aria-label={t.signalAria}>
        {t.signalItems.map(([title, text]) => (
          <div key={title}><strong>{title}</strong><span>{text}</span></div>
        ))}
      </section>

      <section className={styles.section} id="hotel-operations">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{t.problemEyebrow}</p>
          <h2>{t.problemTitle}</h2>
          <p>{t.problemText}</p>
        </div>
        <div className={styles.momentsGrid}>
          {t.moments.map((moment, index) => (
            <a className={styles.momentCard} href={hasLocalizedDetailPages ? `${hotelHref}#${hotelMomentAnchors[index]}` : demoHref} key={moment.number}>
              <div className={styles.momentTop}><span>{moment.number}</span><small>{moment.tag}</small></div>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
              <span className={styles.cardArrow} aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.process} id="how-it-works">
        <div className={styles.processIntro}>
          <p className={styles.eyebrow}>{t.processEyebrow}</p>
          <h2>{t.processTitle}</h2>
          <p>{t.processLead}</p>
          <a className={styles.lightButton} href={platformHref}>{t.platformCta}<span aria-hidden="true">→</span></a>
        </div>
        <div className={styles.steps}>
          {t.steps.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.productSection}`} id="features">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{t.productEyebrow}</p>
          <h2>{t.productTitle}</h2>
          <p>{t.productText}</p>
        </div>
        <div className={styles.productGrid}>
          <div className={styles.dashboard} role="img" aria-label={t.dashboardTitle}>
            <div className={styles.dashboardNav}>
              <span className={styles.dashboardMark} aria-hidden="true" />
              <div><strong>{t.dashboardTitle}</strong><small>{t.dashboardSubtitle}</small></div>
              <span className={styles.avatar}>MO</span>
            </div>
            <div className={styles.metricGrid}>
              {t.dashboardMetrics.map(([label, value], index) => (
                <div key={label}><span className={styles.metricIcon} data-index={index} /><small>{label}</small><strong>{value}</strong></div>
              ))}
            </div>
            <div className={styles.feed}>
              <div className={styles.feedHead}><strong>{t.dashboardFeed}</strong><span>{t.now}</span></div>
              {t.dashboardRows.map(([title, team, status], index) => (
                <div className={styles.feedRow} key={title}>
                  <span className={styles.feedDot} data-index={index} />
                  <strong>{title}</strong><small>{team}</small><span>{status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.capabilityGrid}>
            {t.capabilities.map(([title, text], index) => (
              <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
        <div className={styles.featuresExplore}>
          <span>{t.featuresPrompt}</span>
          <a href={featuresHref}>{t.featuresCta}<span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className={styles.proofSection}>
        <div className={styles.proofCopy}>
          <p className={styles.eyebrow}>{t.proofEyebrow}</p>
          <h2>{t.proofTitle}</h2>
          <p>{t.proofText}</p>
          <div className={styles.award}>
            <span aria-hidden="true">★</span>
            <div><strong>{t.awardTitle}</strong><p>{t.awardEvent}</p><small>{t.awardNote}</small></div>
          </div>
        </div>
        <aside className={styles.proofCard}>
          <p>{t.proofCardEyebrow}</p>
          <h3>{t.proofCardTitle}</h3>
          <div>
            {t.proofCardItems.map((item, index) => (
              <span key={item}><i>0{index + 1}</i>{item}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className={`${styles.section} ${styles.marketsSection}`} id="markets">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{t.marketsEyebrow}</p>
          <h2>{t.marketsTitle}</h2>
          <p>{t.marketsText}</p>
        </div>
        <div className={styles.marketsGrid}>
          <a className={styles.featuredMarket} href={hotelHref}>
            <span>01 / {t.priorityMarket}</span>
            <div><h3>{t.featuredMarket[0]}</h3><p>{t.featuredMarket[1]}</p></div>
            <strong>{t.featuredLink}<span aria-hidden="true">→</span></strong>
          </a>
          <div className={styles.otherMarkets}>
            {t.markets.map(([title, text], index) => (
              <a href={hasLocalizedDetailPages ? `${industriesHref}#${marketSlugs[index]}` : demoHref} key={title}>
                <span>0{index + 2}</span><div><h3>{title}</h3><p>{text}</p></div><strong>{t.exploreMarket} →</strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.customerProof} aria-labelledby="customer-proof-title">
        <div className={styles.customerProofIntro}>
          <p className={styles.eyebrow}>{proof.eyebrow}</p>
          <h2 id="customer-proof-title">{proof.title}</h2>
          <p>{proof.text}</p>
        </div>

        <div className={styles.clientRoster} aria-label={proof.clientsLabel}>
          {customerNames.map((customer, index) => (
            <div key={customer}><span>0{index + 1}</span><strong>{customer}</strong></div>
          ))}
        </div>

        <a className={styles.proofLabel} href="https://whagons.com/docs/Whagons-2022.pdf" target="_blank" rel="noreferrer">
          {proof.testimonialsLabel}<span aria-hidden="true">↗</span>
        </a>
        <div className={styles.testimonialGrid}>
          {proof.testimonials.map((testimonial) => (
            <figure className={styles.testimonialCard} key={testimonial.name}>
              <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption><strong>{testimonial.name}</strong><span>{testimonial.role}</span></figcaption>
            </figure>
          ))}
        </div>

        <article className={styles.caseStudy}>
          <div>
            <p>{proof.caseLabel}</p>
            <h3>{proof.caseTitle}</h3>
            <span>{proof.caseText}</span>
            <a href="https://es.linkedin.com/posts/whagons_mantenimientoindustrial-gesti%C3%B3noperativa-activity-7470803294903312384-VFou" target="_blank" rel="noreferrer">
              {proof.sourceLabel}<span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className={styles.caseMetrics}>
            {proof.caseMetrics.map(([value, label]) => (
              <div key={label}><strong>{value}</strong><span>{label}</span></div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrow}>{t.finalEyebrow}</p>
        <h2>{t.finalTitle}</h2>
        <p>{t.finalText}</p>
        <a className={styles.primaryButton} href={demoHref}>{t.finalCta}<span aria-hidden="true">→</span></a>
      </section>
    </main>
  );
}
