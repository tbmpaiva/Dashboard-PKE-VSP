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
          <strong style={{ color: "#A8C4E0" }}>Investimento por VSP (Google, Meta, Total):</strong> gasto real de cada plataforma atribuído directamente a cada VSP, importado das sheets. Total = Google + Meta.
        </p>
        <p>
          <strong style={{ color: "#A8C4E0" }}>CPL real por VSP:</strong> Investimento Total da VSP (Google + Meta) / Leads da VSP. Ao contrário do CPL Global, este valor usa custo real discriminado por VSP, por isso é um custo por lead exacto e não uma aproximação. VSPs sem leads mostram "-", já que a divisão não é definida.
        </p>
      </div>
    </div>
  );
}
