"use client";

export default function MethodologyNote() {
  return (
    <div className="rounded-xl px-5 py-4 space-y-3"
      style={{ border: "1px solid #1E3D6B", background: "#0F2240" }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
        Metodologia e fórmulas
      </h3>
      <div className="text-xs space-y-2" style={{ color: "#7A9CC4" }}>
        <p>
          <strong style={{ color: "#A8C4E0" }}>Tráfego:</strong> sessões na VSP, reportadas pela ferramenta de analítica.
        </p>
        <p>
          <strong style={{ color: "#A8C4E0" }}>Leads:</strong> submissões de formulário ou contactos gerados por VSP.
        </p>
        <p>
          <strong style={{ color: "#A8C4E0" }}>Tx Conv:</strong> Leads / Tráfego × 100.
        </p>
        <p>
          <strong style={{ color: "#A8C4E0" }}>Investimento Total:</strong> soma de Google Ads e Meta, incluindo sitelinks e outras extensões que não são atribuíveis a uma VSP específica.
        </p>
        <p>
          <strong style={{ color: "#A8C4E0" }}>CPL Global:</strong> Investimento Total / Leads Totais do período. Inclui sitelinks, por isso é sempre igual ou superior ao CPL que resultaria de dividir apenas por ad group.
        </p>
        <p>
          <strong style={{ color: "#A8C4E0" }}>CPL Estimado por VSP:</strong> não temos custo real discriminado por VSP nas plataformas, por isso este valor é uma aproximação. Calcula se um CPC médio da conta (Investimento Total / Tráfego Total), multiplica pelo tráfego de cada VSP para estimar o custo dessa VSP, e divide pelos leads da VSP. Assume que o custo por clique é igual em todas as VSPs, o que não é exacto na prática, serve para comparação relativa, não como valor de facturação.
        </p>
      </div>
    </div>
  );
}
