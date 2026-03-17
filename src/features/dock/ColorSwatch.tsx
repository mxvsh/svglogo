import { useRef } from "react";

interface ColorSwatchProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="h-8 w-8 rounded-full border-2 border-white/20 shadow-md transition hover:scale-110 hover:border-white/40"
        style={{ background: value }}
        title={value}
      />
      <input
        ref={ref}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}
