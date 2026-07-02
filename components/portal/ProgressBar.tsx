"use client";

import { useEffect, useState } from "react";

export function ProgressBar({
  percent,
  label = "Completion",
}: {
  percent: number;
  label?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-light tracking-[0.2em] uppercase text-ash">
          {label}
        </p>
        <p className="font-display text-xl font-semibold text-ink">
          {percent}%
        </p>
      </div>
      <div className="w-full h-px bg-rule relative">
        <div
          className="h-px bg-clay absolute top-0 left-0 transition-all duration-700"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
