"use client";

import { PeriodOption } from "@/lib/sheets";

interface Props {
  options: PeriodOption[];
  selected: string;
  onChange: (value: string) => void;
  isWeekly: boolean;
}

export default function PeriodSelector({ options, selected, onChange, isWeekly }: Props) {
  if (options.length <= 1) return null; // sem opções para filtrar

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "#7A9CC4" }}>
        {isWeekly ? "Semana" : "Mês"}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: isActive ? "#1D57A0" : "#132C52",
                color: isActive ? "#E8F1FF" : "#7A9CC4",
                border: `1px solid ${isActive ? "#3A86FF" : "#1E3D6B"}`,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
