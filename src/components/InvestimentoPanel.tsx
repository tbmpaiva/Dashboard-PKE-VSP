"use client";

interface Props {
  totalInvestimento: number;
  totalMeta: number;
  totalGoogle: number;
  cplGlobal: number;
  totalLeads: number;
}

function fmt(n: number): string {
  return n.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InvestimentoPanel({
  totalInvestimento, totalMeta, totalGoogle, cplGlobal, totalLeads,
}: Props) {
  const hasData = totalInvestimento > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl px-5 py-4 flex items-center gap-3"
        style={{ border: "1px solid #1E3D6B", background: "#0F2240" }}>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#3A6090" }} />
        <p className="text-xs" style={{ color: "#3A6090" }}>
          Dados de investimento não disponíveis para o período seleccionado.
        </p>
      </div>
    );
  }

  const pctMeta   = totalInvestimento > 0 ? (totalMeta   / totalInvestimento) * 100 : 0;
  const pctGoogle = totalInvestimento > 0 ? (totalGoogle / totalInvestimento) * 100 : 0;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1E3D6B", background: "#0F2240" }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #1E3D6B" }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
          Investimento e CPL
        </h3>
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Investimento total */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
            Investimento Total
          </span>
          <span className="mono text-2xl font-bold" style={{ color: "#E8F1FF" }}>
            {fmt(totalInvestimento)}€
          </span>
          <div className="text-xs" style={{ color: "#7A9CC4" }}>Google + Meta</div>
        </div>

        {/* CPL global */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
            CPL Global
          </span>
          <span className="mono text-2xl font-bold" style={{ color: "#F59E0B" }}>
            {fmt(cplGlobal)}€
          </span>
          <div className="text-xs" style={{ color: "#7A9CC4" }}>
            Por lead ({totalLeads} leads)
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
            Meta
          </span>
          <span className="mono text-2xl font-bold" style={{ color: "#3A86FF" }}>
            {fmt(totalMeta)}€
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs" style={{ color: "#7A9CC4" }}>
              <span>{pctMeta.toFixed(0)}% do total</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1E3D6B" }}>
              <div className="h-full rounded-full" style={{ width: `${pctMeta}%`, background: "#3A86FF" }} />
            </div>
          </div>
        </div>

        {/* Google */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
            Google Ads
          </span>
          <span className="mono text-2xl font-bold" style={{ color: "#10B981" }}>
            {fmt(totalGoogle)}€
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs" style={{ color: "#7A9CC4" }}>
              <span>{pctGoogle.toFixed(0)}% do total</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1E3D6B" }}>
              <div className="h-full rounded-full" style={{ width: `${pctGoogle}%`, background: "#10B981" }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
