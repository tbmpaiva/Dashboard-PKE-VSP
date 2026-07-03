const SHEET_ID = "1H7y7ereb81CeBBTa95mYDRepIpnaDxp7q2Rca17A2Wo";
const GID_DIARIA   = "1881326090";
const GID_SEMANAL  = "1762581";

export const VSP_LIST = [
  { key: "solucoesfap",  label: "SoluçõesFAP",   color: "#3A86FF" },
  { key: "fapluz",       label: "FAPLuz",         color: "#10B981" },
  { key: "fapemergencia",label: "FAPEmergência",  color: "#F59E0B" },
  { key: "faporcamento", label: "FAPOrçamento",   color: "#8B5CF6" },
  { key: "scorecardfap", label: "ScorecardFAP",   color: "#EF4444" },
] as const;

export type VspKey = (typeof VSP_LIST)[number]["key"];

export interface RowData {
  period: string;
  leads_solucoesfap:   number;
  leads_fapluz:        number;
  leads_fapemergencia: number;
  leads_faporcamento:  number;
  leads_scorecardfap:  number;
  total_leads:         number;
  trafego_solucoesfap:   number;
  trafego_fapluz:        number;
  trafego_fapemergencia: number;
  trafego_faporcamento:  number;
  trafego_scorecardfap:  number;
  txconv_solucoesfap:   number;
  txconv_fapluz:        number;
  txconv_fapemergencia: number;
  txconv_faporcamento:  number;
  txconv_scorecardfap:  number;
  // Colunas S-V
  investimento_total: number;
  cpl_global:         number;
  investimento_meta:  number;
  investimento_google: number;
}

// ─── Parsing ──────────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; }
    else { current += ch; }
  }
  result.push(current.trim());
  return result;
}

function toNum(val: string): number {
  if (!val || val === "") return 0;
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

function parseRows(csv: string): RowData[] {
  const lines = csv.split("\n").filter((l) => l.trim() !== "");
  const rows: RowData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 16) continue;

    const period = cols[1]?.trim();
    if (!period || period === "") continue;

    // Só incluir linhas com dados reais
    const hasData = toNum(cols[7]) > 0 || toNum(cols[8]) > 0 || toNum(cols[2]) > 0;
    if (!hasData) continue;

    rows.push({
      period,
      leads_solucoesfap:   toNum(cols[2]),
      leads_fapluz:        toNum(cols[3]),
      leads_fapemergencia: toNum(cols[4]),
      leads_faporcamento:  toNum(cols[5]),
      leads_scorecardfap:  toNum(cols[6]),
      total_leads:         toNum(cols[7]),
      trafego_solucoesfap:   toNum(cols[8]),
      trafego_fapluz:        toNum(cols[9]),
      trafego_fapemergencia: toNum(cols[10]),
      trafego_faporcamento:  toNum(cols[11]),
      trafego_scorecardfap:  toNum(cols[12]),
      txconv_solucoesfap:   toNum(cols[13]),
      txconv_fapluz:        toNum(cols[14]),
      txconv_fapemergencia: toNum(cols[15]),
      txconv_faporcamento:  toNum(cols[16]) || 0,
      txconv_scorecardfap:  toNum(cols[17]) || 0,
      // S=18, T=19, U=20, V=21
      investimento_total:  toNum(cols[18]),
      cpl_global:          toNum(cols[19]),
      investimento_meta:   toNum(cols[20]),
      investimento_google: toNum(cols[21]),
    });
  }
  return rows;
}

export async function fetchDailyData():  Promise<RowData[]> {
  const csv = await fetchSheetCsv(GID_DIARIA);
  return parseRows(csv);
}

export async function fetchWeeklyData(): Promise<RowData[]> {
  try {
    const csv = await fetchSheetCsv(GID_SEMANAL);
    const rows = parseRows(csv);
    if (rows.length > 0) return rows;
  } catch {
    // silent, tenta fallback abaixo
  }
  // Fallback: exportar pelo nome da sheet caso o GID falhe ou mude
  try {
    const url2 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Vis%C3%A3o%20VSP%20Semanal`;
    const res = await fetch(url2, { cache: "no-store" });
    if (res.ok) {
      const csv = await res.text();
      return parseRows(csv);
    }
  } catch {
    // silent
  }
  return [];
}

// ─── Helpers de período ───────────────────────────────────────────────────────

function monthKeyFromDate(dateStr: string): string {
  const parts = dateStr.includes("/") ? dateStr.split("/") : null;
  if (parts && parts.length === 3) return `${parts[2]}-${parts[1]}`;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  }
  return dateStr;
}

const PT_MONTHS: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março",    "04": "Abril",
  "05": "Maio",    "06": "Junho",     "07": "Julho",    "08": "Agosto",
  "09": "Setembro","10": "Outubro",   "11": "Novembro", "12": "Dezembro",
};

export interface PeriodOption {
  value: string;
  label: string;
}

export function getMonthOptions(rows: RowData[]): PeriodOption[] {
  const seen = new Set<string>();
  for (const row of rows) seen.add(monthKeyFromDate(row.period));
  const sorted = Array.from(seen).sort();
  const options: PeriodOption[] = [{ value: "all", label: "Todos os meses" }];
  for (const key of sorted) {
    const [year, month] = key.split("-");
    options.push({ value: key, label: `${PT_MONTHS[month] || month} ${year}` });
  }
  return options;
}

export function getWeekOptions(rows: RowData[]): PeriodOption[] {
  const seen = new Set<string>();
  for (const row of rows) seen.add(row.period);
  const sorted = Array.from(seen).sort((a, b) => Number(a) - Number(b));
  const options: PeriodOption[] = [{ value: "all", label: "Todas as semanas" }];
  for (const week of sorted) {
    options.push({ value: week, label: `Semana ${week}` });
  }
  return options;
}

export function filterRowsByPeriod(rows: RowData[], selectedPeriod: string, isWeekly: boolean): RowData[] {
  if (selectedPeriod === "all") return rows;
  if (isWeekly) return rows.filter((r) => r.period === selectedPeriod);
  return rows.filter((r) => monthKeyFromDate(r.period) === selectedPeriod);
}

// ─── Computações ──────────────────────────────────────────────────────────────

export function computeGlobals(rows: RowData[], vsp: VspKey | "all") {
  let totalTrafico = 0;
  let totalLeads   = 0;
  let totalInvestimento = 0;

  for (const row of rows) {
    if (vsp === "all") {
      totalTrafico +=
        row.trafego_solucoesfap + row.trafego_fapluz +
        row.trafego_fapemergencia + row.trafego_faporcamento +
        row.trafego_scorecardfap;
      totalLeads += row.total_leads;
    } else {
      totalTrafico += row[`trafego_${vsp}` as keyof RowData] as number;
      totalLeads   += row[`leads_${vsp}`   as keyof RowData] as number;
    }
    // Investimento é sempre o total da campanha (não divide por VSP)
    totalInvestimento += row.investimento_total;
  }

  const txConv   = totalTrafico > 0 ? (totalLeads / totalTrafico) * 100 : 0;
  const cplGlobal = totalLeads > 0 ? totalInvestimento / totalLeads : 0;

  // Totais de plataforma
  const totalMeta   = rows.reduce((s, r) => s + r.investimento_meta, 0);
  const totalGoogle = rows.reduce((s, r) => s + r.investimento_google, 0);

  return { totalTrafico, totalLeads, txConv, totalInvestimento, cplGlobal, totalMeta, totalGoogle };
}

export function buildChartData(rows: RowData[], vsp: VspKey | "all") {
  return rows.map((row) => {
    let trafego = 0;
    let leads   = 0;
    if (vsp === "all") {
      trafego =
        row.trafego_solucoesfap + row.trafego_fapluz +
        row.trafego_fapemergencia + row.trafego_faporcamento +
        row.trafego_scorecardfap;
      leads = row.total_leads;
    } else {
      trafego = row[`trafego_${vsp}` as keyof RowData] as number;
      leads   = row[`leads_${vsp}`   as keyof RowData] as number;
    }
    const txconv = trafego > 0 ? parseFloat(((leads / trafego) * 100).toFixed(1)) : 0;
    const cpl    = leads > 0 && row.investimento_total > 0
      ? parseFloat((row.investimento_total / row.total_leads).toFixed(2))
      : 0;

    return { period: row.period, trafego, leads, txconv, cpl, investimento: row.investimento_total };
  });
}

export function buildVspBreakdown(rows: RowData[]) {
  const totalTrafegoConta = rows.reduce((s, r) =>
    s + r.trafego_solucoesfap + r.trafego_fapluz + r.trafego_fapemergencia +
        r.trafego_faporcamento + r.trafego_scorecardfap, 0);
  const totalInvestimentoConta = rows.reduce((s, r) => s + r.investimento_total, 0);
  const cpcMedio = totalTrafegoConta > 0 ? totalInvestimentoConta / totalTrafegoConta : 0;

  return VSP_LIST.map((vsp) => {
    let trafego = 0;
    let leads   = 0;
    for (const row of rows) {
      trafego += row[`trafego_${vsp.key}` as keyof RowData] as number;
      leads   += row[`leads_${vsp.key}`   as keyof RowData] as number;
    }
    const txconv = trafego > 0 ? parseFloat(((leads / trafego) * 100).toFixed(1)) : 0;

    // CPL estimado: custo estimado da VSP (trafego x CPC médio da conta) / leads da VSP
    // Assume CPC uniforme entre VSPs, aproximação sem dados reais de custo por VSP
    const custoEstimado = trafego * cpcMedio;
    const cplEstimado = leads > 0 ? parseFloat((custoEstimado / leads).toFixed(2)) : 0;

    return { ...vsp, trafego, leads, txconv, cplEstimado };
  });
}
