import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { AuthCredentials, Trip, TripFormData } from "@/lib/types";
import { buildTripLogPdf } from "@/lib/pdf";
import { UI, type Lang } from "@/lib/i18n";
import { DATES, OG_IMAGE, PATHS, SITE, jsonLd, urlFor } from "@/lib/seo";
import SeoContent from "@/components/SeoContent";

// Free, no-sign-in version. Everything lives in this browser's localStorage.
// One log per device; the optional name / case number only appear on the PDF.
const PROFILE_KEY = "ll-trip-logger.profile";
const LOG_ID = "MY-LOG";
const CREDS: AuthCredentials = { case_id: LOG_ID, client_email: "", client_pin: "0000" };

const FIRM = {
  phone: "(972) 370-5060",
  tel: "tel:+19723705060",
  email: "info@landllawgroup.com",
  map: "https://g.page/landllawgroup",
  site: "https://landllawgroup.com",
  odl: "https://landllawgroup.com/criminal-defense/occupational-driving-license/",
  odlEs: "https://landllawgroup.com/es/criminal-defense/occupational-driving-license/",
};

interface Profile { name: string; case_id: string; email: string }
const emptyProfile = (): Profile => ({ name: "", case_id: "", email: "" });
function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...emptyProfile(), ...(JSON.parse(raw) as Partial<Profile>) } : emptyProfile();
  } catch {
    return emptyProfile();
  }
}
function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}
function fmtTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function TripLoggerPage({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const s = SITE[lang];
  const url = urlFor(lang);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("mnav-open", menu);
    return () => document.body.classList.remove("mnav-open");
  }, [menu]);
  const saveProfile = (p: Profile) => {
    setProfile(p);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
  };
  return (
    <>
      <Head>
        <title>{s.title}</title>
        <meta name="description" content={s.description} />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="en" href={urlFor("en")} />
        <link rel="alternate" hrefLang="es" href={urlFor("es")} />
        <link rel="alternate" hrefLang="x-default" href={urlFor("en")} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={s.locale} />
        <meta property="og:locale:alternate" content={lang === "es" ? "en_US" : "es_US"} />
        <meta property="og:site_name" content="L and L Law Group" />
        <meta property="og:title" content={s.ogTitle} />
        <meta property="og:description" content={s.ogDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={s.ogAlt} />
        <meta property="article:modified_time" content={DATES.modified} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={s.ogTitle} />
        <meta name="twitter:description" content={s.ogDescription} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
      </Head>
      <SiteHeader lang={lang} onMenu={() => setMenu(true)} />
      <MobileNav lang={lang} open={menu} onClose={() => setMenu(false)} />
      <div className="announce">
        {t.announce[0]}<strong>{t.announce[1]}</strong>{t.announce[2]}<em>{t.announce[3]}</em>
      </div>
      <main id="main" className="wrap">
        <section className="hero">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>
            {t.h1[0]}<em>{t.h1[1]}</em>
          </h1>
          <p id="lede">{t.lede}</p>
        </section>
        <DataWarning lang={lang} />
        <Logger lang={lang} profile={profile} onProfile={saveProfile} ready={ready} />
        <SeoContent lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <MobileBar lang={lang} />
    </>
  );
}

/* ---------------- flagship chrome ---------------- */

function LangSwitch({ lang }: { lang: Lang }) {
  const other: Lang = lang === "es" ? "en" : "es";
  return (
    <a href={PATHS[other]} hrefLang={other} lang={other} className="lang-switch" aria-label={UI[lang].langSwitch}>
      {UI[lang].langSwitch}
    </a>
  );
}

function SiteHeader({ lang, onMenu }: { lang: Lang; onMenu: () => void }) {
  const t = UI[lang];
  return (
    <div className="hdr-wrap">
      <div className="top">
        <a href={FIRM.tel}><em>{t.topCall}</em> {FIRM.phone}</a>
        <a href={`${FIRM.site}/contact-us/`}><em>{t.topConsultEm}</em> {t.topConsult}</a>
      </div>
      <header className="hdr">
        <a href={FIRM.site}>
          <div className="hdr-logo">L and L <span>Law Group</span>, PLLC</div>
          <div className="hdr-sub">{t.hdrSub}</div>
        </a>
        <nav className="hdr-nav" aria-label="Primary">
          <a href={`${FIRM.site}/criminal-defense/`}>{t.nav.practice}</a>
          <a href={lang === "es" ? FIRM.odlEs : FIRM.odl}>{t.nav.odl}</a>
          <a href={`${FIRM.site}/calculators/`}>{t.nav.calcs}</a>
          <a href={`${FIRM.site}/team-card/`}>{t.nav.attorneys}</a>
          <a href={`${FIRM.site}/contact-us/`}>{t.nav.contact}</a>
        </nav>
        <div className="hdr-right">
          <LangSwitch lang={lang} />
          <button className="hdr-ham" type="button" aria-label="Open menu" onClick={onMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    </div>
  );
}

function MobileNav({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const t = UI[lang];
  return (
    <div className="mnav" role="dialog" aria-modal="true" aria-label="Mobile navigation" aria-hidden={!open}>
      <button className="mnav-close" type="button" onClick={onClose} aria-label="Close menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
      </button>
      <nav className="mnav-nav" aria-label="Site navigation">
        <a href={PATHS[lang]} onClick={onClose}>{t.nav.logger}</a>
        <a href={PATHS[lang === "es" ? "en" : "es"]}>{t.langSwitch}</a>
        <a href={FIRM.site}>{t.nav.home}</a>
        <a href={`${FIRM.site}/criminal-defense/`}>{t.nav.practice}</a>
        <a href={lang === "es" ? FIRM.odlEs : FIRM.odl}>{t.nav.odl}</a>
        <a href={`${FIRM.site}/calculators/`}>{t.nav.calcs}</a>
        <a href={`${FIRM.site}/team-card/`}>{t.nav.attorneys}</a>
        <a href={`${FIRM.site}/contact-us/`}>{t.nav.contact}</a>
      </nav>
      <div className="mnav-actions">
        <a href={FIRM.tel} className="mnav-call" aria-label={`${t.topCall} ${FIRM.phone}`}><span className="mnav-call-icon"><PhoneIcon /></span><span>{FIRM.phone}</span></a>
        <a href={`mailto:${FIRM.email}`} className="mnav-call mnav-call-email" aria-label={FIRM.email}><span className="mnav-call-icon"><MailIcon /></span><span>{FIRM.email}</span></a>
      </div>
    </div>
  );
}

function SiteFooter({ lang }: { lang: Lang }) {
  const t = UI[lang];
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-in">
        <div>
          <div className="footer-brand">L and L <span>Law Group</span>, PLLC</div>
          <p className="footer-desc">{t.footerDesc}</p>
        </div>
        <div className="footer-col">
          <h4>{t.footerOdl}</h4>
          <a href={lang === "es" ? FIRM.odlEs : FIRM.odl}>{t.fl.what}</a>
          <a href={`${FIRM.site}/occupational-license/`}>{t.fl.elig}</a>
          <a href={`${FIRM.site}/texas-probation-deferred-adjudication/odl/`}>{t.fl.guide}</a>
          <a href={`${FIRM.site}/criminal-defense/dwi-cases/`}>{t.fl.dwi}</a>
        </div>
        <div className="footer-col">
          <h4>{t.footerMore}</h4>
          <a href={`${FIRM.site}/criminal-defense/`}>{t.fl.practice}</a>
          <a href={`${FIRM.site}/calculators/`}>{t.fl.calcs}</a>
          <a href={`${FIRM.site}/blog/`}>{t.fl.blog}</a>
          <a href={`${FIRM.site}/faq/`}>{t.fl.faq}</a>
          <a href={`${FIRM.site}/about/`}>{t.fl.about}</a>
        </div>
        <div className="footer-col">
          <h4>{t.footerContact}</h4>
          <address>
            <a href={FIRM.tel}>{FIRM.phone}</a>
            <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
            <a href={FIRM.map} target="_blank" rel="noopener">5899 Preston Rd, Suite 101<br />Frisco, TX 75034</a>
          </address>
        </div>
      </div>
      <div className="footer-legal-links">
        <a href={`${FIRM.site}/privacy-policy/`}>{t.legal.privacy}</a>
        <a href={`${FIRM.site}/terms-of-service/`}>{t.legal.terms}</a>
        <a href={`${FIRM.site}/disclaimer/`}>{t.legal.disclaimer}</a>
        <a href={`${FIRM.site}/accessibility-statement/`}>{t.legal.access}</a>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} L and L Law Group, PLLC. {t.bottom}
      </div>
    </footer>
  );
}

function MobileBar({ lang }: { lang: Lang }) {
  const t = UI[lang];
  return (
    <nav className="mob-bar" aria-label="Mobile contact bar">
      <div className="mob-bar-in">
        <a href={FIRM.tel} className="mb-call" aria-label={t.mob.call}><span className="mb-ic"><PhoneIcon /></span><span>{t.mob.call}</span></a>
        <a href={`mailto:${FIRM.email}`} className="mb-email" aria-label={t.mob.email}><span className="mb-ic"><MailIcon /></span><span>{t.mob.email}</span></a>
        <a href="#log-trip" className="mb-log" aria-label={t.mob.log}>
          <span className="mb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg></span>
          <span>{t.mob.log}</span>
        </a>
        <a href={FIRM.map} target="_blank" rel="noopener" className="mb-map" aria-label={t.mob.map}>
          <span className="mb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
          <span>{t.mob.map}</span>
        </a>
        <button type="button" className="mb-top" aria-label={t.mob.top} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="mb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></span>
          <span>{t.mob.top}</span>
        </button>
      </div>
    </nav>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

/* ---------------- app ---------------- */

function DataWarning({ lang }: { lang: Lang }) {
  const t = UI[lang];
  return (
    <aside className="warn" role="note" aria-labelledby="warn-h">
      <div className="warn-icon" aria-hidden="true">!</div>
      <div>
        <h2 id="warn-h">{t.warnTitle}</h2>
        <p>{t.warnBody}</p>
        <ul>
          {t.warnDo.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>
    </aside>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Logger({ lang, profile, onProfile, ready }: { lang: Lang; profile: Profile; onProfile: (p: Profile) => void; ready: boolean }) {
  const t = UI[lang];
  // trip_date starts empty so the server-rendered form matches the client (today() differs per timezone); filled in on mount.
  const emptyTrip = useCallback((): TripFormData => ({ trip_date: "", time_start: "", time_end: "", location_from: "", location_to: "", reason: t.reasons[0], odometer_start: "", odometer_end: "" }), [t.reasons]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState<TripFormData>(emptyTrip);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fail = (e: unknown) => setErr(e instanceof Error ? e.message : "Something went wrong");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getTrips(CREDS);
      setTrips([...list].sort((a, b) => (b.trip_date + b.time_start).localeCompare(a.trip_date + a.time_start) || b.id - a.id));
      setErr(null);
    } catch (e) {
      fail(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    setForm((f) => (f.trip_date ? f : { ...f, trip_date: today() }));
    refresh();
  }, [refresh, ready]);

  const autoMiles = useMemo(() => {
    if (form.odometer_start === "" || form.odometer_end === "") return null;
    const m = Math.round((parseFloat(form.odometer_end) - parseFloat(form.odometer_start)) * 10) / 10;
    return Number.isFinite(m) && m > 0 ? m : null;
  }, [form.odometer_start, form.odometer_end]);
  const totalMiles = useMemo(() => Math.round(trips.reduce((s, x) => s + (x.miles || 0), 0) * 10) / 10, [trips]);

  const set = <K extends keyof TripFormData>(k: K, v: TripFormData[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setNotice(null);
    try {
      await api.createTrip(form, CREDS);
      await refresh();
      setForm((f) => ({ ...emptyTrip(), trip_date: f.trip_date || today(), odometer_start: f.odometer_end, reason: f.reason }));
      setNotice(t.saved);
    } catch (ex) {
      fail(ex);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (x: Trip) => {
    if (!confirm(t.confirmDel(fmtDate(x.trip_date), x.location_from, x.location_to))) return;
    try {
      await api.deleteTrip(x.id, CREDS);
      setTrips((list) => list.filter((y) => y.id !== x.id));
    } catch (ex) {
      fail(ex);
    }
  };

  const exportPdf = async () => {
    setExporting(true);
    setErr(null);
    try {
      const data = await api.exportTrips(CREDS);
      await buildTripLogPdf({
        ...data,
        case_id: profile.case_id.trim() || t.pdfCase,
        client_email: [profile.name.trim(), profile.email.trim()].filter(Boolean).join("  ·  ") || t.pdfClient,
      });
    } catch (ex) {
      fail(ex);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="two-col">
      <div style={{ display: "grid", gap: 24 }}>
        <section className="card" id="log-trip">
          <div className="eyebrow eyebrow-magenta">{t.newEntry}</div>
          <h2>{t.logTrip}</h2>
          <p className="card-sub">{t.milesAuto}</p>
          <form onSubmit={save}>
            <Field label={t.date} htmlFor="date">
              <input id="date" type="date" required value={form.trip_date} max={ready ? today() : undefined} onChange={(e) => set("trip_date", e.target.value)} className="input" />
            </Field>
            <div className="grid-2">
              <Field label={t.leftAt} htmlFor="ts"><input id="ts" type="time" value={form.time_start} onChange={(e) => set("time_start", e.target.value)} className="input" /></Field>
              <Field label={t.arrivedAt} htmlFor="te"><input id="te" type="time" value={form.time_end} onChange={(e) => set("time_end", e.target.value)} className="input" /></Field>
            </div>
            <Field label={t.from} htmlFor="from"><input id="from" required maxLength={255} value={form.location_from} onChange={(e) => set("location_from", e.target.value)} className="input" placeholder={t.fromPh} /></Field>
            <Field label={t.to} htmlFor="to"><input id="to" required maxLength={255} value={form.location_to} onChange={(e) => set("location_to", e.target.value)} className="input" placeholder={t.toPh} /></Field>
            <Field label={t.reason} htmlFor="reason">
              <select id="reason" value={form.reason} onChange={(e) => set("reason", e.target.value)} className="input">
                {t.reasons.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <div className="grid-2">
              <Field label={t.odoStart} htmlFor="os"><input id="os" type="number" step="0.1" min="0" inputMode="decimal" required value={form.odometer_start} onChange={(e) => set("odometer_start", e.target.value)} className="input" /></Field>
              <Field label={t.odoEnd} htmlFor="oe"><input id="oe" type="number" step="0.1" min="0" inputMode="decimal" required value={form.odometer_end} onChange={(e) => set("odometer_end", e.target.value)} className="input" /></Field>
            </div>
            <div className="miles-box">
              <span>{t.milesThisTrip}</span>
              <strong className="tnum">{autoMiles ?? "—"}</strong>
            </div>
            {form.odometer_start !== "" && form.odometer_end !== "" && autoMiles === null && (
              <p className="msg-err">{t.odoErr}</p>
            )}
            {notice && <p className="msg-ok">{notice}</p>}
            <button disabled={saving} className="btn btn-primary btn-block">{saving ? t.saving : t.save}</button>
          </form>
        </section>

        <section className="card">
          <div className="eyebrow">{t.detailsEyebrow}</div>
          <h2>{t.details}</h2>
          <p className="card-sub">{t.detailsSub}</p>
          <Field label={t.name} htmlFor="pname"><input id="pname" value={profile.name} onChange={(e) => onProfile({ ...profile, name: e.target.value })} className="input" placeholder={t.namePh} /></Field>
          <div className="grid-2">
            <Field label={t.caseNo} htmlFor="pcase"><input id="pcase" value={profile.case_id} onChange={(e) => onProfile({ ...profile, case_id: e.target.value })} className="input" placeholder={t.casePh} /></Field>
            <Field label={t.email} htmlFor="pemail"><input id="pemail" type="email" value={profile.email} onChange={(e) => onProfile({ ...profile, email: e.target.value })} className="input" placeholder={t.emailPh} /></Field>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="eyebrow">{t.yourLog}</div>
        <h2>{t.yourTrips}</h2>
        <div className="stat">
          <div><b className="tnum">{trips.length}</b><span>{t.trips}</span></div>
          <div><b className="tnum">{totalMiles}</b><span>{t.miles}</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <button onClick={exportPdf} disabled={exporting || trips.length === 0} className="btn btn-cyan btn-sm">{exporting ? t.building : t.exportPdf}</button>
          <button onClick={refresh} disabled={loading} className="btn btn-ghost btn-sm">{t.refresh}</button>
        </div>
        {err && <p role="alert" className="msg-err">{err}</p>}
        {loading ? (
          <p className="hint">{t.loading}</p>
        ) : trips.length === 0 ? (
          <p className="hint">{t.noTrips}</p>
        ) : (
          <div className="table-wrap">
            <table className="trips">
              <thead>
                <tr><th>{t.th.date}</th><th>{t.th.time}</th><th>{t.th.route}</th><th>{t.th.reason}</th><th className="r">{t.th.odo}</th><th className="r">{t.th.miles}</th><th></th></tr>
              </thead>
              <tbody>
                {trips.map((x) => (
                  <tr key={x.id}>
                    <td className="tnum" style={{ whiteSpace: "nowrap" }}>{fmtDate(x.trip_date)}</td>
                    <td className="tnum muted" style={{ whiteSpace: "nowrap" }}>{fmtTime(x.time_start)}{x.time_end ? ` – ${fmtTime(x.time_end)}` : ""}</td>
                    <td style={{ minWidth: "14rem" }}><div>{x.location_from}</div><div className="muted">→ {x.location_to}</div></td>
                    <td className="muted">{x.reason}</td>
                    <td className="r tnum muted" style={{ whiteSpace: "nowrap" }}>{x.odometer_start} → {x.odometer_end}</td>
                    <td className="r tnum" style={{ fontWeight: 700 }}>{x.miles}</td>
                    <td className="r"><button onClick={() => remove(x)} className="del">{t.del}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="hint" style={{ marginTop: 18 }}>{t.keep}</p>
      </section>
    </div>
  );
}
