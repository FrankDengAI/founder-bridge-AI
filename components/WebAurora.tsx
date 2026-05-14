/** 全屏氛围底图（纯展示，无交互） */
export function WebAurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="web-aurora-spin-inner h-full w-full rounded-full" />
      </div>
      <div className="web-aurora-mesh absolute inset-0 opacity-[0.5]" />
      <div className="web-aurora-noise absolute inset-0 opacity-[0.045]" />
      <div className="web-aurora-vignette absolute inset-0" />
    </div>
  );
}
