import type { OrnamentStyle } from "@/lib/types";

export function Ornament({
  style,
  color,
  className = "",
}: {
  style: OrnamentStyle;
  color: string;
  className?: string;
}) {
  if (style === "minimal") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <span className="h-px w-10" style={{ background: color }} />
        <span className="h-1.5 w-1.5 rotate-45" style={{ background: color }} />
        <span className="h-px w-10" style={{ background: color }} />
      </div>
    );
  }

  if (style === "geometric" || style === "art-deco") {
    return (
      <svg viewBox="0 0 180 24" className={className} fill="none">
        <path
          d="M2 12h52l10-8 10 8 10-8 10 8h52"
          stroke={color}
          strokeWidth="1.2"
        />
        <circle cx="90" cy="12" r="3" fill={color} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 36" className={className} fill="none">
      <path
        d="M10 22c18-18 36-18 54 0 18-18 36-18 54 0 18-18 36-18 54 0"
        stroke={color}
        strokeWidth="1.1"
      />
      <circle cx="100" cy="12" r="3.5" fill={color} />
      <path d="M90 28c6-8 14-8 20 0" stroke={color} strokeWidth="1" />
    </svg>
  );
}
