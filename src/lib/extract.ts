import Papa from "papaparse";
import * as XLSX from "xlsx";

const MAX_CHARS = 110000;

function clamp(text: string) {
  return text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + "\n...[truncated]" : text;
}

async function extractCsv(file: File): Promise<string> {
  const text = await file.text();
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
  const rows = parsed.data.map((r) => (Array.isArray(r) ? r.join(", ") : String(r)));
  return clamp(rows.join("\n"));
}

async function extractExcel(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const parts: string[] = [];
  for (const name of wb.SheetNames) {
    const sheet = wb.Sheets[name];
    parts.push(`# Sheet: ${name}\n` + XLSX.utils.sheet_to_csv(sheet));
  }
  return clamp(parts.join("\n\n"));
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Use the bundled worker
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    parts.push(text);
    if (parts.join("\n").length > MAX_CHARS) break;
  }
  return clamp(parts.join("\n"));
}

export async function extractFileText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) return extractCsv(file);
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return extractExcel(file);
  if (name.endsWith(".pdf")) return extractPdf(file);
  // Fallback: try plain text
  return clamp(await file.text());
}

export function isSupported(file: File): boolean {
  const n = file.name.toLowerCase();
  return [".csv", ".xlsx", ".xls", ".pdf"].some((ext) => n.endsWith(ext));
}
