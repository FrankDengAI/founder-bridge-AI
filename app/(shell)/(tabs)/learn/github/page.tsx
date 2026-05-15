import { CheckCircle2, KeyRound, Lock, Shield } from "lucide-react";
import { GitHubDemoActions } from "@/components/GitHubDemoActions";
import { PageHeader } from "@/components/PageHeader";

export default function GitHubConnectPage() {
  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="绑定 GitHub"
        subtitle="演示环境：不会发起真实 OAuth。这里给出可落地的接入清单。"
        backHref="/learn"
      />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-950">你需要准备什么</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-zinc-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                GitHub OAuth App（Callback URL 指向你的后端）
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                服务端用 code 换 token，并绑定到平台用户 id
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                最小权限：读取公开仓库即可（后续再申请私有权限）
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-zinc-950">安全与合规</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-700">
              Token 必须只存服务端；前端仅保存会话。对敏感能力（读私有仓库）做二次确认与可撤销授权。
            </p>
          </div>
        </div>
      </section>

      <GitHubDemoActions />

      <div className="glass-panel flex items-start gap-3 rounded-3xl p-4 text-xs text-zinc-700 shadow-sm ring-1 ring-white/70">
        <Lock className="mt-0.5 h-4 w-4 text-zinc-500" />
        <p>
          真实接入时建议把 GitHub 绑定状态写入数据库（例如{" "}
          <span className="font-mono text-[11px]">User.githubLogin</span>），并在项目页展示同步的仓库列表。
        </p>
      </div>
    </div>
  );
}
