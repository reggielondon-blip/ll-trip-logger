import { CONTENT, DATES, FIRM, PEOPLE, STATUTE } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

function fmt(iso: string, lang: Lang) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

// Everything below the tool: the explainer, how-to, FAQ and related links that
// the JSON-LD in lib/seo.ts describes. Same data, so schema and page always agree.
export default function SeoContent({ lang }: { lang: Lang }) {
  const c = CONTENT[lang];
  return (
    <div className="seo">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href={FIRM.url}>{c.crumbs.firm}</a></li>
          <li><a href={lang === "es" ? FIRM.odlEs : FIRM.odl}>{c.crumbs.odl}</a></li>
          <li aria-current="page">{c.crumbs.here}</li>
        </ol>
      </nav>

      <section className="seo-section" id="how-to">
        <div className="eyebrow">{c.howEyebrow}</div>
        <h2>{c.howH}</h2>
        <p className="seo-lede">{c.howLede}</p>
        <ol className="steps">
          {c.steps.map((s, i) => (
            <li key={s.name} id={`step-${i + 1}`}>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="seo-section" id="what">
        <div className="eyebrow">{c.whatEyebrow}</div>
        <h2 id="what-h">{c.whatH}</h2>
        <p className="seo-lede">
          {c.whatLede1}<a href={STATUTE} rel="noopener">{c.whatStatute}</a>{c.whatLede2}
        </p>
        <dl className="fields">
          {c.fields.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>{f.def}</dd>
            </div>
          ))}
        </dl>
        <p className="seo-note">{c.whatNote}</p>
      </section>

      <section className="seo-section" id="faq">
        <div className="eyebrow">{c.faqEyebrow}</div>
        <h2>{c.faqH}</h2>
        <div className="faq">
          {c.faq.map((f) => (
            <details key={f.q}>
              <summary><h3>{f.q}</h3></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="seo-section" id="related">
        <div className="eyebrow">{c.relatedEyebrow}</div>
        <h2>{c.relatedH}</h2>
        <ul className="related">
          {c.related.map((r) => (
            <li key={r.href}><a href={r.href}>{r.label}</a></li>
          ))}
        </ul>
      </section>

      <section className="seo-section byline-block" id="reviewed">
        <div className="eyebrow">{c.reviewedEyebrow}</div>
        <div className="reviewers">
          {PEOPLE.map((p) => (
            <div key={p.name} className="reviewer">
              <a href={p.url}><strong>{p.name}</strong></a>
              <span>{p.title[lang]} · {c.barLabel} {p.bar}</span>
            </div>
          ))}
        </div>
        <p className="seo-note">
          {c.published} <time dateTime={DATES.published}>{fmt(DATES.published, lang)}</time> · {c.updated} <time dateTime={DATES.modified}>{fmt(DATES.modified, lang)}</time>. {c.freeFrom} {FIRM.name}, {FIRM.street}, {FIRM.city}, {FIRM.state} {FIRM.zip} · <a href={`tel:${FIRM.phone}`}>{FIRM.phoneDisplay}</a>. {c.advertising}
        </p>
      </section>
    </div>
  );
}
