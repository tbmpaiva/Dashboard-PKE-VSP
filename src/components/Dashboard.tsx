"use client";

import { useState, useEffect, useCallback } from "react";
import KpiCard from "./KpiCard";
import EvolutionChart from "./EvolutionChart";
import VspBreakdownTable from "./VspBreakdownTable";
import VspFilter from "./VspFilter";
import PeriodSelector from "./PeriodSelector";
import {
  RowData,
  computeGlobals,
  buildChartData,
  buildVspBreakdown,
  VspKey,
  getMonthOptions,
  getWeekOptions,
  filterRowsByPeriod,
} from "@/lib/sheets";

const REFRESH_MS = 5 * 60 * 1000;

export default function Dashboard() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedVsp, setSelectedVsp] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [rows, setRows] = useState<RowData[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/data?view=${view}&t=${Date.now()}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setRows(json.rows || []);
        setFetchedAt(json.fetchedAt || "");
        setError(null);
      }
    } catch {
      setError("Erro de rede. A tentar novamente...");
    } finally {
      setLoading(false);
    }
  }, [view]);

  // Reset do período quando muda a vista
  useEffect(() => {
    setSelectedPeriod("all");
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Auto-seleccionar o período mais recente quando os dados chegam
  useEffect(() => {
    if (rows.length === 0) return;
    const opts = view === "weekly" ? getWeekOptions(rows) : getMonthOptions(rows);
    // Se só existe um período além de "Todos", seleccioná-lo automaticamente
    if (opts.length === 2 && selectedPeriod === "all") {
      setSelectedPeriod(opts[1].value);
    }
  }, [rows, view]);

  const isWeekly = view === "weekly";
  const periodOptions = isWeekly ? getWeekOptions(rows) : getMonthOptions(rows);

  // Aplicar filtro de período antes de calcular tudo o resto
  const filteredRows = filterRowsByPeriod(rows, selectedPeriod, isWeekly);

  const vspKey = selectedVsp === "all" ? "all" : (selectedVsp as VspKey);
  const globals = computeGlobals(filteredRows, vspKey);
  const chartData = buildChartData(filteredRows, vspKey);
  const vspBreakdown = buildVspBreakdown(filteredRows);

  const lastUpdated = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  // Label do período activo para mostrar nos KPI cards
  const activePeriodLabel =
    selectedPeriod === "all"
      ? "Acumulado total"
      : periodOptions.find((o) => o.value === selectedPeriod)?.label || selectedPeriod;

  return (
    <div className="min-h-screen" style={{ background: "#0D1B2A" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: "#0D1B2A",
          borderBottom: "1px solid #1E3D6B",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="px-2 py-1 rounded font-black text-lg tracking-tighter"
              style={{
                background: "#1D57A0",
                color: "#E8F1FF",
                fontFamily: "Inter",
                letterSpacing: "-0.04em",
              }}
            >
              PKE
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#E8F1FF", lineHeight: 1.2 }}>
                Dashboard FAP
              </div>
              <div className="text-xs" style={{ color: "#7A9CC4" }}>
                Performance VSP
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#7A9CC4" }}>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: loading ? "#F59E0B" : "#10B981",
                boxShadow: loading ? "0 0 6px #F59E0B" : "0 0 6px #10B981",
              }}
            />
            <span>Última actualização: {lastUpdated}</span>
          </div>

          <div
            className="flex rounded-lg p-0.5"
            style={{ background: "#132C52", border: "1px solid #1E3D6B" }}
          >
            {(["daily", "weekly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  setSelectedPeriod("all");
                  setLoading(true);
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
                style={{
                  background: view === v ? "#1D57A0" : "transparent",
                  color: view === v ? "#E8F1FF" : "#7A9CC4",
                }}
              >
                {v === "daily" ? "Diária" : "Semanal"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-6 max-w-7xl mx-auto space-y-5">

        {/* Linha 1: Filtro VSP */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <VspFilter selected={selectedVsp} onChange={setSelectedVsp} />
          <span className="text-xs mono" style={{ color: "#3A6090" }}>
            Refresh automático a cada 5 min
          </span>
        </div>

        {/* Linha 2: Selector de período */}
        {!loading && rows.length > 0 && (
          <div
            className="rounded-xl px-5 py-3"
            style={{ background: "#0F2240", border: "1px solid #1E3D6B" }}
          >
            <PeriodSelector
              options={periodOptions}
              selected={selectedPeriod}
              onChange={setSelectedPeriod}
              isWeekly={isWeekly}
            />
          </div>
        )}

        {/* Erro */}
        {error && (
          <div
            className="rounded-xl px-5 py-4 text-sm"
            style={{ background: "#2A1520", border: "1px solid #EF4444", color: "#FCA5A5" }}
          >
            {error}
          </div>
        )}

        {/* KPI Cards */}
        {loading && rows.length === 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl h-28 animate-pulse"
                style={{ background: "#132C52", border: "1px solid #1E3D6B" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              label="Tráfego Total"
              value={globals.totalTrafico.toLocaleString("pt-PT")}
              subLabel={activePeriodLabel}
              accent="#1D57A0"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <KpiCard
              label="Leads Totais"
              value={globals.totalLeads.toString()}
              subLabel={activePeriodLabel}
              trend={globals.totalLeads > 0 ? "up" : "neutral"}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.02-.97a2 2 0 0 1 2.12-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
            />
            <KpiCard
              label="Taxa de Conversão"
              value={`${globals.txConv.toFixed(1)}%`}
              subLabel="Leads / Tráfego"
              trend={globals.txConv >= 3 ? "up" : globals.txConv > 0 ? "neutral" : "down"}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              }
            />
          </div>
        )}

        {/* Gráfico de evolução */}
        {loading && rows.length === 0 ? (
          <div
            className="rounded-xl h-80 animate-pulse"
            style={{ background: "#132C52", border: "1px solid #1E3D6B" }}
          />
        ) : (
          <EvolutionChart data={chartData} isWeekly={isWeekly} />
        )}

        {/* Tabela de detalhe por VSP */}
        {loading && rows.length === 0 ? (
          <div
            className="rounded-xl h-56 animate-pulse"
            style={{ background: "#132C52", border: "1px solid #1E3D6B" }}
          />
        ) : (
          <VspBreakdownTable
            data={vspBreakdown}
            selectedVsp={selectedVsp}
            onSelect={setSelectedVsp}
          />
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <span className="text-xs" style={{ color: "#3A6090" }}>
            PKE Automotive · Campanha FAP · Dados desde 12/06/2026
          </span>
          <span className="text-xs" style={{ color: "#3A6090" }}>
            RALP Media
          </span>
        </div>
      </main>
    </div>
  );
}
