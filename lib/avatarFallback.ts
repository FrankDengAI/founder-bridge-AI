/** Deterministic cartoon-style avatar from user id (no external API). */

export type AvatarStyle = {
  bgFrom: string;
  bgTo: string;
  shape: "circle" | "rounded" | "hex";
  emoji: string;
};

const EMOJIS = ["🦊", "🐼", "🐸", "🦄", "🐙", "🦉", "🐱", "🐶", "🐵", "🐯", "🐰", "🐻"] as const;

const GRADIENTS: { from: string; to: string }[] = [
  { from: "#8b5cf6", to: "#ec4899" },
  { from: "#06b6d4", to: "#3b82f6" },
  { from: "#10b981", to: "#14b8a6" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#6366f1", to: "#a855f7" },
  { from: "#ec4899", to: "#f97316" },
  { from: "#0ea5e9", to: "#6366f1" },
  { from: "#84cc16", to: "#22c55e" },
  { from: "#f43f5e", to: "#fb7185" },
  { from: "#14b8a6", to: "#06b6d4" },
  { from: "#a855f7", to: "#6366f1" },
  { from: "#eab308", to: "#f97316" },
];

const SHAPES: AvatarStyle["shape"][] = ["circle", "rounded", "hex"];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getAvatarStyle(seed: string): AvatarStyle {
  const h = hashString(seed || "anonymous");
  const grad = GRADIENTS[h % GRADIENTS.length]!;
  return {
    bgFrom: grad.from,
    bgTo: grad.to,
    shape: SHAPES[h % SHAPES.length]!,
    emoji: EMOJIS[h % EMOJIS.length]!,
  };
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function shapeClassName(shape: AvatarStyle["shape"]): string {
  if (shape === "hex") return "rounded-[22%]";
  if (shape === "rounded") return "rounded-2xl";
  return "rounded-full";
}
