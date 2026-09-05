// Single source of truth for on-page SEO content AND the JSON-LD that describes it,
// so the schema never claims something the page does not actually show.

export const SITE = {
  url: "https://ll-trip-logger-local.netlify.app/",
  name: "Trip Logger",
  title: "Free Texas Occupational License Trip Log | L and L Law Group",
  description:
    "Free Texas occupational driver's license trip log. Record date, time, route, reason and odometer miles on your phone, then export a court-ready PDF.",
  ogImage: "https://ll-trip-logger-local.netlify.app/og.png",
  published: "2026-09-04",
  modified: "2026-09-05",
};

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
};

export const PEOPLE = [
  { name: "Reggie London", url: "https://landllawgroup.com/team-card/reggie-london/", bar: "24043514", title: "Co-Founding Partner, Criminal Defense Attorney" },
  { name: "Njeri London", url: "https://landllawgroup.com/team-card/njeri-london/", bar: "24043266", title: "Co-Founding Partner, Criminal Defense Attorney" },
];

export const STEPS = [
  { name: "Write down the odometer before you leave", text: "Note the exact reading on the dash before the car moves. The log calculates miles from the start and end readings, so start with the real number, not an estimate." },
  { name: "Record the date, departure time and where you are going", text: "Enter the date, the time you left, the address you left from, and your destination. Pick the reason that matches your order, for example work, school, medical, or court." },
  { name: "Enter the arrival time and ending odometer", text: "When you arrive, record the time and the new odometer reading. Save the trip. The miles are calculated for you and the entry is stored on your device." },
  { name: "Export the PDF and keep it with the vehicle", text: "Before a court date, a probation meeting, or a traffic stop, export the PDF. It lists every trip with totals and a signature line. Keep a copy in the car as your order requires." },
];

export const FIELDS = [
  { term: "Date and time", def: "The day of the trip plus departure and arrival times. Orders under Texas Transportation Code §521.248 specify the hours and days you may drive, so times prove you stayed inside them." },
  { term: "Origin and destination", def: "Where you left from and where you went. The order limits the areas or routes you may travel, and destinations show each trip fit an approved purpose." },
  { term: "Purpose of the trip", def: "Work, school, medical care, court, probation or attorney meetings, ignition-interlock service, essential household needs, child care, or religious services, as allowed by your order." },
  { term: "Odometer readings and miles", def: "Start and end readings for every trip. Miles are the arithmetic difference and become the running total on the PDF." },
];

export const FAQ = [
  { q: "Do I have to keep a trip log with a Texas occupational driver's license?", a: "Usually yes. The court order that grants an occupational license spells out when, where and why you may drive, and judges commonly require a written log of every trip so an officer or the court can check compliance. Read your order; if it mentions a log, keep one for every trip." },
  { q: "What does a Texas occupational license trip log need to show?", a: "The date, departure and arrival times, where you left from, where you went, the purpose of the trip, and the odometer readings at the start and end. Those items match the restrictions an occupational license order sets under Texas Transportation Code §521.248." },
  { q: "Is this trip logger free?", a: "Yes. There is no account, no PIN and no charge. It is provided by L and L Law Group as a public tool for drivers on an occupational license." },
  { q: "Where is my trip data stored?", a: "On your own device, in your browser's storage. Nothing is sent to a server. That also means clearing your browser data or switching phones starts a fresh log, so export the PDF regularly." },
  { q: "Can I use it on my phone?", a: "Yes. It works in any modern phone browser. Add it to your home screen for one-tap access, and log each trip as it happens rather than reconstructing it later." },
  { q: "What is in the PDF export?", a: "A letter-size log headed with your name and case number if you entered them, every trip with date, times, route, reason, odometer readings and miles, the total miles, and a signature and date line." },
  { q: "What happens if I drive outside my occupational license restrictions?", a: "Driving outside the hours, area or purposes in your order can be charged as a violation of an occupational license and can lead to the license being revoked. Keep the log current and talk to your attorney before any trip you are unsure about." },
  { q: "Who should I call if I have a question about my occupational license?", a: "L and L Law Group handles occupational driver's license petitions and DWI-related license issues across Collin, Dallas, Denton and Tarrant counties. Call (972) 370-5060 or email info@landllawgroup.com." },
];

export const RELATED = [
  { href: "https://landllawgroup.com/criminal-defense/occupational-driving-license/", label: "What an occupational driver's license allows in Texas" },
  { href: "https://landllawgroup.com/occupational-license/", label: "Occupational license eligibility checker" },
  { href: "https://landllawgroup.com/how-to-get-an-occupational-drivers-license-in-frisco-tx/", label: "How to get an occupational driver's license in Frisco" },
  { href: "https://landllawgroup.com/texas-probation-deferred-adjudication/odl/", label: "Occupational licenses while on probation or deferred adjudication" },
  { href: "https://landllawgroup.com/charges/occupational-driver-license-odl/", label: "Occupational driver's license (ODL) reference" },
  { href: "https://landllawgroup.com/criminal-defense/dwi-cases/", label: "DWI defense in Frisco and Collin County" },
];

export function jsonLd() {
  const org = {
    "@type": "LegalService",
    "@id": `${FIRM.url}#organization`,
    name: FIRM.name,
    url: FIRM.url,
    telephone: FIRM.phone,
    email: FIRM.email,
    image: SITE.ogImage,
    address: { "@type": "PostalAddress", streetAddress: FIRM.street, addressLocality: FIRM.city, addressRegion: FIRM.state, postalCode: FIRM.zip, addressCountry: "US" },
    geo: { "@type": "GeoCoordinates", latitude: FIRM.lat, longitude: FIRM.lng },
    hasMap: FIRM.map,
    areaServed: ["Collin County, TX", "Dallas County, TX", "Denton County, TX", "Tarrant County, TX"].map((n) => ({ "@type": "AdministrativeArea", name: n })),
    founder: PEOPLE.map((p) => ({ "@id": `${p.url}#person` })),
    knowsAbout: ["Occupational driver's license", "DWI defense", "Texas criminal defense"],
  };
  const people = PEOPLE.map((p) => ({
    "@type": "Person",
    "@id": `${p.url}#person`,
    name: p.name,
    url: p.url,
    jobTitle: p.title,
    worksFor: { "@id": `${FIRM.url}#organization` },
    hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: `State Bar of Texas, Bar No. ${p.bar}`, recognizedBy: { "@type": "Organization", name: "State Bar of Texas" } },
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE.url}#website`, url: SITE.url, name: `${SITE.name} | ${FIRM.name}`, publisher: { "@id": `${FIRM.url}#organization` }, inLanguage: "en-US" },
      {
        "@type": "WebPage",
        "@id": `${SITE.url}#webpage`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { "@id": `${SITE.url}#website` },
        about: { "@id": `${SITE.url}#app` },
        primaryImageOfPage: { "@type": "ImageObject", url: SITE.ogImage, width: 1200, height: 630 },
        datePublished: SITE.published,
        dateModified: SITE.modified,
        reviewedBy: PEOPLE.map((p) => ({ "@id": `${p.url}#person` })),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#lede", "#what-h"] },
        breadcrumb: { "@id": `${SITE.url}#breadcrumb` },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE.url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "L and L Law Group", item: FIRM.url },
          { "@type": "ListItem", position: 2, name: "Occupational Driver's License", item: FIRM.odl },
          { "@type": "ListItem", position: 3, name: "Trip Logger", item: SITE.url },
        ],
      },
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${SITE.url}#app`,
        name: "L and L Trip Logger",
        url: SITE.url,
        description: SITE.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Works in any modern browser.",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: ["Log date, times, route, reason and odometer per trip", "Automatic mileage from odometer readings", "Court-ready PDF export with totals and signature line", "Data stays on your device"],
        screenshot: SITE.ogImage,
        image: SITE.ogImage,
        provider: { "@id": `${FIRM.url}#organization` },
        author: { "@id": `${FIRM.url}#organization` },
        datePublished: SITE.published,
        dateModified: SITE.modified,
        inLanguage: "en-US",
      },
      {
        "@type": "HowTo",
        "@id": `${SITE.url}#howto`,
        name: "How to keep an occupational license trip log in Texas",
        description: "Four steps to a trip log that satisfies a Texas occupational driver's license order.",
        totalTime: "PT2M",
        tool: [{ "@type": "HowToTool", name: "L and L Trip Logger" }],
        step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, url: `${SITE.url}#step-${i + 1}` })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}#faq`,
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      org,
      ...people,
    ],
  };
}
