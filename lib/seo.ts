// Single source of truth for on-page SEO content AND the JSON-LD that describes it,
// so the schema never claims something the page does not actually show. EN + ES.
import type { Lang } from "./i18n";

export const ORIGIN = "https://triplog.landllawgroup.com";
export const PATHS: Record<Lang, string> = { en: "/", es: "/es/" };
export const urlFor = (lang: Lang) => `${ORIGIN}${PATHS[lang]}`;

export const SITE = {
  en: {
    name: "Trip Logger",
    title: "Free Texas Occupational License Trip Log | L and L Law Group",
    description: "Free Texas occupational driver's license trip log. Record date, time, route, reason and odometer miles on your phone, then export a court-ready PDF.",
    ogTitle: "Free Texas Occupational License Trip Log | L and L Law Group",
    ogDescription: "Every mile, on the record. Free occupational driver's license trip log with court-ready PDF export. No account needed.",
    ogAlt: "Cartoon magenta car on a winding road with exhaust puffs, headline Trip Logger",
    locale: "en_US",
  },
  es: {
    name: "Registro de viajes",
    title: "Registro de viajes gratis para licencia ocupacional en Texas | L and L",
    description: "Registro de viajes gratuito para la licencia de conducir ocupacional en Texas. Anote fecha, hora, ruta, motivo y millas del odómetro en su teléfono y exporte un PDF para la corte.",
    ogTitle: "Registro de viajes gratis para licencia ocupacional en Texas",
    ogDescription: "Cada milla, en el registro. Registro gratuito para la licencia de conducir ocupacional con PDF listo para la corte. Sin cuenta.",
    ogAlt: "Auto de caricatura magenta en una carretera con nubes de humo, título Trip Logger",
    locale: "es_US",
  },
} as const;

export const DATES = { published: "2026-09-04", modified: "2026-09-05" };
export const OG_IMAGE = `${ORIGIN}/og.png`;

export const FIRM = {
  name: "L and L Law Group, PLLC",
  url: "https://landllawgroup.com/",
  phone: "+1-972-370-5060",
  phoneDisplay: "(972) 370-5060",
  email: "info@landllawgroup.com",
  street: "5899 Preston Rd, Suite 101",
  city: "Frisco",
  state: "TX",
  zip: "75034",
  lat: 33.1507,
  lng: -96.8236,
  map: "https://g.page/landllawgroup",
  odl: "https://landllawgroup.com/criminal-defense/occupational-driving-license/",
  odlEs: "https://landllawgroup.com/es/criminal-defense/occupational-driving-license/",
};

export const PEOPLE = [
  { name: "Reggie London", url: "https://landllawgroup.com/team-card/reggie-london/", bar: "24043514", title: { en: "Co-Founding Partner, Criminal Defense Attorney", es: "Socio cofundador, abogado de defensa penal" } },
  { name: "Njeri London", url: "https://landllawgroup.com/team-card/njeri-london/", bar: "24043266", title: { en: "Co-Founding Partner, Criminal Defense Attorney", es: "Socia cofundadora, abogada de defensa penal" } },
];

export const STATUTE = "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.521.htm#521.248";

export const CONTENT = {
  en: {
    crumbs: { firm: "L and L Law Group", odl: "Occupational Driver's License", here: "Trip Logger" },
    howEyebrow: "Step by step",
    howH: "How to keep an occupational license trip log in Texas",
    howLede: "Log each trip as it happens. The whole entry takes under two minutes and gives you a record you can hand to a judge, a probation officer, or an officer at a traffic stop.",
    howDesc: "Four steps to a trip log that satisfies a Texas occupational driver's license order.",
    steps: [
      { name: "Write down the odometer before you leave", text: "Note the exact reading on the dash before the car moves. The log calculates miles from the start and end readings, so start with the real number, not an estimate." },
      { name: "Record the date, departure time and where you are going", text: "Enter the date, the time you left, the address you left from, and your destination. Pick the reason that matches your order, for example work, school, medical, or court." },
      { name: "Enter the arrival time and ending odometer", text: "When you arrive, record the time and the new odometer reading. Save the trip. The miles are calculated for you and the entry is stored on your device." },
      { name: "Export the PDF and keep it with the vehicle", text: "Before a court date, a probation meeting, or a traffic stop, export the PDF. It lists every trip with totals and a signature line. Keep a copy in the car as your order requires." },
    ],
    whatEyebrow: "Requirements",
    whatH: "What a Texas occupational license trip log needs to show",
    whatLede1: "An occupational driver's license comes with a court order. Under ",
    whatStatute: "Texas Transportation Code §521.248",
    whatLede2: ", that order sets the hours, days, purposes and areas you may drive, and judges routinely require a log that proves each trip stayed inside those limits. A useful log records four things.",
    fields: [
      { term: "Date and time", def: "The day of the trip plus departure and arrival times. Orders under Texas Transportation Code §521.248 specify the hours and days you may drive, so times prove you stayed inside them." },
      { term: "Origin and destination", def: "Where you left from and where you went. The order limits the areas or routes you may travel, and destinations show each trip fit an approved purpose." },
      { term: "Purpose of the trip", def: "Work, school, medical care, court, probation or attorney meetings, ignition-interlock service, essential household needs, child care, or religious services, as allowed by your order." },
      { term: "Odometer readings and miles", def: "Start and end readings for every trip. Miles are the arithmetic difference and become the running total on the PDF." },
    ],
    whatNote: "This tool records exactly those four things for every trip and totals the miles on the PDF. It is a record-keeping aid, not legal advice; the terms of your own order control.",
    faqEyebrow: "Common questions",
    faqH: "Occupational license trip log FAQ",
    faq: [
      { q: "Do I have to keep a trip log with a Texas occupational driver's license?", a: "Usually yes. The court order that grants an occupational license spells out when, where and why you may drive, and judges commonly require a written log of every trip so an officer or the court can check compliance. Read your order; if it mentions a log, keep one for every trip." },
      { q: "What does a Texas occupational license trip log need to show?", a: "The date, departure and arrival times, where you left from, where you went, the purpose of the trip, and the odometer readings at the start and end. Those items match the restrictions an occupational license order sets under Texas Transportation Code §521.248." },
      { q: "Is this trip logger free?", a: "Yes. There is no account, no PIN and no charge. It is provided by L and L Law Group as a public tool for drivers on an occupational license." },
      { q: "Where is my trip data stored?", a: "On your own device, in your browser's storage. Nothing is sent to a server. That also means clearing your browser data or switching phones starts a fresh log, so export the PDF regularly." },
      { q: "Can I use it on my phone?", a: "Yes. It works in any modern phone browser. Add it to your home screen for one-tap access, and log each trip as it happens rather than reconstructing it later." },
      { q: "What is in the PDF export?", a: "A letter-size log headed with your name and case number if you entered them, every trip with date, times, route, reason, odometer readings and miles, the total miles, and a signature and date line." },
      { q: "What happens if I drive outside my occupational license restrictions?", a: "Driving outside the hours, area or purposes in your order can be charged as a violation of an occupational license and can lead to the license being revoked. Keep the log current and talk to your attorney before any trip you are unsure about." },
      { q: "Who should I call if I have a question about my occupational license?", a: "L and L Law Group handles occupational driver's license petitions and DWI-related license issues across Collin, Dallas, Denton and Tarrant counties. Call (972) 370-5060 or email info@landllawgroup.com." },
    ],
    relatedEyebrow: "Related on landllawgroup.com",
    relatedH: "Occupational license resources",
    related: [
      { href: "https://landllawgroup.com/criminal-defense/occupational-driving-license/", label: "What an occupational driver's license allows in Texas" },
      { href: "https://landllawgroup.com/occupational-license/", label: "Occupational license eligibility checker" },
      { href: "https://landllawgroup.com/how-to-get-an-occupational-drivers-license-in-frisco-tx/", label: "How to get an occupational driver's license in Frisco" },
      { href: "https://landllawgroup.com/texas-probation-deferred-adjudication/odl/", label: "Occupational licenses while on probation or deferred adjudication" },
      { href: "https://landllawgroup.com/charges/occupational-driver-license-odl/", label: "Occupational driver's license (ODL) reference" },
      { href: "https://landllawgroup.com/criminal-defense/dwi-cases/", label: "DWI defense in Frisco and Collin County" },
    ],
    reviewedEyebrow: "Reviewed by",
    barLabel: "State Bar of Texas No.",
    published: "Published", updated: "Updated", freeFrom: "Free tool from", advertising: "Attorney advertising.",
  },
  es: {
    crumbs: { firm: "L and L Law Group", odl: "Licencia de conducir ocupacional", here: "Registro de viajes" },
    howEyebrow: "Paso a paso",
    howH: "Cómo llevar el registro de viajes de una licencia ocupacional en Texas",
    howLede: "Registre cada viaje en el momento. La entrada completa toma menos de dos minutos y le deja un comprobante que puede entregar a un juez, a su oficial de probatoria o a un policía en una parada de tráfico.",
    howDesc: "Cuatro pasos para un registro de viajes que cumple con una orden de licencia de conducir ocupacional en Texas.",
    steps: [
      { name: "Anote el odómetro antes de salir", text: "Tome la lectura exacta del tablero antes de que el auto se mueva. El registro calcula las millas con las lecturas inicial y final, así que empiece con el número real, no con un estimado." },
      { name: "Registre la fecha, la hora de salida y a dónde va", text: "Ingrese la fecha, la hora en que salió, la dirección de origen y su destino. Elija el motivo que corresponde a su orden: trabajo, escuela, cita médica o corte, por ejemplo." },
      { name: "Ingrese la hora de llegada y el odómetro final", text: "Al llegar, registre la hora y la nueva lectura del odómetro. Guarde el viaje. Las millas se calculan solas y la entrada queda guardada en su dispositivo." },
      { name: "Exporte el PDF y guárdelo en el vehículo", text: "Antes de una cita en la corte, una reunión de probatoria o una parada de tráfico, exporte el PDF. Incluye cada viaje con totales y una línea para firmar. Guarde una copia en el auto como exige su orden." },
    ],
    whatEyebrow: "Requisitos",
    whatH: "Qué debe mostrar el registro de viajes de una licencia ocupacional en Texas",
    whatLede1: "Una licencia de conducir ocupacional viene con una orden judicial. Según la ",
    whatStatute: "Sección 521.248 del Código de Transporte de Texas",
    whatLede2: ", esa orden fija las horas, los días, los motivos y las zonas en que puede conducir, y los jueces suelen exigir un registro que demuestre que cada viaje se mantuvo dentro de esos límites. Un buen registro anota cuatro cosas.",
    fields: [
      { term: "Fecha y hora", def: "El día del viaje más las horas de salida y llegada. Las órdenes bajo la Sección 521.248 especifican las horas y los días en que puede conducir; las horas demuestran que las respetó." },
      { term: "Origen y destino", def: "De dónde salió y a dónde fue. La orden limita las zonas o rutas permitidas, y los destinos muestran que cada viaje tuvo un propósito aprobado." },
      { term: "Motivo del viaje", def: "Trabajo, escuela, atención médica, corte, citas de probatoria o con el abogado, servicio del interlock, necesidades esenciales del hogar, cuidado de niños o servicios religiosos, según lo permita su orden." },
      { term: "Lecturas del odómetro y millas", def: "Lecturas inicial y final de cada viaje. Las millas son la diferencia y forman el total acumulado del PDF." },
    ],
    whatNote: "Esta herramienta registra exactamente esas cuatro cosas en cada viaje y suma las millas en el PDF. Es una ayuda para llevar registros, no asesoría legal; lo que manda es el texto de su propia orden.",
    faqEyebrow: "Preguntas frecuentes",
    faqH: "Preguntas sobre el registro de viajes de la licencia ocupacional",
    faq: [
      { q: "¿Tengo que llevar un registro de viajes con una licencia de conducir ocupacional en Texas?", a: "Casi siempre sí. La orden judicial que otorga la licencia ocupacional indica cuándo, dónde y por qué puede conducir, y los jueces suelen exigir un registro escrito de cada viaje para que un policía o la corte pueda verificar el cumplimiento. Lea su orden; si menciona un registro, llévelo en cada viaje." },
      { q: "¿Qué debe mostrar el registro de viajes?", a: "La fecha, las horas de salida y llegada, de dónde salió, a dónde fue, el motivo del viaje y las lecturas del odómetro al inicio y al final. Son los mismos puntos que restringe una orden de licencia ocupacional bajo la Sección 521.248 del Código de Transporte de Texas." },
      { q: "¿Este registro de viajes es gratis?", a: "Sí. No hay cuenta, ni PIN, ni costo. Lo ofrece L and L Law Group como herramienta pública para conductores con licencia ocupacional." },
      { q: "¿Dónde se guardan mis datos?", a: "En su propio dispositivo, en el almacenamiento del navegador. Nada se envía a un servidor. Por eso, si borra los datos del navegador o cambia de teléfono, el registro empieza de cero: exporte el PDF con regularidad." },
      { q: "¿Puedo usarlo en mi teléfono?", a: "Sí. Funciona en cualquier navegador moderno de teléfono. Agréguelo a su pantalla de inicio y registre cada viaje en el momento en lugar de reconstruirlo después." },
      { q: "¿Qué incluye el PDF exportado?", a: "Un registro tamaño carta encabezado con su nombre y número de caso si los ingresó, cada viaje con fecha, horas, ruta, motivo, lecturas del odómetro y millas, el total de millas, y una línea para firma y fecha." },
      { q: "¿Qué pasa si conduzco fuera de las restricciones de mi licencia ocupacional?", a: "Conducir fuera de las horas, la zona o los motivos de su orden puede acusarse como violación de la licencia ocupacional y puede llevar a que se revoque. Mantenga el registro al día y consulte a su abogado antes de cualquier viaje del que tenga dudas." },
      { q: "¿A quién llamo si tengo preguntas sobre mi licencia ocupacional?", a: "L and L Law Group maneja peticiones de licencia de conducir ocupacional y asuntos de licencia relacionados con DWI en los condados de Collin, Dallas, Denton y Tarrant. Llame al (972) 370-5060 o escriba a info@landllawgroup.com." },
    ],
    relatedEyebrow: "Más en landllawgroup.com",
    relatedH: "Recursos sobre la licencia ocupacional",
    related: [
      { href: "https://landllawgroup.com/es/criminal-defense/occupational-driving-license/", label: "Qué permite una licencia de conducir ocupacional en Texas (en español)" },
      { href: "https://landllawgroup.com/occupational-license/", label: "Verificador de elegibilidad para la licencia ocupacional" },
      { href: "https://landllawgroup.com/how-to-get-an-occupational-drivers-license-in-frisco-tx/", label: "Cómo obtener una licencia de conducir ocupacional en Frisco" },
      { href: "https://landllawgroup.com/texas-probation-deferred-adjudication/odl/", label: "Licencia ocupacional durante la probatoria o la adjudicación diferida" },
      { href: "https://landllawgroup.com/es/", label: "L and L Law Group en español" },
      { href: "https://landllawgroup.com/criminal-defense/dwi-cases/", label: "Defensa de DWI en Frisco y el condado de Collin" },
    ],
    reviewedEyebrow: "Revisado por",
    barLabel: "Barra de Abogados de Texas No.",
    published: "Publicado", updated: "Actualizado", freeFrom: "Herramienta gratuita de", advertising: "Publicidad de abogados.",
  },
} as const;

export function jsonLd(lang: Lang) {
  const url = urlFor(lang);
  const s = SITE[lang];
  const c = CONTENT[lang];
  const inLanguage = lang === "es" ? "es-US" : "en-US";
  const org = {
    "@type": "LegalService",
    "@id": `${FIRM.url}#organization`,
    name: FIRM.name,
    url: FIRM.url,
    telephone: FIRM.phone,
    email: FIRM.email,
    image: OG_IMAGE,
    address: { "@type": "PostalAddress", streetAddress: FIRM.street, addressLocality: FIRM.city, addressRegion: FIRM.state, postalCode: FIRM.zip, addressCountry: "US" },
    geo: { "@type": "GeoCoordinates", latitude: FIRM.lat, longitude: FIRM.lng },
    hasMap: FIRM.map,
    areaServed: ["Collin County, TX", "Dallas County, TX", "Denton County, TX", "Tarrant County, TX"].map((n) => ({ "@type": "AdministrativeArea", name: n })),
    founder: PEOPLE.map((p) => ({ "@id": `${p.url}#person` })),
    knowsAbout: ["Occupational driver's license", "DWI defense", "Texas criminal defense"],
    availableLanguage: ["en", "es"],
  };
  const people = PEOPLE.map((p) => ({
    "@type": "Person",
    "@id": `${p.url}#person`,
    name: p.name,
    url: p.url,
    jobTitle: p.title[lang],
    worksFor: { "@id": `${FIRM.url}#organization` },
    hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: `State Bar of Texas, Bar No. ${p.bar}`, recognizedBy: { "@type": "Organization", name: "State Bar of Texas" } },
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: `Trip Logger | ${FIRM.name}`, publisher: { "@id": `${FIRM.url}#organization` }, inLanguage: ["en-US", "es-US"] },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: s.title,
        description: s.description,
        isPartOf: { "@id": `${ORIGIN}/#website` },
        about: { "@id": `${ORIGIN}/#app` },
        primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
        datePublished: DATES.published,
        dateModified: DATES.modified,
        reviewedBy: PEOPLE.map((p) => ({ "@id": `${p.url}#person` })),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#lede", "#what-h"] },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.crumbs.firm, item: FIRM.url },
          { "@type": "ListItem", position: 2, name: c.crumbs.odl, item: lang === "es" ? FIRM.odlEs : FIRM.odl },
          { "@type": "ListItem", position: 3, name: c.crumbs.here, item: url },
        ],
      },
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${ORIGIN}/#app`,
        name: "L and L Trip Logger",
        url: `${ORIGIN}/`,
        description: SITE.en.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Works in any modern browser.",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: ["Log date, times, route, reason and odometer per trip", "Automatic mileage from odometer readings", "Court-ready PDF export with totals and signature line", "Data stays on your device", "English and Spanish"],
        screenshot: OG_IMAGE,
        image: OG_IMAGE,
        provider: { "@id": `${FIRM.url}#organization` },
        author: { "@id": `${FIRM.url}#organization` },
        datePublished: DATES.published,
        dateModified: DATES.modified,
        inLanguage: ["en-US", "es-US"],
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: c.howH,
        description: c.howDesc,
        totalTime: "PT2M",
        inLanguage,
        tool: [{ "@type": "HowToTool", name: "L and L Trip Logger" }],
        step: c.steps.map((st, i) => ({ "@type": "HowToStep", position: i + 1, name: st.name, text: st.text, url: `${url}#step-${i + 1}` })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage,
        mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      org,
      ...people,
    ],
  };
}
