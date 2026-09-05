import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { AuthCredentials, Trip, TripFormData } from "@/lib/types";
import { buildTripLogPdf } from "@/lib/pdf";
import Head from "next/head";
import SeoContent from "@/components/SeoContent";
import { jsonLd } from "@/lib/seo";

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
};

const REASONS = [
  "Work / employment",
  "School / education",
  "Medical appointment",
  "Court / probation / attorney",
  "Ignition interlock / DWI education",
  "Household duties (groceries, pharmacy)",
  "Child care / school pickup",
  "Religious service",
  "Other (essential need)",
] as const;

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

export default function Home() {
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      </Head>
      <SiteHeader onMenu={() => setMenu(true)} />
      <MobileNav open={menu} onClose={() => setMenu(false)} />
      <div className="announce">
        Free occupational driver&apos;s license <strong>trip log</strong> — no account needed — <em>saved on this device</em>
      </div>
      <main id="main" className="wrap">
        <section className="hero">
          <div className="eyebrow">Free tool · L and L Law Group</div>
          <h1>
            Your occupational driving <em>log.</em>
          </h1>
          <p id="lede">Free occupational driver&apos;s license trip log for Texas. Record every trip your court order requires: date, times, where you went, why, and the odometer readings. Miles are calculated for you, everything stays on your phone, and you can export a court-ready PDF whenever you need it. Nothing to sign up for.</p>
        </section>
        {ready ? <Logger profile={profile} onProfile={saveProfile} /> : <section className="card" id="log-trip"><p className="hint">Loading your log…</p></section>}
        <SeoContent />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}

/* ---------------- flagship chrome ---------------- */

function SiteHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="hdr-wrap">
      <div className="top">
        <a href={FIRM.tel}><em>Call</em> {FIRM.phone}</a>
        <a href={`${FIRM.site}/contact-us/`}><em>Free</em> Consult</a>
      </div>
      <header className="hdr">
        <a href={FIRM.site}>
          <div className="hdr-logo">L and L <span>Law Group</span>, PLLC</div>
          <div className="hdr-sub">Criminal Defense · Frisco, Texas</div>
        </a>
        <nav className="hdr-nav" aria-label="Primary">
          <a href={`${FIRM.site}/criminal-defense/`}>Practice Areas</a>
          <a href={FIRM.odl}>Occupational License</a>
          <a href={`${FIRM.site}/calculators/`}>Calculators</a>
          <a href={`${FIRM.site}/team-card/`}>Attorneys</a>
          <a href={`${FIRM.site}/contact-us/`}>Contact</a>
        </nav>
        <div className="hdr-right">
          <button className="hdr-ham" type="button" aria-label="Open menu" onClick={onMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    </div>
  );
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className="mnav" role="dialog" aria-modal="true" aria-label="Mobile navigation" aria-hidden={!open}>
      <button className="mnav-close" type="button" onClick={onClose} aria-label="Close menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
      </button>
      <nav className="mnav-nav" aria-label="Site navigation">
        <a href="/" onClick={onClose}>Trip Logger</a>
        <a href={FIRM.site}>Home</a>
        <a href={`${FIRM.site}/criminal-defense/`}>Practice Areas</a>
        <a href={FIRM.odl}>Occupational License</a>
        <a href={`${FIRM.site}/calculators/`}>Calculators</a>
        <a href={`${FIRM.site}/team-card/`}>Attorneys</a>
        <a href={`${FIRM.site}/contact-us/`}>Contact</a>
      </nav>
      <div className="mnav-actions">
        <a href={FIRM.tel} className="mnav-call" aria-label={`Call ${FIRM.phone}`}><span className="mnav-call-icon"><PhoneIcon /></span><span>{FIRM.phone}</span></a>
        <a href={`mailto:${FIRM.email}`} className="mnav-call mnav-call-email" aria-label={`Email ${FIRM.email}`}><span className="mnav-call-icon"><MailIcon /></span><span>{FIRM.email}</span></a>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-in">
        <div>
          <div className="footer-brand">L and L <span>Law Group</span>, PLLC</div>
          <p className="footer-desc">Dedicated criminal defense for Frisco and the wider Dallas–Fort Worth metroplex. Licensed in Texas; admitted in TXND and TXED federal courts. Husband-and-wife founded; client-first by design.</p>
        </div>
        <div className="footer-col">
          <h4>Occupational License</h4>
          <a href={FIRM.odl}>What an ODL allows</a>
          <a href={`${FIRM.site}/occupational-license/`}>Eligibility checker</a>
          <a href={`${FIRM.site}/texas-probation-deferred-adjudication/odl/`}>Texas ODL guide</a>
          <a href={`${FIRM.site}/criminal-defense/dwi-cases/`}>DWI Defense</a>
        </div>
        <div className="footer-col">
          <h4>More</h4>
          <a href={`${FIRM.site}/criminal-defense/`}>Practice Areas</a>
          <a href={`${FIRM.site}/calculators/`}>Calculators</a>
          <a href={`${FIRM.site}/blog/`}>Blog</a>
          <a href={`${FIRM.site}/faq/`}>FAQ</a>
          <a href={`${FIRM.site}/about/`}>About</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <address>
            <a href={FIRM.tel}>{FIRM.phone}</a>
            <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
            <a href={FIRM.map} target="_blank" rel="noopener">5899 Preston Rd, Suite 101<br />Frisco, TX 75034</a>
          </address>
        </div>
      </div>
      <div className="footer-legal-links">
        <a href={`${FIRM.site}/privacy-policy/`}>Privacy Policy</a>
        <a href={`${FIRM.site}/terms-of-service/`}>Terms of Service</a>
        <a href={`${FIRM.site}/disclaimer/`}>Disclaimer</a>
        <a href={`${FIRM.site}/accessibility-statement/`}>Accessibility</a>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} L and L Law Group, PLLC. All rights reserved. This tool records the entries you make on your own device; it does not constitute legal advice or create an attorney–client relationship.
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <nav className="mob-bar" aria-label="Mobile contact bar">
      <div className="mob-bar-in">
        <a href={FIRM.tel} className="mb-call" aria-label="Call"><span className="mb-ic"><PhoneIcon /></span><span>Call</span></a>
        <a href={`mailto:${FIRM.email}`} className="mb-email" aria-label="Email"><span className="mb-ic"><MailIcon /></span><span>Email</span></a>
        <a href="#log-trip" className="mb-log" aria-label="Log a trip">
          <span className="mb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg></span>
          <span>Log</span>
        </a>
        <a href={FIRM.map} target="_blank" rel="noopener" className="mb-map" aria-label="Map">
          <span className="mb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
          <span>Map</span>
        </a>
        <button type="button" className="mb-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="mb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></span>
          <span>Top</span>
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

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

const emptyTrip = (): TripFormData => ({ trip_date: today(), time_start: "", time_end: "", location_from: "", location_to: "", reason: REASONS[0], odometer_start: "", odometer_end: "" });

function Logger({ profile, onProfile }: { profile: Profile; onProfile: (p: Profile) => void }) {
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
    refresh();
  }, [refresh]);

  const autoMiles = useMemo(() => {
    if (form.odometer_start === "" || form.odometer_end === "") return null;
    const m = Math.round((parseFloat(form.odometer_end) - parseFloat(form.odometer_start)) * 10) / 10;
    return Number.isFinite(m) && m > 0 ? m : null;
  }, [form.odometer_start, form.odometer_end]);
  const totalMiles = useMemo(() => Math.round(trips.reduce((s, t) => s + (t.miles || 0), 0) * 10) / 10, [trips]);

  const set = <K extends keyof TripFormData>(k: K, v: TripFormData[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setNotice(null);
    try {
      await api.createTrip(form, CREDS);
      await refresh();
      setForm((f) => ({ ...emptyTrip(), trip_date: f.trip_date, odometer_start: f.odometer_end, reason: f.reason }));
      setNotice("Trip saved.");
    } catch (ex) {
      fail(ex);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t: Trip) => {
    if (!confirm(`Delete the ${fmtDate(t.trip_date)} trip from ${t.location_from} to ${t.location_to}?`)) return;
    try {
      await api.deleteTrip(t.id, CREDS);
      setTrips((list) => list.filter((x) => x.id !== t.id));
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
        case_id: profile.case_id.trim() || "Trip log",
        client_email: [profile.name.trim(), profile.email.trim()].filter(Boolean).join("  ·  ") || "Occupational driver's license",
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
          <div className="eyebrow eyebrow-magenta">New entry</div>
          <h2>Log a trip</h2>
          <p className="card-sub">Miles are calculated from your odometer readings.</p>
          <form onSubmit={save}>
            <Field label="Date" htmlFor="date">
              <input id="date" type="date" required value={form.trip_date} max={today()} onChange={(e) => set("trip_date", e.target.value)} className="input" />
            </Field>
            <div className="grid-2">
              <Field label="Left at" htmlFor="ts"><input id="ts" type="time" value={form.time_start} onChange={(e) => set("time_start", e.target.value)} className="input" /></Field>
              <Field label="Arrived at" htmlFor="te"><input id="te" type="time" value={form.time_end} onChange={(e) => set("time_end", e.target.value)} className="input" /></Field>
            </div>
            <Field label="From" htmlFor="from"><input id="from" required maxLength={255} value={form.location_from} onChange={(e) => set("location_from", e.target.value)} className="input" placeholder="Home – 123 Main St, Frisco" /></Field>
            <Field label="To" htmlFor="to"><input id="to" required maxLength={255} value={form.location_to} onChange={(e) => set("location_to", e.target.value)} className="input" placeholder="Work – 500 Legacy Dr, Plano" /></Field>
            <Field label="Reason" htmlFor="reason">
              <select id="reason" value={form.reason} onChange={(e) => set("reason", e.target.value)} className="input">
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <div className="grid-2">
              <Field label="Odometer start" htmlFor="os"><input id="os" type="number" step="0.1" min="0" inputMode="decimal" required value={form.odometer_start} onChange={(e) => set("odometer_start", e.target.value)} className="input" /></Field>
              <Field label="Odometer end" htmlFor="oe"><input id="oe" type="number" step="0.1" min="0" inputMode="decimal" required value={form.odometer_end} onChange={(e) => set("odometer_end", e.target.value)} className="input" /></Field>
            </div>
            <div className="miles-box">
              <span>Miles this trip</span>
              <strong className="tnum">{autoMiles ?? "—"}</strong>
            </div>
            {form.odometer_start !== "" && form.odometer_end !== "" && autoMiles === null && (
              <p className="msg-err">Ending odometer must be greater than the start.</p>
            )}
            {notice && <p className="msg-ok">{notice}</p>}
            <button disabled={saving} className="btn btn-primary btn-block">{saving ? "Saving…" : "Save trip"}</button>
          </form>
        </section>

        <section className="card">
          <div className="eyebrow">For the PDF · optional</div>
          <h2>Your details</h2>
          <p className="card-sub">Printed at the top of the exported log. Leave blank if you like.</p>
          <Field label="Name" htmlFor="pname"><input id="pname" value={profile.name} onChange={(e) => onProfile({ ...profile, name: e.target.value })} className="input" placeholder="Your name" /></Field>
          <div className="grid-2">
            <Field label="Case number" htmlFor="pcase"><input id="pcase" value={profile.case_id} onChange={(e) => onProfile({ ...profile, case_id: e.target.value })} className="input" placeholder="e.g. LL-2026-0412" /></Field>
            <Field label="Email" htmlFor="pemail"><input id="pemail" type="email" value={profile.email} onChange={(e) => onProfile({ ...profile, email: e.target.value })} className="input" placeholder="you@example.com" /></Field>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="eyebrow">Your log</div>
        <h2>Your trips</h2>
        <div className="stat">
          <div><b className="tnum">{trips.length}</b><span>Trips</span></div>
          <div><b className="tnum">{totalMiles}</b><span>Miles</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <button onClick={exportPdf} disabled={exporting || trips.length === 0} className="btn btn-cyan btn-sm">{exporting ? "Building PDF…" : "Export PDF"}</button>
          <button onClick={refresh} disabled={loading} className="btn btn-ghost btn-sm">Refresh</button>
        </div>
        {err && <p role="alert" className="msg-err">{err}</p>}
        {loading ? (
          <p className="hint">Loading…</p>
        ) : trips.length === 0 ? (
          <p className="hint">No trips yet. Log your first one.</p>
        ) : (
          <div className="table-wrap">
            <table className="trips">
              <thead>
                <tr><th>Date</th><th>Time</th><th>Route</th><th>Reason</th><th className="r">Odometer</th><th className="r">Miles</th><th></th></tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.id}>
                    <td className="tnum" style={{ whiteSpace: "nowrap" }}>{fmtDate(t.trip_date)}</td>
                    <td className="tnum muted" style={{ whiteSpace: "nowrap" }}>{fmtTime(t.time_start)}{t.time_end ? ` – ${fmtTime(t.time_end)}` : ""}</td>
                    <td style={{ minWidth: "14rem" }}><div>{t.location_from}</div><div className="muted">→ {t.location_to}</div></td>
                    <td className="muted">{t.reason}</td>
                    <td className="r tnum muted" style={{ whiteSpace: "nowrap" }}>{t.odometer_start} → {t.odometer_end}</td>
                    <td className="r tnum" style={{ fontWeight: 700 }}>{t.miles}</td>
                    <td className="r"><button onClick={() => remove(t)} className="del">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="hint" style={{ marginTop: 18 }}>Saved in this browser only. Clearing site data or switching phones starts a fresh log, so export the PDF regularly and keep it with the vehicle.</p>
      </section>
    </div>
  );
}
