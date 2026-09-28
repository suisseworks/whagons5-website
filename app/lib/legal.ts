import { Language } from './i18n';

export interface LegalSection {
  title: string;
  body: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
}

export interface LegalPageContent {
  eyebrow: string;
  title: string;
  intro: string;
  updatedLabel: string;
  updatedDate: string;
  sections: LegalSection[];
  ctaTitle: string;
  ctaDescription: string;
  primaryCta: string;
  secondaryCta: string;
}

export const privacyContent: Record<Language, LegalPageContent> = {
  es: {
    eyebrow: 'Legal',
    title: 'Política de Privacidad',
    intro:
      'Esta Política de Privacidad explica cómo Whagons recopila, usa, protege y comparte información cuando visitas nuestro sitio web, solicitas un brief o demo, o utilizas la plataforma Whagons para gestionar operaciones, automatizaciones, documentación y flujos de trabajo empresariales.',
    updatedLabel: 'Última actualización',
    updatedDate: '28 de septiembre de 2026',
    sections: [
      {
        title: 'Hotel Operations Score',
        body: ['Las respuestas del diagnóstico se guardan temporalmente en esta pestaña del navegador durante 24 horas para permitirte continuar. Al solicitar el resultado, guardamos tu correo, respuestas, score y recomendaciones en Flodesk para registrar la solicitud y preparar el diagnóstico personalizado. Conservamos el registro para preparar el resultado y dar seguimiento a tu solicitud. Si marcas la casilla opcional de novedades, guardamos ese consentimiento por separado en los datos del contacto; dejarla sin marcar no cancela suscripciones anteriores.'],
      },
      {
        title: '1. Alcance',
        body: [
          'Esta política aplica a https://whagons.com, a los formularios y comunicaciones comerciales asociados al sitio, y al uso de la plataforma Whagons, incluyendo sus módulos de gestión operativa, asistente con inteligencia artificial, flujos de trabajo, integraciones, formularios, firmas y funciones móviles o web.',
          'Si tu organización tiene un contrato o acuerdo de servicios con Whagons, ese documento puede complementar esta política para el uso empresarial de la plataforma.',
        ],
      },
      {
        title: '2. Información que recopilamos',
        body: ['Podemos recopilar las siguientes categorías de información:'],
        bullets: [
          'Datos de contacto y negocio que nos envías al solicitar un demo o brief, como nombre, correo electrónico, empresa, industria, teléfono y tamaño del equipo operativo.',
          'Información de cuenta y administración cuando una organización implementa Whagons, como usuarios autorizados, roles, ubicaciones, equipos y preferencias de configuración.',
          'Datos operativos cargados o generados dentro de la plataforma, incluyendo tareas, flujos, aprobaciones, formularios, documentación, registros, métricas, comentarios y archivos relacionados con la operación del cliente.',
          'Información técnica y de uso, como dirección IP, ubicación aproximada (ciudad y país), tipo de navegador, dispositivo, páginas visitadas, tiempos de acceso, idioma y registros necesarios para seguridad, soporte y rendimiento.',
          'Preferencias almacenadas en tu navegador para mejorar la experiencia del sitio, por ejemplo configuraciones visuales guardadas localmente.',
          'Datos provenientes de integraciones de terceros cuando el cliente decide conectar sistemas como ERP, CRM, herramientas de comunicación o autenticación empresarial.',
        ],
      },
      {
        title: '3. Cómo usamos la información',
        body: ['Usamos la información para:'],
        bullets: [
          'Operar, mantener y mejorar el sitio web y la plataforma Whagons.',
          'Responder a solicitudes comerciales, coordinar demos, enviar briefs y dar seguimiento a oportunidades comerciales.',
          'Provisionar cuentas, autenticar usuarios, habilitar automatizaciones, integraciones, reportes y funciones del asistente con inteligencia artificial.',
          'Monitorear seguridad, prevenir abuso, investigar incidentes y proteger la integridad de los sistemas.',
          'Cumplir obligaciones legales, regulatorias, contractuales o de auditoría.',
          'Comunicarnos contigo sobre actualizaciones relevantes del servicio, soporte, cambios materiales y, cuando corresponda, comunicaciones comerciales relacionadas con Whagons.',
        ],
      },
      {
        title: '4. Base legal y permisos',
        body: [
          'Dependiendo de tu relación con Whagons y de tu jurisdicción, tratamos información para ejecutar un contrato, responder a una solicitud previa a la contratación, cumplir obligaciones legales, proteger intereses legítimos del negocio o con base en tu consentimiento.',
          'Cuando el tratamiento dependa de tu consentimiento, puedes retirarlo en cualquier momento para futuros tratamientos escribiéndonos a hello@whagons.com.',
        ],
      },
      {
        title: '5. Cómo compartimos información',
        body: ['No vendemos tu información personal. Podemos compartirla únicamente en estos contextos:'],
        bullets: [
          'Con proveedores que nos ayudan a operar el negocio y la plataforma, por ejemplo servicios de hosting, correo, soporte, seguridad, autenticación o gestión de leads.',
          'Con herramientas que el cliente decida integrar a Whagons para habilitar procesos de negocio, notificaciones, reportes o sincronización de datos.',
          'Con afiliadas o entidades relacionadas cuando sea necesario para prestar el servicio, administrar contratos o dar soporte.',
          'Cuando la ley, una autoridad competente o un proceso legal válido lo exijan.',
          'Como parte de una reorganización, fusión, adquisición o venta de activos, sujeto a las salvaguardas aplicables.',
        ],
      },
      {
        title: '6. Marketing y formularios del sitio',
        body: [
          'Cuando completas un formulario de demo o brief, la información enviada puede utilizarse para contactarte, clasificar tu interés comercial y enviarte seguimiento relacionado con Whagons.',
          'Actualmente utilizamos proveedores de automatización y gestión de leads para procesar estos envíos. Si no deseas recibir futuras comunicaciones comerciales, puedes darte de baja o solicitar la exclusión escribiéndonos a hello@whagons.com.',
        ],
      },
      {
        title: '7. Cookies, almacenamiento local y tecnologías similares',
        body: [
          'El sitio puede utilizar almacenamiento local del navegador y tecnologías similares para recordar preferencias, mantener funciones del sitio y apoyar mediciones técnicas básicas.',
          'Tu navegador te permite bloquear o eliminar estas tecnologías, aunque hacerlo puede afectar algunas funciones del sitio.',
        ],
      },
      {
        title: '8. Seguridad y retención',
        body: [
          'Aplicamos medidas administrativas, técnicas y organizativas razonables para proteger la información contra acceso no autorizado, pérdida, alteración o divulgación indebida. Ningún sistema es completamente infalible, por lo que no podemos garantizar seguridad absoluta.',
          'Conservamos la información durante el tiempo necesario para los fines descritos en esta política, para cumplir obligaciones legales, resolver disputas, hacer cumplir acuerdos y mantener registros comerciales y operativos legítimos.',
          'Los plazos de retención por categoría y la forma en que eliminamos los datos, incluidos los datos financieros recibidos a través de Plaid, están en nuestra Política de Retención y Eliminación de Datos.',
        ],
        links: [{ label: 'Política de Retención y Eliminación de Datos', href: '/es/data-retention' }],
      },
      {
        title: '9. Transferencias internacionales',
        body: [
          'Whagons puede procesar o almacenar información en países distintos al tuyo, incluyendo a través de proveedores de infraestructura y software. Cuando esto ocurra, aplicaremos medidas razonables para proteger la información de acuerdo con la legislación aplicable y nuestros compromisos contractuales.',
        ],
      },
      {
        title: '10. Tus derechos',
        body: [
          'Según tu jurisdicción, podrías tener derecho a solicitar acceso, corrección, actualización, portabilidad, limitación, objeción o eliminación de tu información personal.',
          'Si deseas ejercer alguno de estos derechos, escríbenos a hello@whagons.com. Podremos solicitar información adicional para verificar tu identidad y procesar la solicitud de forma segura.',
        ],
      },
      {
        title: '11. Menores de edad',
        body: [
          'Whagons no está dirigido a menores de edad y no recopilamos intencionalmente información personal de niños a través del sitio o la plataforma. Si crees que un menor nos ha proporcionado información, contáctanos para revisarlo y eliminarla cuando corresponda.',
        ],
      },
      {
        title: '12. Cambios a esta política',
        body: [
          'Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en el servicio, prácticas de tratamiento o requisitos legales. Publicaremos la versión vigente en esta página con su fecha de actualización.',
        ],
      },
      {
        title: '13. Contacto',
        body: [
          'Si tienes preguntas sobre esta Política de Privacidad o sobre cómo Whagons trata información, puedes escribirnos a hello@whagons.com.',
        ],
      },
    ],
    ctaTitle: '¿Necesitas aclarar algo antes de avanzar?',
    ctaDescription:
      'Podemos responder preguntas sobre privacidad, seguridad, implementación y cómo Whagons encaja en tu operación.',
    primaryCta: 'Solicitar demo',
    secondaryCta: 'Escribir a Whagons',
  },
  en: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy explains how Whagons Systems LLC (Whagons, we, or us) collects, uses, protects, and shares information when you visit the U.S. website, request a Hotel Handoff Leak Scan, or use the Whagons platform.',
    updatedLabel: 'Last updated',
    updatedDate: 'September 28, 2026',
    sections: [
      {
        title: 'Hotel Operations Score',
        body: ['Assessment answers are saved temporarily in this browser tab for 24 hours so you can continue. When you request results, we save your email, answers, score and recommendations in Flodesk to register your request and prepare the personalized assessment. We retain the record to prepare your result and follow up on your request. If you select the optional news checkbox, we record that consent separately in your contact data; leaving it unchecked does not cancel existing subscriptions.'],
      },
      {
        title: '1. Scope',
        body: [
          'This policy applies to the English-language U.S. market at https://whagons.com/en, its Hotel Handoff Leak Scan and related commercial communications, and use of the Whagons platform, including workflow, form, documentation, analytics, integration, AI-assisted, and web features.',
          'If your organization has a separate order form, master services agreement, or services contract with Whagons, that document may supplement this policy for enterprise use of the platform.',
        ],
      },
      {
        title: '2. Information we collect',
        body: ['We may collect the following categories of information:'],
        bullets: [
          'Contact and business information you submit when requesting a Hotel Handoff Leak Scan, such as name, work email address, hotel or management company, role, phone number, property count, workflow category, and preferred contact method.',
          'Account and administration information when an organization implements Whagons, such as authorized users, roles, locations, teams, and configuration preferences.',
          'Operational data uploaded to or generated within the platform, including tasks, workflows, approvals, forms, documentation, logs, metrics, comments, and files related to the customer’s operations.',
          'Technical and usage information such as IP address, approximate location (city and country), browser type, device information, visited pages, access times, language, and logs needed for security, support, and performance.',
          'Preferences stored in your browser to improve the website experience, for example locally saved visual settings.',
          'Data made available through third-party integrations when a customer chooses to connect systems such as ERP, CRM, communication tools, or enterprise authentication providers.',
        ],
      },
      {
        title: '3. How we use information',
        body: ['We use information to:'],
        bullets: [
          'Operate, maintain, and improve the website and the Whagons platform.',
          'Respond to commercial inquiries, coordinate Hotel Handoff Leak Scans, prepare requested scorecards, and follow up on hotel pilot opportunities.',
          'Provision accounts, authenticate users, enable automations, integrations, reporting, and AI assistant functionality.',
          'Monitor security, prevent misuse, investigate incidents, and protect the integrity of our systems.',
          'Comply with legal, regulatory, contractual, and audit-related obligations.',
          'Communicate with you about relevant service updates, support matters, material changes, and, where appropriate, Whagons-related marketing communications.',
        ],
      },
      {
        title: '4. Legal bases and permissions',
        body: [
          'Depending on your relationship with Whagons and your jurisdiction, we process information to perform a contract, respond to pre-contract requests, comply with legal obligations, pursue legitimate business interests, or based on your consent.',
          'Where processing depends on consent, you may withdraw it at any time for future processing by contacting us at hello@whagons.com.',
        ],
      },
      {
        title: '5. How we share information',
        body: ['We do not sell personal information. We may share it only in these contexts:'],
        bullets: [
          'With service providers that help us operate the business and platform, such as hosting, email, support, security, authentication, or lead-management providers.',
          'With tools a customer chooses to integrate with Whagons in order to enable business processes, notifications, reporting, or data synchronization.',
          'With affiliates or related entities where needed to deliver the service, administer contracts, or provide support.',
          'When required by law, competent authority, or valid legal process.',
          'As part of a reorganization, merger, acquisition, financing, or sale of assets, subject to applicable safeguards.',
        ],
      },
      {
        title: '6. Website forms and marketing communications',
        body: [
          'When you request a Hotel Handoff Leak Scan, the submitted information may be used to review the request, contact you using the selected method, prepare the working session, and send follow-up related to the scan or a potential hotel pilot.',
          'We currently use automation and lead-management providers to process these submissions. If you no longer want to receive marketing communications, you can unsubscribe or request removal by contacting hello@whagons.com.',
        ],
      },
      {
        title: '7. Cookies, local storage, and similar technologies',
        body: [
          'The website may use browser local storage and similar technologies to remember preferences, support site functionality, and enable basic technical measurement.',
          'Your browser allows you to block or clear these technologies, although some website functionality may be affected if you do so.',
        ],
      },
      {
        title: '8. Security and retention',
        body: [
          'We apply reasonable administrative, technical, and organizational measures to protect information against unauthorized access, loss, alteration, or improper disclosure. No system is completely fail-safe, so we cannot guarantee absolute security.',
          'We retain information for as long as needed for the purposes described in this policy, to comply with legal obligations, resolve disputes, enforce agreements, and maintain legitimate business and operational records.',
          'Retention periods for each category, and how we delete data, including financial data received through Plaid, are set out in our Data Retention and Disposal Policy.',
        ],
        links: [{ label: 'Data Retention and Disposal Policy', href: '/en/data-retention' }],
      },
      {
        title: '9. International transfers',
        body: [
          'Whagons may process or store information in countries other than your own, including through infrastructure and software providers. When this happens, we apply reasonable measures to protect information in line with applicable law and our contractual commitments.',
        ],
      },
      {
        title: '10. Your rights',
        body: [
          'Depending on your jurisdiction, you may have rights to request access, correction, updating, portability, restriction, objection, or deletion of personal information.',
          'To exercise any applicable rights, contact us at hello@whagons.com. We may request additional information to verify identity and process the request securely.',
        ],
      },
      {
        title: '11. Children',
        body: [
          'Whagons is not directed to children and we do not knowingly collect personal information from children through the website or platform. If you believe a child has provided information to us, contact us so we can review and delete it where appropriate.',
        ],
      },
      {
        title: '12. Changes to this policy',
        body: [
          'We may update this Privacy Policy from time to time to reflect changes in the service, processing practices, or legal requirements. We will post the current version on this page together with its effective date.',
        ],
      },
      {
        title: '13. Contact',
        body: [
          'Whagons Systems LLC is a California limited liability company. If you have questions about this Privacy Policy or how Whagons handles information, contact us at hello@whagons.com.',
        ],
      },
    ],
    ctaTitle: 'Need clarity before moving forward?',
    ctaDescription:
      'We can answer questions about privacy, security, implementation, and how Whagons fits your operation.',
    primaryCta: 'Request a demo',
    secondaryCta: 'Email Whagons',
  },
};

export const termsContent: Record<Language, LegalPageContent> = {
  es: {
    eyebrow: 'Legal',
    title: 'Términos y Condiciones',
    intro:
      'Estos Términos y Condiciones regulan el acceso y uso del sitio web de Whagons y de la plataforma Whagons. Al acceder al sitio, solicitar información comercial o utilizar los servicios, aceptas estos términos en nombre propio o de la organización que representas.',
    updatedLabel: 'Última actualización',
    updatedDate: '1 de abril de 2026',
    sections: [
      {
        title: '1. Quiénes somos',
        body: [
          'Whagons ofrece software de gestión operativa para organizaciones que necesitan control, automatización y visibilidad sobre sus operaciones. La plataforma puede incluir módulos de tareas, planes de trabajo, documentación, analítica, formularios, aprobaciones, integraciones y funciones asistidas por inteligencia artificial.',
        ],
      },
      {
        title: '2. Elegibilidad y autoridad',
        body: [
          'Debes tener capacidad legal para aceptar estos términos. Si usas Whagons en nombre de una empresa u otra entidad, declaras que tienes autoridad para obligar a esa organización a cumplir estos términos.',
        ],
      },
      {
        title: '3. Uso permitido',
        body: ['Puedes usar el sitio y la plataforma únicamente para fines comerciales legítimos y conforme a la ley aplicable. Aceptas no:'],
        bullets: [
          'Usar Whagons para actividades ilícitas, fraudulentas, engañosas o que infrinjan derechos de terceros.',
          'Intentar obtener acceso no autorizado a sistemas, cuentas, datos o redes.',
          'Interferir con la seguridad, estabilidad, integridad o rendimiento del servicio.',
          'Subir código malicioso, contenido dañino o información que no tengas derecho a procesar.',
          'Copiar, revender, sublicenciar, descompilar o explotar comercialmente la plataforma salvo autorización escrita de Whagons.',
        ],
      },
      {
        title: '4. Cuentas y responsabilidades de la organización',
        body: [
          'Eres responsable de la actividad realizada desde tus cuentas, de mantener la confidencialidad de credenciales, de asignar permisos apropiados y de asegurar que tus usuarios finales cumplan estos términos y las políticas internas de tu organización.',
          'La organización cliente también es responsable de la exactitud, legalidad y legitimidad de los datos que carga o procesa en Whagons.',
        ],
      },
      {
        title: '5. Datos del cliente y propiedad intelectual',
        body: [
          'Salvo que se indique lo contrario por escrito, tú o tu organización conservan los derechos sobre los datos, documentos, formularios, registros y demás contenido cargado a Whagons.',
          'Whagons conserva todos los derechos sobre la plataforma, su diseño, marca, software, documentación, modelos, metodologías, mejoras y trabajos derivados. Estos términos no transfieren propiedad intelectual de Whagons al cliente.',
        ],
      },
      {
        title: '6. Licencia de uso',
        body: [
          'Sujeto al cumplimiento de estos términos y de cualquier orden comercial aplicable, Whagons te concede una licencia limitada, no exclusiva, no transferible y revocable para acceder y usar el servicio durante la vigencia contratada.',
        ],
      },
      {
        title: '7. Funciones de inteligencia artificial, automatización e integraciones',
        body: [
          'Whagons puede ofrecer recomendaciones, resúmenes, automatizaciones, asistentes conversacionales e integraciones con terceros. Estas funciones buscan apoyar la operación, pero no sustituyen criterio humano, revisión administrativa ni validación interna del cliente.',
          'Eres responsable de revisar decisiones, aprobaciones, comunicaciones automatizadas y resultados operativos antes de ejecutarlos en contextos sensibles, regulatorios, de seguridad, laborales o contractuales.',
        ],
      },
      {
        title: '8. Tarifas y condiciones comerciales',
        body: [
          'Los precios, alcances, límites de uso, periodos de servicio, impuestos, condiciones de facturación y cualquier compromiso específico se regirán por la propuesta, cotización, orden de servicio o contrato comercial aplicable entre Whagons y el cliente.',
          'Si no existe un acuerdo comercial separado, Whagons podrá suspender o limitar el acceso a servicios de pago hasta que las condiciones económicas hayan sido aceptadas por ambas partes.',
        ],
      },
      {
        title: '9. Disponibilidad, cambios y beta features',
        body: [
          'Whagons puede actualizar, mejorar, modificar o descontinuar características del sitio o de la plataforma de forma periódica. Aunque buscamos continuidad razonable, no garantizamos que el servicio sea ininterrumpido, libre de errores o adecuado para todos los casos de uso.',
          'Las funciones beta, piloto o experimentales pueden ofrecerse “tal cual”, con soporte limitado y cambios frecuentes.',
        ],
      },
      {
        title: '10. Servicios de terceros',
        body: [
          'El servicio puede interoperar con herramientas de terceros, incluyendo proveedores de autenticación, mensajería, formularios, infraestructura o automatización. El uso de esos servicios puede estar sujeto a sus propios términos y políticas.',
          'Whagons no es responsable por fallas, cambios o indisponibilidad originados exclusivamente en servicios de terceros fuera de su control razonable.',
        ],
      },
      {
        title: '11. Confidencialidad y seguridad',
        body: [
          'Cada parte deberá proteger la información confidencial de la otra con un nivel de cuidado razonable y utilizarla solo para los fines permitidos por la relación comercial o por estos términos.',
          'Nada de lo anterior obliga a una parte a proteger información que sea pública sin incumplimiento, que ya conociera legítimamente, que reciba legalmente de un tercero o que deba divulgar por requerimiento legal.',
        ],
      },
      {
        title: '12. Terminación',
        body: [
          'Podemos suspender o terminar el acceso al sitio o a la plataforma si existe incumplimiento material, uso indebido, riesgo de seguridad, falta de pago o requerimiento legal. Tú también puedes dejar de usar el servicio en cualquier momento, sujeto a cualquier compromiso comercial vigente.',
          'Tras la terminación, las disposiciones que por su naturaleza deban sobrevivir continuarán vigentes, incluyendo propiedad intelectual, limitaciones de responsabilidad, confidencialidad y obligaciones de pago pendientes.',
        ],
      },
      {
        title: '13. Exclusión de garantías',
        body: [
          'En la medida permitida por la ley, el sitio y la plataforma se proporcionan “tal cual” y “según disponibilidad”. Whagons no otorga garantías explícitas o implícitas sobre comerciabilidad, adecuación para un propósito particular, no infracción, exactitud de resultados o disponibilidad continua.',
        ],
      },
      {
        title: '14. Limitación de responsabilidad',
        body: [
          'En la medida permitida por la ley aplicable, Whagons no será responsable por daños indirectos, incidentales, especiales, punitivos o consecuenciales, ni por pérdida de ingresos, utilidades, datos, reputación o interrupción del negocio derivada del uso o imposibilidad de uso del servicio.',
          'La responsabilidad total agregada de Whagons relacionada con el servicio se limitará al monto efectivamente pagado por el cliente a Whagons durante los doce meses previos al evento que dio origen al reclamo, o, si no hubo pagos, a cien dólares estadounidenses (USD 100).',
        ],
      },
      {
        title: '15. Ley aplicable y resolución de disputas',
        body: [
          'Salvo que un acuerdo comercial escrito disponga otra cosa, estos términos se regirán por las leyes de Costa Rica, sin considerar sus principios sobre conflicto de leyes.',
          'Las partes procurarán resolver cualquier disputa de buena fe. Si no fuera posible, la controversia se someterá a los tribunales competentes de Costa Rica, salvo pacto escrito en contrario.',
        ],
      },
      {
        title: '16. Cambios a estos términos',
        body: [
          'Podemos actualizar estos términos de vez en cuando. La versión vigente se publicará en esta página con su fecha de actualización. El uso continuado del sitio o de la plataforma después de un cambio material constituye aceptación de los términos actualizados.',
        ],
      },
      {
        title: '17. Contacto',
        body: [
          'Si tienes preguntas sobre estos Términos y Condiciones, escríbenos a hello@whagons.com.',
        ],
      },
    ],
    ctaTitle: '¿Quieres revisar Whagons para tu empresa?',
    ctaDescription:
      'Podemos mostrarte cómo se adapta la plataforma a tu industria, estructura operativa y requisitos de implementación.',
    primaryCta: 'Agendar demo',
    secondaryCta: 'Hablar con Whagons',
  },
  en: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    intro:
      'These Terms & Conditions govern access to and use of the U.S. Whagons Hospitality website and the Whagons platform offered by Whagons Systems LLC. By accessing the website, requesting commercial information, or using the services, you accept these terms on your own behalf or on behalf of the organization you represent.',
    updatedLabel: 'Last updated',
    updatedDate: 'July 13, 2026',
    sections: [
      {
        title: '1. Who we are',
        body: [
          'Whagons Systems LLC is a California limited liability company. It offers Whagons Hospitality to U.S. hotels as a configured use of the Whagons operations platform for workflow ownership, due times, escalation, completion evidence, and manager visibility. The platform may also include task management, work plans, documentation, analytics, forms, approvals, integrations, and AI-assisted features.',
        ],
      },
      {
        title: '2. Eligibility and authority',
        body: [
          'You must have legal capacity to accept these terms. If you use Whagons on behalf of a company or other entity, you represent that you have authority to bind that organization to these terms.',
        ],
      },
      {
        title: '3. Permitted use',
        body: ['You may use the website and platform only for legitimate business purposes and in compliance with applicable law. You agree not to:'],
        bullets: [
          'Use Whagons for unlawful, fraudulent, deceptive, or rights-infringing activities.',
          'Attempt to gain unauthorized access to systems, accounts, data, or networks.',
          'Interfere with the security, stability, integrity, or performance of the service.',
          'Upload malicious code, harmful content, or information you do not have the right to process.',
          'Copy, resell, sublicense, reverse engineer, decompile, or commercially exploit the platform unless Whagons has given written permission.',
        ],
      },
      {
        title: '4. Accounts and organization responsibilities',
        body: [
          'You are responsible for activity conducted through your accounts, for maintaining credential confidentiality, for assigning appropriate permissions, and for ensuring that your end users comply with these terms and your organization’s internal policies.',
          'The customer organization is also responsible for the accuracy, legality, and legitimacy of the data it uploads to or processes through Whagons.',
        ],
      },
      {
        title: '5. Customer data and intellectual property',
        body: [
          'Unless otherwise agreed in writing, you or your organization retain rights in the data, documents, forms, records, and other content uploaded to Whagons.',
          'Whagons retains all rights in the platform, its design, brand, software, documentation, models, methodologies, improvements, and derivative works. These terms do not transfer Whagons intellectual property to the customer.',
        ],
      },
      {
        title: '6. License to use the service',
        body: [
          'Subject to compliance with these terms and any applicable commercial order, Whagons grants you a limited, non-exclusive, non-transferable, revocable license to access and use the service during the applicable subscription or engagement term.',
        ],
      },
      {
        title: '7. AI, automation, and integration features',
        body: [
          'Whagons may offer recommendations, summaries, automations, conversational assistants, and third-party integrations. These features are intended to support operations, but they do not replace human judgment, management review, or the customer’s internal validation processes.',
          'You are responsible for reviewing decisions, approvals, automated communications, and operational outputs before acting on them in sensitive, regulated, safety-critical, employment-related, or contractual contexts.',
        ],
      },
      {
        title: '8. Fees and commercial terms',
        body: [
          'Pricing, scope, usage limits, service periods, taxes, billing terms, and any specific commitments will be governed by the applicable proposal, quote, order form, statement of work, or commercial agreement between Whagons and the customer.',
          'If no separate commercial agreement exists, Whagons may suspend or limit access to paid services until commercial terms have been accepted by both parties.',
        ],
      },
      {
        title: '9. Availability, changes, and beta features',
        body: [
          'Whagons may update, improve, modify, or discontinue website or platform features from time to time. While we aim for reasonable continuity, we do not guarantee that the service will be uninterrupted, error-free, or suitable for every use case.',
          'Beta, pilot, preview, or experimental features may be offered on an “as is” basis, with limited support and frequent changes.',
        ],
      },
      {
        title: '10. Third-party services',
        body: [
          'The service may interoperate with third-party tools, including authentication, messaging, forms, infrastructure, or automation providers. Use of those services may be governed by their own terms and policies.',
          'Whagons is not responsible for failures, changes, or downtime caused solely by third-party services outside its reasonable control.',
        ],
      },
      {
        title: '11. Confidentiality and security',
        body: [
          'Each party will protect the other party’s confidential information using a reasonable standard of care and will use it only for purposes permitted by the commercial relationship or these terms.',
          'The foregoing does not apply to information that is public through no breach, already lawfully known, lawfully received from a third party, or required to be disclosed by law.',
        ],
      },
      {
        title: '12. Termination',
        body: [
          'We may suspend or terminate access to the website or platform in the event of material breach, misuse, security risk, non-payment, or legal requirement. You may also stop using the service at any time, subject to any active commercial commitments.',
          'After termination, provisions that should survive by their nature will remain in effect, including intellectual property, confidentiality, limitations of liability, and unpaid payment obligations.',
        ],
      },
      {
        title: '13. Disclaimer of warranties',
        body: [
          'To the maximum extent permitted by law, the website and platform are provided “as is” and “as available.” Whagons disclaims express and implied warranties, including merchantability, fitness for a particular purpose, non-infringement, accuracy of results, and uninterrupted availability.',
        ],
      },
      {
        title: '14. Limitation of liability',
        body: [
          'To the maximum extent permitted by applicable law, Whagons will not be liable for indirect, incidental, special, punitive, or consequential damages, or for lost revenue, profits, data, goodwill, or business interruption arising from use of or inability to use the service.',
          'Whagons aggregate liability relating to the service will be limited to the amounts actually paid by the customer to Whagons during the twelve months preceding the event giving rise to the claim or, if no fees were paid, one hundred U.S. dollars (USD 100).',
        ],
      },
      {
        title: '15. Governing law and disputes',
        body: [
          'Unless a written commercial agreement states otherwise, these terms are governed by the laws of the State of California, without regard to conflict-of-law rules.',
          'The parties will first attempt to resolve disputes in good faith. If that is not possible, the dispute will be submitted to the state or federal courts located in California unless otherwise agreed in writing.',
        ],
      },
      {
        title: '16. Changes to these terms',
        body: [
          'We may update these terms from time to time. The current version will be posted on this page together with its effective date. Continued use of the website or platform after a material change constitutes acceptance of the updated terms.',
        ],
      },
      {
        title: '17. Contact',
        body: [
          'If you have questions about these Terms & Conditions, contact us at hello@whagons.com.',
        ],
      },
    ],
    ctaTitle: 'Want to review one hotel handoff?',
    ctaDescription:
      'Start with one real workflow and determine whether Whagons fits the hotel before discussing a broader implementation.',
    primaryCta: 'Book a demo',
    secondaryCta: 'Talk to Whagons',
  },
};

export const securityContent: Record<Language, LegalPageContent> = {
  es: {
    eyebrow: 'Legal',
    title: 'Política de Seguridad',
    intro:
      'Esta Política de Seguridad resume las prácticas que Whagons aplica para proteger su sitio web, su infraestructura y la plataforma de gestión operativa utilizada por sus clientes. Describe controles generales y principios operativos, y puede complementarse con acuerdos específicos con cada cliente.',
    updatedLabel: 'Última actualización',
    updatedDate: '1 de abril de 2026',
    sections: [
      {
        title: '1. Enfoque de seguridad',
        body: [
          'Whagons diseña su plataforma con un enfoque de seguridad por capas orientado a proteger la confidencialidad, integridad y disponibilidad de la información operativa procesada en el servicio.',
          'Nuestros controles se revisan de forma continua y evolucionan junto con los requisitos del producto, la infraestructura y el perfil de riesgo de las organizaciones que utilizan Whagons.',
        ],
      },
      {
        title: '2. Control de acceso',
        body: [
          'Aplicamos controles de autenticación y autorización para limitar el acceso a sistemas, ambientes y datos únicamente a personas y procesos autorizados.',
        ],
        bullets: [
          'Asignación de permisos según función, necesidad operativa y nivel de responsabilidad.',
          'Separación entre ambientes y cuentas administrativas cuando corresponde.',
          'Revisión y retiro de accesos cuando cambian funciones, se detectan riesgos o finaliza una relación laboral o contractual.',
          'Soporte para esquemas empresariales de autenticación e integración cuando forman parte de la implementación del cliente.',
        ],
      },
      {
        title: '3. Protección de datos',
        body: [
          'Whagons busca proteger la información en tránsito y en reposo mediante controles técnicos razonables, prácticas de endurecimiento de infraestructura y gestión responsable de configuraciones y credenciales.',
          'Los clientes siguen siendo responsables de definir qué información cargan a la plataforma y de configurar sus flujos y permisos internos de manera adecuada.',
        ],
      },
      {
        title: '4. Seguridad de la aplicación',
        body: [
          'Incorporamos prácticas de desarrollo orientadas a reducir vulnerabilidades comunes, validar entradas, limitar accesos indebidos y proteger integraciones, automatizaciones y funciones de la aplicación.',
          'Las actualizaciones del producto pueden incluir correcciones de seguridad, mejoras de endurecimiento y ajustes preventivos cuando identificamos riesgos o dependencias que lo requieren.',
        ],
      },
      {
        title: '5. Monitoreo y respuesta a incidentes',
        body: [
          'Mantenemos registros y mecanismos de monitoreo para investigar eventos relevantes de seguridad, abuso, estabilidad y operación del servicio.',
          'Cuando identificamos un incidente que pueda afectar la seguridad o disponibilidad del servicio, activamos procesos internos de análisis, contención, mitigación y recuperación según la naturaleza del evento.',
        ],
      },
      {
        title: '6. Continuidad y resiliencia',
        body: [
          'Whagons procura operar sobre infraestructura y prácticas que favorezcan disponibilidad, respaldo y recuperación razonable ante fallas técnicas, errores operativos o incidentes de seguridad.',
          'Los objetivos concretos de continuidad, respaldo o recuperación pueden variar según el entorno contratado, la arquitectura implementada y los compromisos comerciales aplicables.',
        ],
      },
      {
        title: '7. Proveedores y terceros',
        body: [
          'Podemos apoyarnos en proveedores de infraestructura, autenticación, correo, monitoreo, automatización y otros servicios necesarios para operar la plataforma y el sitio web.',
          'Evaluamos razonablemente a proveedores relevantes, pero el uso de integraciones o servicios de terceros también puede depender de decisiones, configuraciones y contratos del cliente.',
        ],
      },
      {
        title: '8. Responsabilidades del cliente',
        body: ['La seguridad de una implementación también depende de buenas prácticas por parte del cliente. Recomendamos:'],
        bullets: [
          'Asignar permisos mínimos necesarios a usuarios, supervisores y administradores.',
          'Revisar periódicamente cuentas activas, roles, aprobaciones y flujos automatizados.',
          'Capacitar a usuarios internos sobre manejo de credenciales, phishing, archivos y procesos sensibles.',
          'Validar integraciones, automatizaciones y reglas operativas antes de aplicarlas en ambientes críticos.',
          'Reportar de inmediato cualquier actividad sospechosa o incidente de seguridad a Whagons.',
        ],
      },
      {
        title: '9. Solicitudes y reporte de vulnerabilidades',
        body: [
          'Si eres cliente y necesitas información adicional sobre prácticas de seguridad aplicables a tu cuenta o implementación, puedes solicitarla a través de tu canal comercial o de soporte.',
          'Si deseas reportar una posible vulnerabilidad o incidente, escríbenos a hello@whagons.com con la mayor cantidad de contexto posible para que podamos investigarlo de manera responsable.',
        ],
      },
      {
        title: '10. Cambios a esta política',
        body: [
          'Whagons puede actualizar esta Política de Seguridad para reflejar cambios en el producto, la infraestructura, las prácticas operativas o los requisitos aplicables. La versión vigente se publicará en esta página con su fecha de actualización.',
        ],
      },
    ],
    ctaTitle: '¿Necesitas conversar sobre seguridad?',
    ctaDescription:
      'Podemos compartir más contexto sobre controles, implementación y expectativas operativas según tu caso de uso.',
    primaryCta: 'Solicitar demo',
    secondaryCta: 'Contactar a Whagons',
  },
  en: {
    eyebrow: 'Legal',
    title: 'Security Policy',
    intro:
      'This Security Policy summarizes the practices Whagons Systems LLC applies to protect the U.S. website, infrastructure, and Whagons operations platform used by customers. It describes general controls and operating principles and may be supplemented by customer-specific agreements.',
    updatedLabel: 'Last updated',
    updatedDate: 'July 13, 2026',
    sections: [
      {
        title: '1. Security approach',
        body: [
          'Whagons designs its platform with a layered security approach intended to protect the confidentiality, integrity, and availability of operational information processed through the service.',
          'Our controls are reviewed continuously and evolve alongside product requirements, infrastructure changes, and the risk profile of organizations using Whagons.',
        ],
      },
      {
        title: '2. Access control',
        body: [
          'We apply authentication and authorization controls to limit access to systems, environments, and data to authorized people and processes only.',
        ],
        bullets: [
          'Permission assignment based on role, operational need, and level of responsibility.',
          'Separation between environments and administrative accounts where appropriate.',
          'Review and removal of access when roles change, risk is identified, or an employment or contractor relationship ends.',
          'Support for enterprise authentication and integration models when included in the customer implementation.',
        ],
      },
      {
        title: '3. Data protection',
        body: [
          'Whagons seeks to protect information in transit and at rest through reasonable technical controls, infrastructure hardening practices, and responsible management of configurations and credentials.',
          'Customers remain responsible for deciding what information they upload to the platform and for configuring internal permissions and workflows appropriately.',
        ],
      },
      {
        title: '4. Application security',
        body: [
          'We incorporate development practices intended to reduce common vulnerabilities, validate inputs, restrict improper access, and protect integrations, automations, and application features.',
          'Product updates may include security fixes, hardening improvements, and preventive adjustments when we identify risks or dependencies that require them.',
        ],
      },
      {
        title: '5. Monitoring and incident response',
        body: [
          'We maintain logs and monitoring mechanisms to investigate relevant security, abuse, stability, and service-operation events.',
          'When we identify an incident that may affect the security or availability of the service, we activate internal analysis, containment, mitigation, and recovery processes based on the nature of the event.',
        ],
      },
      {
        title: '6. Continuity and resilience',
        body: [
          'Whagons aims to operate on infrastructure and practices that support reasonable availability, backup, and recovery in the event of technical failures, operational mistakes, or security incidents.',
          'Specific continuity, backup, or recovery targets may vary based on the contracted environment, implemented architecture, and applicable commercial commitments.',
        ],
      },
      {
        title: '7. Vendors and third parties',
        body: [
          'We may rely on infrastructure, authentication, email, monitoring, automation, and other providers needed to operate the platform and website.',
          'We perform reasonable evaluation of relevant providers, but the use of integrations or third-party services may also depend on customer decisions, configurations, and contracts.',
        ],
      },
      {
        title: '8. Customer responsibilities',
        body: ['Security also depends on sound customer-side practices. We recommend that customers:'],
        bullets: [
          'Assign least-privilege permissions to users, supervisors, and administrators.',
          'Review active accounts, roles, approvals, and automated workflows on a regular basis.',
          'Train internal users on credential handling, phishing, files, and sensitive processes.',
          'Validate integrations, automations, and operational rules before applying them in critical environments.',
          'Report suspicious activity or security incidents to Whagons without delay.',
        ],
      },
      {
        title: '9. Requests and vulnerability reporting',
        body: [
          'If you are a customer and need more information about security practices relevant to your account or implementation, you may request it through your commercial or support channel.',
          'If you want to report a possible vulnerability or incident, contact us at hello@whagons.com with as much context as possible so we can investigate responsibly.',
        ],
      },
      {
        title: '10. Changes to this policy',
        body: [
          'Whagons may update this Security Policy to reflect changes in the product, infrastructure, operational practices, or applicable requirements. The current version will be posted on this page together with its effective date.',
        ],
      },
    ],
    ctaTitle: 'Need to talk through security?',
    ctaDescription:
      'We can share more context on controls, implementation, and operational expectations for your use case.',
    primaryCta: 'Request a demo',
    secondaryCta: 'Contact Whagons',
  },
};

export const dataRetentionContent: Record<Language, LegalPageContent> = {
  "es": {
    "eyebrow": "Legal",
    "title": "Política de Retención y Eliminación de Datos",
    "intro": "Esta política documenta los controles de retención actuales y el calendario propuesto de Whagons Systems LLC. Los controles propuestos no son garantías implementadas ni verificadas. Las brechas descritas siguen abiertas al 28 de septiembre de 2026.",
    "updatedLabel": "Fecha de vigencia",
    "updatedDate": "28 de septiembre de 2026",
    "sections": [
      {
        "title": "1. Alcance",
        "body": [
          "Esta política aplica a Whagons Systems LLC y a toda persona que trabaje en sus sistemas. Cubre estas categorías de información:"
        ],
        "bullets": [
          "Datos de la plataforma cargados o generados por clientes en Whagons, como tareas, formularios, archivos, comentarios y registros operativos.",
          "Datos de cuenta, usuarios y facturación de los clientes.",
          "Datos del sitio web y de prospectos, como solicitudes de demo, briefs, resultados del Hotel Operations Score y contactos de marketing.",
          "Registros técnicos y de seguridad de nuestros servidores.",
          "Datos de cuentas financieras recibidos a través de Plaid."
        ]
      },
      {
        "title": "2. Uso actual de Plaid",
        "body": [
          "La integración financiera de Life está destinada a un panel interno de finanzas personales del propietario, de solo lectura. El código solicita el producto Transactions de Plaid y consulta saldos. No inicia pagos ni transferencias. Esta política no certifica la aprobación de acceso a producción ni la conexión de cuentas bancarias reales.",
          "Una integración de Plaid para clientes requeriría una revisión independiente y una política actualizada antes de su lanzamiento."
        ]
      },
      {
        "title": "3. Retención actual y brechas conocidas",
        "body": [],
        "bullets": [
          "Life guarda actualmente transacciones y saldos financieros en su tabla de eventos de solo anexado. Desconectar una cuenta de Plaid no elimina los registros ya recopilados. No se ha verificado una purga financiera automática ni un plazo máximo de retención.",
          "Life también conserva indefinidamente los eventos de comportamiento para recalcular sus interpretaciones. La eliminación financiera propuesta debe tener un alcance separado del historial de comportamiento. Esta política no afirma que dichos eventos se borren actualmente.",
          "El código de desconexión intenta llamar a /item/remove de Plaid y quita el token cifrado de la lista activa. Actualmente omite los errores de Plaid, por lo que la eliminación local no demuestra que la revocación en Plaid haya tenido éxito.",
          "No se han verificado la caducidad de respaldos, la reaplicación de eliminaciones al restaurar, la eliminación al terminar contratos, ni la limpieza en proveedores o exportaciones locales según los plazos propuestos."
        ]
      },
      {
        "title": "4. Calendario de retención propuesto",
        "body": [
          "Estos plazos son objetivos de implementación, no máximos aplicados actualmente. El responsable debe verificar los procesos de eliminación y la configuración de respaldos antes de presentarlos como garantías operativas."
        ],
        "bullets": [
          "Datos de plataforma, cuentas y usuarios: objetivo de eliminación de producción dentro de 90 días al terminar la suscripción, sujeto a exportaciones acordadas y retenciones legales.",
          "Facturas, contabilidad e impuestos: retención propuesta de 7 años, sujeta a los requisitos aplicables. Es un calendario empresarial propuesto, no una afirmación de que todo registro fiscal estadounidense exija siete años.",
          "Datos del sitio y de prospectos: objetivo de eliminación dentro de 24 meses desde la última interacción, o antes a solicitud, conservando un registro mínimo de exclusión para respetar las bajas.",
          "Respuestas del Hotel Operations Score: el código del navegador considera vencidas las respuestas guardadas después de 24 horas al leerlas. Esto no demuestra la eliminación de copias enviadas a proveedores de gestión de prospectos.",
          "Registros técnicos y de seguridad: máximo propuesto de 12 meses.",
          "Tokens de Plaid: objetivo de revocación verificada y eliminación al desconectar, con manejo de errores y reintentos.",
          "Transacciones y saldos de Plaid: objetivo de eliminación de producción dentro de 30 días tras desconectar o verificar una solicitud de eliminación.",
          "Respaldos: objetivo de caducidad de los datos eliminados de producción dentro de otros 90 días. Falta verificar el inventario y la aplicación de este límite."
        ]
      },
      {
        "title": "5. Cómo protegemos y eliminamos los datos de Plaid",
        "body": [
          "El código revisado de Life implementa los siguientes controles. Estas afirmaciones describen el comportamiento de la aplicación; no certifican la configuración de todos los entornos desplegados."
        ],
        "bullets": [
          "Las credenciales bancarias se ingresan en Plaid Link. Nunca llegan a nuestros servidores.",
          "Los tokens de acceso de Plaid se cifran con AES-256-GCM en la aplicación antes de guardarse en la base de datos. La clave de cifrado vive en la configuración del servidor, no en la base de datos.",
          "Las transacciones y saldos se guardan en PostgreSQL. Las rutas financieras aceptan una sesión autenticada del propietario o el token Bearer compartido de Life. Ese token no está limitado al envío de eventos.",
          "El acceso es de solo lectura. No iniciamos pagos ni transferencias.",
          "El resumen financiero estándar del coach contiene agregados, como totales por categoría, por comercio y saldos, en lugar de transacciones individuales o tokens. Esto no constituye una barrera de acceso para un agente con permisos más amplios sobre el servidor o la base de datos."
        ]
      },
      {
        "title": "6. Controles de eliminación propuestos",
        "body": [
          "Estos controles siguen pendientes de implementación o verificación."
        ],
        "bullets": [
          "Confirmar la revocación en Plaid, conservar un estado que permita reintentar si falla y verificar la eliminación del token cifrado activo.",
          "Implementar y probar la eliminación de registros financieros y copias derivadas sin borrar eventos de comportamiento ajenos a la solicitud.",
          "Inventariar respaldos, aplicar su caducidad y repetir las eliminaciones completadas antes de restaurar el servicio desde una copia antigua.",
          "La revocación del token impide nuevas llamadas solo si tiene éxito. No borra datos ya recopilados. La clave de cifrado compartida actual no se destruye al desconectar, por lo que no es un borrado criptográfico de las copias guardadas.",
          "Verificar la eliminación de archivos relacionados, copias de proveedores y exportaciones locales, y registrar evidencia de finalización."
        ]
      },
      {
        "title": "7. Solicitudes de eliminación",
        "body": [
          "Envía las solicitudes de eliminación a hello@whagons.com. Verificaremos la identidad y evaluaremos los sistemas afectados. Completar la eliminación dentro de 30 días es el objetivo propuesto, no una capacidad integral verificada actualmente. La confirmación debe distinguir los datos borrados de producción de las copias retenidas o sujetas a retención legal.",
          "Quien haya conectado una cuenta mediante Plaid también puede revocar ese acceso en el portal de Plaid (my.plaid.com).",
          "Si la solicitud se refiere a datos que un cliente cargó en la plataforma, la coordinamos con ese cliente, que es quien controla esos datos."
        ]
      },
      {
        "title": "8. Retenciones legales",
        "body": [
          "Cuando una obligación legal aplicable exija conservar datos, el responsable debe documentar los registros, el motivo y el plazo antes de autorizar su eliminación. No se ha verificado la aplicación automatizada de retenciones legales."
        ]
      },
      {
        "title": "9. Responsable y revisión",
        "body": [
          "El Managing Member de Whagons Systems LLC es responsable de esta política y de que se cumpla.",
          "El responsable debe revisar esta política al menos una vez al año y antes de cualquier cambio importante en el uso de datos. La próxima revisión vence en septiembre de 2027. Los controles propuestos solo podrán describirse como actuales tras su implementación y verificación."
        ]
      },
      {
        "title": "10. Contacto",
        "body": [
          "Para preguntas sobre esta política, escríbenos a hello@whagons.com."
        ],
        "links": [
          {
            "label": "Descargar la política en PDF, en inglés",
            "href": "/policies/data-retention-and-disposal-policy.pdf"
          }
        ]
      }
    ],
    "ctaTitle": "¿Tienes preguntas sobre tus datos?",
    "ctaDescription": "Escríbenos y te respondemos sobre retención, eliminación o cualquier solicitud de datos.",
    "primaryCta": "Solicitar demo",
    "secondaryCta": "Escribir a Whagons"
  },
  "en": {
    "eyebrow": "Legal",
    "title": "Data Retention and Disposal Policy",
    "intro": "This policy records the current retention controls and the proposed retention schedule for Whagons Systems LLC. Proposed controls are not implemented or verified guarantees. The implementation gaps below remain open as of September 28, 2026.",
    "updatedLabel": "Effective date",
    "updatedDate": "September 28, 2026",
    "sections": [
      {
        "title": "1. Scope",
        "body": [
          "This policy applies to Whagons Systems LLC and to anyone who works on its systems. It covers these categories of information:"
        ],
        "bullets": [
          "Platform data that customers upload to or create in Whagons, such as tasks, forms, files, comments, and operational records.",
          "Customer account, user, and billing data.",
          "Website and lead data, such as demo requests, briefs, Hotel Operations Score results, and marketing contacts.",
          "Technical and security logs from our servers.",
          "Financial account data received through Plaid."
        ]
      },
      {
        "title": "2. Current use of Plaid",
        "body": [
          "The Life finance integration is intended for an internal, read-only personal finance dashboard for the company owner. Its code requests the Plaid Transactions product and retrieves account balances. It does not initiate payments or transfers. This policy does not certify production access approval or that any live bank accounts are connected.",
          "A customer-facing Plaid integration would require a separate review and an updated policy before launch."
        ]
      },
      {
        "title": "3. Current retention and known gaps",
        "body": [],
        "bullets": [
          "Life currently stores financial transactions and balances in its append-only events table. Disconnecting a Plaid item does not erase those previously collected records. No automatic finance purge or maximum retention period has been verified.",
          "Life also retains raw behavioral events indefinitely so that interpretations can be recomputed. Proposed finance deletion must be scoped separately from behavioral history; this policy does not claim that behavioral events are currently erased.",
          "The disconnect code attempts Plaid /item/remove and removes the encrypted token from the active item list. It currently suppresses errors from Plaid, so local removal is not proof that upstream revocation succeeded.",
          "Production backup expiry, restore-time deletion replay, customer offboarding deletion, vendor cleanup, and local export cleanup have not been verified against the proposed periods below."
        ]
      },
      {
        "title": "4. Proposed retention schedule",
        "body": [
          "These are implementation targets, not current enforced maximums. The policy owner must verify the relevant deletion workflows and backup settings before describing these periods as operational guarantees."
        ],
        "bullets": [
          "Customer platform, account and user data: target deletion from production within 90 days after the subscription ends, subject to export arrangements and legal holds.",
          "Invoices, accounting and tax records: proposed 7-year retention, subject to applicable requirements. This is a proposed business schedule, not a statement that every U.S. tax record requires seven years.",
          "Website and lead data: target deletion within 24 months after the last interaction, or earlier on request, with a minimal suppression record to honor unsubscribes.",
          "Hotel Operations Score answers: the browser storage code expires saved answers after 24 hours when reading them. This does not establish deletion of copies sent to lead-management providers.",
          "Technical and security logs: proposed maximum of 12 months.",
          "Plaid access tokens: target verified revocation and removal on disconnect, including failure handling and retries.",
          "Plaid transactions and balances: target production deletion within 30 days after disconnect or a verified deletion request.",
          "Backups: target expiry of deleted production data within a further 90 days. Backup inventory and enforcement remain to be verified."
        ]
      },
      {
        "title": "5. How we protect data received through Plaid",
        "body": [
          "The reviewed Life code implements the following controls. These statements describe application behavior; they do not certify the configuration of every deployed environment."
        ],
        "bullets": [
          "Bank credentials are entered in Plaid Link. They never reach our servers.",
          "Plaid access tokens are encrypted with AES-256-GCM in the application before they are written to the database. The encryption key lives in the server configuration, not in the database.",
          "Transactions and balances are stored in PostgreSQL. Finance routes accept an authenticated owner session or the shared Life bearer token. The bearer token is not limited to ingest access.",
          "Access is read-only. We do not initiate payments or transfers.",
          "The standard finance summary supplied to the coach contains aggregates such as category totals, merchant totals and balances, rather than individual transactions or access tokens. This is not an access-control boundary for an agent with broader server or database access."
        ]
      },
      {
        "title": "6. Proposed disposal controls",
        "body": [
          "These controls remain implementation or verification work."
        ],
        "bullets": [
          "Confirm successful Plaid revocation, retain a retryable failure state when revocation fails, and verify deletion of the active encrypted token.",
          "Implement and test scoped deletion of financial records and derived copies without deleting unrelated behavioral events.",
          "Inventory backups, enforce expiry, and re-apply completed deletions before restoring service from an older backup.",
          "Token revocation prevents future API use only after it succeeds. It does not erase collected data. The current shared encryption key is not destroyed on disconnect, so this is not cryptographic erasure of stored copies.",
          "Verify deletion of related files, vendor copies and local exports, and record completion evidence."
        ]
      },
      {
        "title": "7. Deletion requests",
        "body": [
          "Send deletion requests to hello@whagons.com. We will verify the requester and assess the affected systems. Completion within 30 days is the proposed service target, not a verified end-to-end capability today. A confirmation must distinguish deleted production data from any retained copies or legal holds.",
          "Anyone who connected an account through Plaid can also revoke that access in the Plaid Portal (my.plaid.com).",
          "If a request concerns data that a customer uploaded to the platform, we coordinate it with that customer, who controls that data."
        ]
      },
      {
        "title": "8. Legal holds",
        "body": [
          "Where an applicable legal obligation requires retention, the policy owner must document the affected records, reason and duration before authorizing deletion. Automated legal-hold enforcement has not been verified."
        ]
      },
      {
        "title": "9. Owner and review",
        "body": [
          "The Managing Member of Whagons Systems LLC owns this policy and is responsible for carrying it out.",
          "The owner must review this policy at least annually and before any material change in data use. The next review is due by September 2027. Proposed controls may be relabeled as current only after implementation and verification."
        ]
      },
      {
        "title": "10. Contact",
        "body": [
          "Questions about this policy can be sent to hello@whagons.com."
        ],
        "links": [
          {
            "label": "Download the policy PDF",
            "href": "/policies/data-retention-and-disposal-policy.pdf"
          }
        ]
      }
    ],
    "ctaTitle": "Questions about your data?",
    "ctaDescription": "Write to us about retention, deletion, or any data request.",
    "primaryCta": "Request a demo",
    "secondaryCta": "Email Whagons"
  }
};
