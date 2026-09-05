import { FAQ, FIELDS, FIRM, PEOPLE, RELATED, SITE, STEPS } from "@/lib/seo";

function fmt(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

// Everything below the tool: the explainer, how-to, FAQ and related links that
// the JSON-LD in lib/seo.ts describes. Same data, so schema and page always agree.
export default function SeoContent() {
  return (
    <div className="seo">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href={FIRM.url}>L and L Law Group</a></li>
          <li><a href={FIRM.odl}>Occupational Driver&apos;s License</a></li>
          <li aria-current="page">Trip Logger</li>
        </ol>
      </nav>

      <section className="seo-section" id="how-to">
        <div className="eyebrow">Step by step</div>
        <h2>How to keep an occupational license trip log in Texas</h2>
        <p className="seo-lede">Log each trip as it happens. The whole entry takes under two minutes and gives you a record you can hand to a judge, a probation officer, or an officer at a traffic stop.</p>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.name} id={`step-${i + 1}`}>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="seo-section" id="what">
        <div className="eyebrow">Requirements</div>
        <h2 id="what-h">What a Texas occupational license trip log needs to show</h2>
        <p className="seo-lede">An occupational driver&apos;s license comes with a court order. Under <a href="https://statutes.capitol.texas.gov/Docs/TN/htm/TN.521.htm#521.248" rel="noopener">Texas Transportation Code §521.248</a>, that order sets the hours, days, purposes and areas you may drive, and judges routinely require a log that proves each trip stayed inside those limits. A useful log records four things.</p>
        <dl className="fields">
          {FIELDS.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>{f.def}</dd>
            </div>
          ))}
        </dl>
        <p className="seo-note">This tool records exactly those four things for every trip and totals the miles on the PDF. It is a record-keeping aid, not legal advice; the terms of your own order control.</p>
      </section>

      <section className="seo-section" id="faq">
        <div className="eyebrow">Common questions</div>
        <h2>Occupational license trip log FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary><h3>{f.q}</h3></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="seo-section" id="related">
        <div className="eyebrow">Related on landllawgroup.com</div>
        <h2>Occupational license resources</h2>
        <ul className="related">
          {RELATED.map((r) => (
            <li key={r.href}><a href={r.href}>{r.label}</a></li>
          ))}
        </ul>
      </section>

      <section className="seo-section byline-block" id="reviewed">
        <div className="eyebrow">Reviewed by</div>
        <div className="reviewers">
          {PEOPLE.map((p) => (
            <div key={p.name} className="reviewer">
              <a href={p.url}><strong>{p.name}</strong></a>
              <span>{p.title} · State Bar of Texas No. {p.bar}</span>
            </div>
          ))}
        </div>
        <p className="seo-note">
          Published <time dateTime={SITE.published}>{fmt(SITE.published)}</time> · Updated <time dateTime={SITE.modified}>{fmt(SITE.modified)}</time>. Free tool from {FIRM.name}, {FIRM.street}, {FIRM.city}, {FIRM.state} {FIRM.zip} · <a href={`tel:${FIRM.phone}`}>{FIRM.phoneDisplay}</a>. Attorney advertising.
        </p>
      </section>
    </div>
  );
}
