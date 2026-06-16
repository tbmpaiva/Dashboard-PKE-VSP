"use client";

import { VSP_LIST } from "@/lib/sheets";

interface Props {
  selected: string;
  onChange: (key: string) => void;
}

export default function VspFilter({ selected, onChange }: Props) {
  const options = [
    { key: "all", label: "Todas as VSPs", color: "#7A9CC4" },
    ...VSP_LIST,
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = selected === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background: isActive ? opt.color : "#132C52",
              color: isActive ? "#0D1B2A" : "#A8C4E0",
              border: `1px solid ${isActive ? opt.color : "#1E3D6B"}`,
              fontFamily: isActive ? "Inter" : "inherit",
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
