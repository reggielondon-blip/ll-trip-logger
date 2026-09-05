import type { ExportData } from "./types";

const PLUM: [number, number, number] = [45, 27, 78];
const NAVY: [number, number, number] = [15, 31, 53];
const GOLD: [number, number, number] = [212, 175, 55];
const GREY: [number, number, number] = [110, 105, 120];

function fmtDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}
function fmtTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// Builds and downloads the trip log PDF. jsPDF is loaded on demand so it
// never lands in the initial bundle.
export async function buildTripLogPdf(data: ExportData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  const totalMiles = Math.round(data.trips.reduce((s, t) => s + (t.miles || 0), 0) * 10) / 10;

  const header = () => {
    doc.setFillColor(...PLUM);
    doc.rect(0, 0, W, 72, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, 72, W, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.text("L and L Law Group, PLLC", M, 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(241, 227, 176);
    doc.text("Occupational Driver's License - Trip Log", M, 50);
    doc.text("5899 Preston Rd, Suite 101, Frisco, TX 75034  |  (972) 370-5060", M, 63);
  };

  const footer = (page: number, pages: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(`Generated ${new Date(data.generated_at).toLocaleString()}  |  Page ${page} of ${pages}`, M, H - 24);
    doc.text("Prepared from the client's own entries. Keep with the vehicle per the court's order.", W - M, H - 24, { align: "right" });
  };

  header();
  let y = 100;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Client: ${data.client_email}`, M, y);
  doc.text(`Case: ${data.case_id}`, W - M, y, { align: "right" });
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.setFontSize(10);
  doc.text(`${data.trips.length} trips  |  ${totalMiles.toFixed(1)} miles`, W - M, y, { align: "right" });
  y += 22;

  const cols = [
    { key: "date", label: "Date", w: 62 },
    { key: "time", label: "Time", w: 88 },
    { key: "route", label: "From > To", w: 190 },
    { key: "reason", label: "Reason", w: 104 },
    { key: "odo", label: "Odometer", w: 40, align: "right" as const },
    { key: "miles", label: "Miles", w: 32, align: "right" as const },
  ];
  const tableW = cols.reduce((s, c) => s + c.w, 0);
  const x0 = M + (W - 2 * M - tableW) / 2;

  const drawHead = () => {
    doc.setFillColor(...NAVY);
    doc.rect(x0, y, tableW, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    let x = x0;
    for (const c of cols) {
      doc.text(c.label, c.align === "right" ? x + c.w - 4 : x + 4, y + 12, { align: c.align ?? "left" });
      x += c.w;
    }
    y += 18;
  };
  drawHead();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  let stripe = false;
  for (const t of data.trips) {
    const cells: Record<string, string[]> = {
      date: [fmtDate(t.date)],
      time: [[fmtTime(t.time_start), fmtTime(t.time_end)].filter(Boolean).join(" - ")],
      route: doc.splitTextToSize(`${t.from} > ${t.to}`, cols[2].w - 8) as string[],
      reason: doc.splitTextToSize(t.reason ?? "", cols[3].w - 8) as string[],
      odo: [`${t.odometer_start}-${t.odometer_end}`],
      miles: [t.miles.toFixed(1)],
    };
    const lines = Math.max(...Object.values(cells).map((v) => v.length));
    const rowH = 6 + lines * 10;
    if (y + rowH > H - 60) {
      doc.addPage();
      header();
      y = 92;
      drawHead();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
    }
    if (stripe) {
      doc.setFillColor(246, 243, 238);
      doc.rect(x0, y, tableW, rowH, "F");
    }
    stripe = !stripe;
    doc.setTextColor(23, 18, 31);
    let x = x0;
    for (const c of cols) {
      const v = cells[c.key];
      v.forEach((line, i) => doc.text(line, c.align === "right" ? x + c.w - 4 : x + 4, y + 11 + i * 10, { align: c.align ?? "left" }));
      x += c.w;
    }
    y += rowH;
  }

  y += 12;
  if (y + 90 > H - 60) {
    doc.addPage();
    header();
    y = 100;
  }
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(x0, y, x0 + tableW, y);
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PLUM);
  doc.text(`Total miles: ${totalMiles.toFixed(1)}`, x0 + tableW, y, { align: "right" });
  y += 40;
  doc.setDrawColor(...GREY);
  doc.setLineWidth(0.5);
  doc.line(x0, y, x0 + 220, y);
  doc.line(x0 + tableW - 140, y, x0 + tableW, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text("Client signature", x0, y + 11);
  doc.text("Date", x0 + tableW - 140, y + 11);

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    footer(p, pages);
  }
  doc.save(`LL-trip-log-${data.case_id}-${data.generated_at.slice(0, 10)}.pdf`);
}
