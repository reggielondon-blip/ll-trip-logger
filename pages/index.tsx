import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { AuthCredentials, Trip, TripFormData } from "@/lib/types";
import { buildTripLogPdf } from "@/lib/pdf";

// All data lives in this browser's localStorage. No backend, no database.
const SESSION_KEY = "ll-trip-logger.session";
const FIRM = {
  name: "L and L Law Group, PLLC",
  tag: "Criminal Defense · Frisco, Texas",
  phone: "(972) 370-5060",
  tel: "tel:+19723705060",
  addr: "5899 Preston Rd, Suite 101, Frisco, TX 75034",
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

function loadSession(): AuthCredentials | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthCredentials) : null;
  } catch {
    return null;
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
  const [session, setSession] = useState<AuthCredentials | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);
  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };
  if (!ready) return null;
  return (
    <div className="flex-1 flex flex-col">
      <Header session={session} onSignOut={signOut} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-10">
        {session ? (
          <Logger session={session} />
        ) : (
          <Login
            onLogin={(s) => {
              localStorage.setItem(SESSION_KEY, JSON.stringify(s));
              setSession(s);
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function Header({ session, onSignOut }: { session: AuthCredentials | null; onSignOut: () => void }) {
  return (
    <header className="bg-[var(--black)] text-[var(--snow)] border-b-4 border-[var(--peach)]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <a href={FIRM.site} className="block no-underline text-[var(--snow)]">
          <div className="display text-xl sm:text-2xl font-extrabold leading-none tracking-tight">{FIRM.name}</div>
          <div className="eyebrow text-[var(--peach)] mt-1">{FIRM.tag}</div>
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div className="eyebrow text-[var(--cyan)]">Trip Logger</div>
            <div className="text-sm text-[var(--snow)]/80">Occupational driving log</div>
          </div>
          {session ? (
            <div className="text-right text-sm border-l border-white/20 pl-4">
              <div className="font-semibold">{session.client_email}</div>
              <div className="text-[var(--peach)] tnum">Case {session.case_id}</div>
              <button onClick={onSignOut} className="mt-1 text-xs underline underline-offset-2 text-[var(--snow)]/80 hover:text-[var(--cyan)]">Sign out</button>
            </div>
          ) : (
            <a href={FIRM.tel} className="rounded-md bg-[var(--cyan)] text-[var(--black)] font-semibold px-4 py-2 text-sm hover:bg-[var(--peach)] no-underline whitespace-nowrap">Call {FIRM.phone}</a>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ll-shimmer bg-[var(--ink-deep)] text-[var(--snow)] mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="eyebrow text-[var(--peach)] mb-3">L and L Law Group</div>
          <div className="display text-lg font-bold">{FIRM.name}</div>
          <div className="text-sm text-[var(--snow)]/80 mt-1">{FIRM.addr}</div>
          <a href={FIRM.tel} className="block mt-2 text-sm font-semibold text-[var(--snow)] hover:text-[var(--peach)]">{FIRM.phone}</a>
        </div>
        <div>
          <div className="eyebrow text-[var(--peach)] mb-3">Occupational license</div>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-[var(--peach)]" href={FIRM.odl}>What an occupational driver&apos;s license allows</a></li>
            <li><a className="hover:text-[var(--peach)]" href={`${FIRM.site}/occupational-license/`}>Check your eligibility</a></li>
            <li><a className="hover:text-[var(--peach)]" href={`${FIRM.site}/texas-probation-deferred-adjudication/odl/`}>Texas ODL guide</a></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-[var(--peach)] mb-3">About this log</div>
          <p className="text-sm text-[var(--snow)]/80">Your entries are saved on this device only, in this browser. Export the PDF regularly and keep it with the vehicle as your court order requires. Nothing here is legal advice.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-[var(--snow)]/60 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {FIRM.name}. Attorney advertising.</span>
          <a className="hover:text-[var(--peach)]" href={FIRM.site}>landllawgroup.com</a>
        </div>
      </div>
    </footer>
  );
}

const inputCls = "w-full rounded-md border border-[var(--ink-line)] bg-white px-3 py-2 text-base text-[var(--ink)] placeholder:text-[var(--ink-mid)]";
const primaryBtn = "w-full rounded-md bg-[var(--cyan)] text-[var(--black)] font-bold py-2.5 hover:bg-[var(--peach)] disabled:opacity-60";
const ghostBtn = "rounded-md border-2 border-[var(--black)] text-[var(--black)] font-semibold px-4 py-2 hover:bg-[var(--bg-tint)] disabled:opacity-60";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-sm font-semibold text-[var(--ink-soft)] mb-1">{label}</span>
      {children}
    </label>
  );
}

function Login({ onLogin }: { onLogin: (s: AuthCredentials) => void }) {
  const [caseId, setCaseId] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const creds: AuthCredentials = { case_id: caseId.trim().toUpperCase(), client_email: email.trim().toLowerCase(), client_pin: pin };
      const res = await api.verifyAuth(creds);
      if (!res.authenticated) throw new Error("Sign-in failed");
      onLogin(creds);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[var(--card)] rounded-lg border border-[var(--ink-line)] shadow-sm p-6 sm:p-8">
        <div className="eyebrow text-[var(--cyan-deep)] mb-2">Client sign-in</div>
        <h1 className="text-2xl sm:text-3xl text-[var(--black)]">Your occupational driving log</h1>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Enter your email, case number and a 4-digit PIN. Your log is stored on this device.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email" htmlFor="email">
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Case number" htmlFor="case">
            <input id="case" required value={caseId} onChange={(e) => setCaseId(e.target.value)} className={inputCls} placeholder="e.g. LL-2026-0412" />
          </Field>
          <Field label="4-digit PIN" htmlFor="pin">
            <input id="pin" inputMode="numeric" pattern="\d{4}" maxLength={4} required value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className={`${inputCls} tracking-[0.5em]`} />
          </Field>
          {err && <p role="alert" className="text-sm text-[var(--bad)]">{err}</p>}
          <button disabled={busy} className={primaryBtn}>{busy ? "Checking…" : "Sign in"}</button>
        </form>
      </div>
      <p className="mt-4 text-sm text-center text-[var(--ink-mid)]">Questions? Call the office at <a className="underline decoration-[var(--cyan)] hover:decoration-[var(--magenta)] text-[var(--black)]" href={FIRM.tel}>{FIRM.phone}</a>.</p>
    </div>
  );
}

const emptyTrip = (): TripFormData => ({ trip_date: today(), time_start: "", time_end: "", location_from: "", location_to: "", reason: REASONS[0], odometer_start: "", odometer_end: "" });

function Logger({ session }: { session: AuthCredentials }) {
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
      const list = await api.getTrips(session);
      setTrips([...list].sort((a, b) => (b.trip_date + b.time_start).localeCompare(a.trip_date + a.time_start) || b.id - a.id));
      setErr(null);
    } catch (e) {
      fail(e);
    } finally {
      setLoading(false);
    }
  }, [session]);

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
      await api.createTrip(form, session);
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
      await api.deleteTrip(t.id, session);
      setTrips((list) => list.filter((x) => x.id !== t.id));
    } catch (ex) {
      fail(ex);
    }
  };

  const exportPdf = async () => {
    setExporting(true);
    setErr(null);
    try {
      await buildTripLogPdf(await api.exportTrips(session));
    } catch (ex) {
      fail(ex);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <section className="bg-[var(--card)] rounded-lg border border-[var(--ink-line)] shadow-sm p-5 sm:p-6 h-fit">
        <div className="eyebrow text-[var(--cyan-deep)] mb-1">New entry</div>
        <h2 className="text-xl text-[var(--black)]">Log a trip</h2>
        <form onSubmit={save} className="mt-4 space-y-4">
          <Field label="Date" htmlFor="date">
            <input id="date" type="date" required value={form.trip_date} max={today()} onChange={(e) => set("trip_date", e.target.value)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Left at" htmlFor="ts"><input id="ts" type="time" required value={form.time_start} onChange={(e) => set("time_start", e.target.value)} className={inputCls} /></Field>
            <Field label="Arrived at" htmlFor="te"><input id="te" type="time" required value={form.time_end} onChange={(e) => set("time_end", e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="From" htmlFor="from"><input id="from" required maxLength={255} value={form.location_from} onChange={(e) => set("location_from", e.target.value)} className={inputCls} placeholder="Home – 123 Main St, Frisco" /></Field>
          <Field label="To" htmlFor="to"><input id="to" required maxLength={255} value={form.location_to} onChange={(e) => set("location_to", e.target.value)} className={inputCls} placeholder="Work – 500 Legacy Dr, Plano" /></Field>
          <Field label="Reason" htmlFor="reason">
            <select id="reason" value={form.reason} onChange={(e) => set("reason", e.target.value)} className={inputCls}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Odometer start" htmlFor="os"><input id="os" type="number" step="0.1" min="0" inputMode="decimal" required value={form.odometer_start} onChange={(e) => set("odometer_start", e.target.value)} className={inputCls} /></Field>
            <Field label="Odometer end" htmlFor="oe"><input id="oe" type="number" step="0.1" min="0" inputMode="decimal" required value={form.odometer_end} onChange={(e) => set("odometer_end", e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="rounded-md bg-[var(--bg-tint)] border border-[var(--border-peach)] px-3 py-2 text-sm flex items-center justify-between">
            <span className="text-[var(--ink-soft)]">Miles this trip</span>
            <span className="tnum font-bold text-[var(--black)] text-lg">{autoMiles ?? "—"}</span>
          </div>
          {form.odometer_start !== "" && form.odometer_end !== "" && autoMiles === null && (
            <p className="text-sm text-[var(--bad)]">Ending odometer must be greater than the start.</p>
          )}
          {notice && <p className="text-sm text-[var(--ok)]">{notice}</p>}
          <button disabled={saving} className={primaryBtn}>{saving ? "Saving…" : "Save trip"}</button>
        </form>
      </section>

      <section className="bg-[var(--card)] rounded-lg border border-[var(--ink-line)] shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="eyebrow text-[var(--cyan-deep)] mb-1">Your log</div>
            <h2 className="text-xl text-[var(--black)]">Your trips</h2>
            <p className="text-sm text-[var(--ink-soft)]"><span className="tnum font-semibold">{trips.length}</span> trips · <span className="tnum font-semibold">{totalMiles}</span> miles</p>
          </div>
          <div className="flex gap-2">
            <button onClick={refresh} disabled={loading} className={ghostBtn}>Refresh</button>
            <button onClick={exportPdf} disabled={exporting || trips.length === 0} className="rounded-md bg-[var(--peach)] text-[var(--black)] font-bold px-4 py-2 hover:bg-[var(--cyan)] disabled:opacity-60">
              {exporting ? "Building PDF…" : "Export PDF"}
            </button>
          </div>
        </div>
        {err && <p role="alert" className="mt-3 text-sm text-[var(--bad)]">{err}</p>}
        {loading ? (
          <p className="mt-6 text-sm text-[var(--ink-mid)]">Loading…</p>
        ) : trips.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--ink-mid)]">No trips yet. Log your first one on the left.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left eyebrow text-[var(--ink-mid)] border-b-2 border-[var(--black)]">
                  <th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Time</th><th className="py-2 pr-3">Route</th><th className="py-2 pr-3">Reason</th>
                  <th className="py-2 pr-3 text-right">Odometer</th><th className="py-2 pr-3 text-right">Miles</th><th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--ink-line)] align-top">
                    <td className="py-2 pr-3 tnum whitespace-nowrap">{fmtDate(t.trip_date)}</td>
                    <td className="py-2 pr-3 tnum whitespace-nowrap text-[var(--ink-soft)]">{fmtTime(t.time_start)}{t.time_end ? ` – ${fmtTime(t.time_end)}` : ""}</td>
                    <td className="py-2 pr-3 min-w-[14rem]"><div>{t.location_from}</div><div className="text-[var(--ink-soft)]">→ {t.location_to}</div></td>
                    <td className="py-2 pr-3 text-[var(--ink-soft)]">{t.reason}</td>
                    <td className="py-2 pr-3 tnum text-right whitespace-nowrap text-[var(--ink-soft)]">{t.odometer_start} → {t.odometer_end}</td>
                    <td className="py-2 pr-3 tnum text-right font-bold">{t.miles}</td>
                    <td className="py-2 text-right"><button onClick={() => remove(t)} className="text-xs text-[var(--bad)] underline underline-offset-2">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-6 text-xs text-[var(--ink-mid)]">Saved in this browser only (localStorage). Clearing site data or switching devices starts a fresh log, so export the PDF regularly.</p>
      </section>
    </div>
  );
}
