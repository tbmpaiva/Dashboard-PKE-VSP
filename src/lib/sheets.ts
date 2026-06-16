// IDs e GIDs da Google Sheet
const SHEET_ID = "1H7y7ereb81CeBBTa95mYDRepIpnaDxp7q2Rca17A2Wo";
const GID_DIARIA = "1881326090";
// GID da sheet semanal - obtido pelo URL da sheet semanal
const GID_SEMANAL = "1762581"; // sheet principal (índice 0) - ajustar se necessário

export const VSP_LIST = [
  { key: "solucoesfap", label: "SoluçõesFAP", color: "#3A86FF" },
  { key: "fapluz", label: "FAPLuz", color: "#10B981" },
  { key: "fapemergencia", label: "FAPEmergência", color: "#F59E0B" },
  { key: "faporcamento", label: "FAPOrçamento", color: "#8B5CF6" },
  { key: "scorecardfap", label: "ScorecardFAP", color: "#EF4444" },
] as const;

export type VspKey = (typeof VSP_LIST)[number]["key"];

export interface RowData {
  period: string; // semana ou dia
  leads_solucoesfap: number;
  leads_fapluz: number;
  leads_fapemergencia: number;
  leads_faporcamento: number;
  leads_scorecardfap: number;
  total_leads: number;
  trafego_solucoesfap: number;
  trafego_fapluz: number;
  trafego_fapemergencia: number;
  trafego_faporcamento: number;
  trafego_scorecardfap: number;
  txconv_solucoesfap: number;
  txconv_fapluz: number;
  txconv_fapemergencia: number;
  txconv_faporcamento: number;
  txconv_scorecardfap: number;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function toNum(val: string): number {
  if (!val || val === "") return 0;
  // Remove espaços e converte vírgula decimal para ponto
  const cleaned = val.replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

async function fetchSheetCsv(gid: string): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Erro ao buscar sheet gid=${gid}: ${res.status}`);
  return res.text();
}

function parseRows(csv: string, isWeekly: boolean): RowData[] {
  const lines = csv.split("\n").filter((l) => l.trim() !== "");
  // linha 0 é cabeçalho
  const rows: RowData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 16) continue;

    // Col A = Ano, Col B = Semana ou Dia, C..G = leads, H = total, I..M = trafego, N..R = txconv
    const period = cols[1]?.trim();
    if (!period || period === "") continue;

    // Filtro: só incluir linhas com pelo menos algum dado
    const hasData =
      toNum(cols[7]) > 0 || // total leads
      toNum(cols[8]) > 0 || // trafego solucoesfap
      toNum(cols[2]) > 0; // leads solucoesfap

    if (!hasData) continue;

    rows.push({
      period,
      leads_solucoesfap: toNum(cols[2]),
      leads_fapluz: toNum(cols[3]),
      leads_fapemergencia: toNum(cols[4]),
      leads_faporcamento: toNum(cols[5]),
      leads_scorecardfap: toNum(cols[6]),
      total_leads: toNum(cols[7]),
      trafego_solucoesfap: toNum(cols[8]),
      trafego_fapluz: toNum(cols[9]),
      trafego_fapemergencia: toNum(cols[10]),
      trafego_faporcamento: toNum(cols[11]),
      trafego_scorecardfap: toNum(cols[12]),
      txconv_solucoesfap: toNum(cols[13]),
      txconv_fapluz: toNum(cols[14]),
      txconv_fapemergencia: toNum(cols[15]),
      txconv_faporcamento: toNum(cols[16]) || 0,
      txconv_scorecardfap: toNum(cols[17]) || 0,
    });
  }

  return rows;
}

export async function fetchDailyData(): Promise<RowData[]> {
  const csv = await fetchSheetCsv(GID_DIARIA);
  return parseRows(csv, false);
}

export async function fetchWeeklyData(): Promise<RowData[]> {
  // Tentar com GID 0 primeiro, se falhar tentar com o nome
  try {
    const csv = await fetchSheetCsv(GID_SEMANAL);
    const rows = parseRows(csv, true);
    if (rows.length > 0) return rows;
  } catch {
    // silent
  }
  // Fallback: tentar exportar pelo nome da sheet
  const url2 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Vis%C3%A3o%20VSP%20Semanal`;
  try {
    const res = await fetch(url2, { cache: "no-store" });
    if (res.ok) {
      const csv = await res.text();
      return parseRows(csv, true);
    }
  } catch {
    // silent
  }
  return [];
}

export function computeGlobals(rows: RowData[], vsp: VspKey | "all") {
  let totalTrafico = 0;
  let totalLeads = 0;

  for (const row of rows) {
    if (vsp === "all") {
      // Somar tráfego de todas as VSPs
      totalTrafico +=
        row.trafego_solucoesfap +
        row.trafego_fapluz +
        row.trafego_fapemergencia +
        row.trafego_faporcamento +
        row.trafego_scorecardfap;
      totalLeads += row.total_leads;
    } else {
      totalTrafico += row[`trafego_${vsp}` as keyof RowData] as number;
      totalLeads += row[`leads_${vsp}` as keyof RowData] as number;
    }
  }

  const txConv = totalTrafico > 0 ? (totalLeads / totalTrafico) * 100 : 0;
  return { totalTrafico, totalLeads, txConv };
}

export function buildChartData(
  rows: RowData[],
  vsp: VspKey | "all"
): { period: string; trafego: number; leads: number; txconv: number }[] {
  return rows.map((row) => {
    let trafego = 0;
    let leads = 0;

    if (vsp === "all") {
      trafego =
        row.trafego_solucoesfap +
        row.trafego_fapluz +
        row.trafego_fapemergencia +
        row.trafego_faporcamento +
        row.trafego_scorecardfap;
      leads = row.total_leads;
    } else {
      trafego = row[`trafego_${vsp}` as keyof RowData] as number;
      leads = row[`leads_${vsp}` as keyof RowData] as number;
    }

    const txconv = trafego > 0 ? parseFloat(((leads / trafego) * 100).toFixed(1)) : 0;

    return { period: row.period, trafego, leads, txconv };
  });
}

// ─── Helpers de período ───────────────────────────────────────────────────────

// Extrai o mês de uma string de data "DD/MM/YYYY" → "YYYY-MM" (para agrupar)
function monthKeyFromDate(dateStr: string): string {
  // formato esperado: 12/06/2026 ou 2026-06-12
  const parts = dateStr.includes("/") ? dateStr.split("/") : null;
  if (parts && parts.length === 3) {
    // DD/MM/YYYY
    return `${parts[2]}-${parts[1]}`;
  }
  // fallback: tentar ISO
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  }
  return dateStr;
}

const PT_MONTHS: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
  "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
  "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
};

export interface PeriodOption {
  value: string; // "all" | "2026-06" | "24" (semana)
  label: string; // "Todos" | "Junho 2026" | "Semana 24"
}

// Para vista diária: devolve os meses disponíveis nos dados
export function getMonthOptions(rows: RowData[]): PeriodOption[] {
  const seen = new Set<string>();
  for (const row of rows) {
    const key = monthKeyFromDate(row.period);
    seen.add(key);
  }
  const sorted = Array.from(seen).sort();
  const options: PeriodOption[] = [{ value: "all", label: "Todos os meses" }];
  for (const key of sorted) {
    const [year, month] = key.split("-");
    options.push({ value: key, label: `${PT_MONTHS[month] || month} ${year}` });
  }
  return options;
}

// Para vista semanal: devolve as semanas disponíveis nos dados
export function getWeekOptions(rows: RowData[]): PeriodOption[] {
  const seen = new Set<string>();
  for (const row of rows) {
    seen.add(row.period);
  }
  const sorted = Array.from(seen).sort((a, b) => Number(a) - Number(b));
  const options: PeriodOption[] = [{ value: "all", label: "Todas as semanas" }];
  for (const week of sorted) {
    options.push({ value: week, label: `Semana ${week}` });
  }
  return options;
}

// Filtra rows por período seleccionado
export function filterRowsByPeriod(
  rows: RowData[],
  selectedPeriod: string,
  isWeekly: boolean
): RowData[] {
  if (selectedPeriod === "all") return rows;
  if (isWeekly) {
    return rows.filter((r) => r.period === selectedPeriod);
  }
  // diária: filtrar por mês (YYYY-MM)
  return rows.filter((r) => monthKeyFromDate(r.period) === selectedPeriod);
}

export function buildVspBreakdown(rows: RowData[]) {
  const totals = VSP_LIST.map((vsp) => {
    let trafego = 0;
    let leads = 0;
    for (const row of rows) {
      trafego += row[`trafego_${vsp.key}` as keyof RowData] as number;
      leads += row[`leads_${vsp.key}` as keyof RowData] as number;
    }
    const txconv = trafego > 0 ? parseFloat(((leads / trafego) * 100).toFixed(1)) : 0;
    return { ...vsp, trafego, leads, txconv };
  });
  return totals;
}
