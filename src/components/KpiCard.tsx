"use client";

interface KpiCardProps {
  label: string;
  value: string;
  subLabel?: string;
  trend?: "up" | "down" | "neutral";
  accent?: string;
  icon?: React.ReactNode;
}

export default function KpiCard({ label, value, subLabel, trend, accent, icon }: KpiCardProps) {
  const borderColor =
    trend === "up"
      ? "#10B981"
      : trend === "down"
      ? "#EF4444"
      : accent || "#1D57A0";

  return (
    <div
      className="relative rounded-xl p-5 flex flex-col gap-2 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #132C52 0%, #0F2240 100%)",
        border: "1px solid #1E3D6B",
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      {/* Glow subtil no canto */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: borderColor }}
      />

      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "#7A9CC4" }}
        >
          {label}
        </span>
        {icon && <span style={{ color: borderColor, opacity: 0.8 }}>{icon}</span>}
      </div>

      <div className="mono text-3xl font-bold" style={{ color: "#E8F1FF", letterSpacing: "-0.02em" }}>
        {value}
      </div>

      {subLabel && (
        <div className="text-xs" style={{ color: "#7A9CC4" }}>
          {subLabel}
        </div>
      )}
    </div>
  );
}
