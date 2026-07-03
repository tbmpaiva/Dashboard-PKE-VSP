"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface ChartRow {
  period: string;
  leads: number;
  cpl: number;
  investimento: number;
}

interface Props {
  data: ChartRow[];
  isWeekly: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs shadow-xl"
      style={{ background: "#132C52", border: "1px solid #1E3D6B", color: "#E8F1FF", minWidth: 170 }}>
      <div className="font-semibold mb-2 uppercase tracking-wider text-xs" style={{ color: "#7A9CC4" }}>
        {label}
      </div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: entry.color }} />
            <span style={{ color: "#A8C4E0" }}>{entry.name}</span>
          </div>
          <span className="mono font-semibold">
            {entry.name === "CPL" || entry.name === "Investimento"
              ? `${entry.value}€`
              : entry.value.toLocaleString("pt-PT")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function CplChart({ data, isWeekly }: Props) {
  const hasData = data.some((d) => d.investimento > 0);

  if (!hasData) {
    return (
      <div className="rounded-xl flex items-center justify-center h-64"
        style={{ border: "1px solid #1E3D6B", background: "#0F2240" }}>
        <p className="text-sm" style={{ color: "#7A9CC4" }}>
          Sem dados de investimento para o período seleccionado
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1E3D6B", background: "#0F2240" }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #1E3D6B" }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
          Investimento e CPL {isWeekly ? "Semanal" : "Diário"}
        </h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3D6B" strokeOpacity={0.6} vertical={false} />
            <XAxis dataKey="period" tick={{ fill: "#7A9CC4", fontSize: 11, fontFamily: "JetBrains Mono" }}
              axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "#7A9CC4", fontSize: 11 }}
              axisLine={false} tickLine={false} width={40} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#7A9CC4", fontSize: 11 }}
              axisLine={false} tickLine={false} width={44}
              tickFormatter={(v) => `${v}€`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 12, fontSize: 11, color: "#7A9CC4" }} />
            <Bar yAxisId="left" dataKey="investimento" name="Investimento" fill="#F59E0B" opacity={0.8} radius={[3,3,0,0]} />
            <Bar yAxisId="left" dataKey="leads" name="Leads" fill="#3A86FF" opacity={0.9} radius={[3,3,0,0]} />
            <Line yAxisId="right" type="monotone" dataKey="cpl" name="CPL"
              stroke="#EF4444" strokeWidth={2}
              dot={{ fill: "#EF4444", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#EF4444" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
