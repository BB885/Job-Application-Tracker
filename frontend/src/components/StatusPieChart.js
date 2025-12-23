import React, { useState } from "react";

const COLORS = {
  Applied: "#111827",
  Interview: "#eab308",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export default function StatusPieChart({ counts, size = 110, chartId = "status-pie" }) {
  const [tooltip, setTooltip] = useState(null);

  const order = ["Applied", "Interview", "Offer", "Rejected"];
  const total = order.reduce((sum, k) => sum + (counts?.[k] || 0), 0);

  if (!total) {
    return (
      <div style={{ width: size, height: size, display: "grid", placeItems: "center", color: "var(--muted)" }}>
        No data
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  let angle = 0;
  const slices = order.map((k) => {
    const value = counts[k] || 0;
    const pct = (value / total) * 100;
    const sweep = (value / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { k, value, pct, start, end, color: COLORS[k] };
  });

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg id={chartId} width={size} height={size}>
        {slices
          .filter((s) => s.value > 0)
          .map((s) => (
            <path
              key={s.k}
              d={arcPath(cx, cy, r, s.start, s.end)}
              fill={s.color}
              onMouseMove={(e) =>
                setTooltip({
                  label: s.k,
                  value: s.value,
                  pct: s.pct,
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
          ))}

        {/* donut hole */}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--panel)" />
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "6px 10px",
            fontSize: 12,
            boxShadow: "var(--shadow)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <strong>{tooltip.label}</strong>
          <div>
            {tooltip.value} ({tooltip.pct.toFixed(1)}%)
          </div>
        </div>
      )}
    </div>
  );
}
