"use client";

/**
 * 全屏氛围光晕（极低透明度），增强「炫酷」层次而不抢内容。
 */
export function AmbientLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden"
    >
      <div className="absolute -left-[20%] -top-[10%] h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full bg-violet-500/[0.18] blur-[100px] motion-safe:animate-float-a" />
      <div className="absolute -right-[15%] top-[5%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-fuchsia-500/[0.16] blur-[100px] motion-safe:animate-float-b" />
      <div className="absolute bottom-[-20%] left-[20%] h-[min(90vw,560px)] w-[min(90vw,560px)] rounded-full bg-cyan-400/[0.12] blur-[110px] motion-safe:animate-float-c" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.42)_78%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,10,18,0.48)_72%)]" />
    </div>
  );
}
