"use client";

interface VspRow {
  key: string;
  label: string;
  color: string;
  trafego: number;
  leads: number;
  txconv: number;
  cplEstimado: number;
}

interface Props {
  data: VspRow[];
  selectedVsp: string;
  onSelect: (key: string) => void;
  showCpl: boolean;
}

export default function VspBreakdownTable({ data, selectedVsp, onSelect, showCpl }: Props) {
  const totalTrafego = data.reduce((s, r) => s + r.trafego, 0);
  const totalLeads   = data.reduce((s, r) => s + r.leads, 0);
  const totalTxConv  = totalTrafego > 0 ? ((totalLeads / totalTrafego) * 100).toFixed(1) : "0.0";

  const headers = showCpl
    ? ["VSP", "Tráfego", "Leads", "Tx Conv", "CPL Estimado", "Barra"]
    : ["VSP", "Tráfego", "Leads", "Tx Conv", "Barra"];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1E3D6B", background: "#0F2240" }}>
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1E3D6B" }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
          Detalhe por VSP
        </h3>
        {showCpl && (
          <span className="text-xs" style={{ color: "#3A6090" }}>
            CPL estimado = tráfego × CPC médio da conta / leads
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #1E3D6B" }}>
              {headers.map((h, i) => (
                <th key={h}
                  className={`${i === 0 ? "text-left" : i < headers.length - 1 ? "text-right" : ""} px-5 py-3 text-xs uppercase tracking-widest font-medium`}
                  style={{ color: "#7A9CC4" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isSelected = selectedVsp === row.key;
              const pct = totalLeads > 0 ? (row.leads / totalLeads) * 100 : 0;
              return (
                <tr key={row.key}
                  onClick={() => onSelect(isSelected ? "all" : row.key)}
                  className="cursor-pointer transition-all"
                  style={{ borderBottom: "1px solid #1A2E4A", background: isSelected ? "#132C52" : "transparent" }}
                  onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#0D2240"; }}
                  onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: row.color }} />
                      <span className="font-medium" style={{ color: isSelected ? "#E8F1FF" : "#A8C4E0" }}>
                        {row.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right mono font-medium" style={{ color: "#E8F1FF" }}>
                    {row.trafego.toLocaleString("pt-PT")}
                  </td>
                  <td className="px-5 py-3 text-right mono font-semibold" style={{ color: "#3A86FF" }}>
                    {row.leads}
                  </td>
                  <td className="px-5 py-3 text-right mono font-medium"
                    style={{ color: row.txconv > 0 ? "#10B981" : "#7A9CC4" }}>
                    {row.txconv.toFixed(1)}%
                  </td>
                  {showCpl && (
                    <td className="px-5 py-3 text-right mono font-medium"
                      style={{ color: row.cplEstimado > 0 ? "#F59E0B" : "#7A9CC4" }}>
                      {row.cplEstimado > 0 ? `${row.cplEstimado.toFixed(2)}€` : "-"}
                    </td>
                  )}
                  <td className="px-5 py-3 w-32">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1E3D6B" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: row.color }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "1px solid #1E3D6B", background: "#132C52" }}>
              <td className="px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9CC4" }}>Total</td>
              <td className="px-5 py-3 text-right mono font-bold" style={{ color: "#E8F1FF" }}>{totalTrafego.toLocaleString("pt-PT")}</td>
              <td className="px-5 py-3 text-right mono font-bold" style={{ color: "#3A86FF" }}>{totalLeads}</td>
              <td className="px-5 py-3 text-right mono font-bold" style={{ color: "#10B981" }}>{totalTxConv}%</td>
              {showCpl && <td />}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
