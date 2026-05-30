import { CheckCircle2, GitBranch, Shield, Users } from "lucide-react";
import { GitHubDemoActions } from "@/components/GitHubDemoActions";
import { PageHeader } from "@/components/PageHeader";

export default function GitHubConnectPage() {
  return (
    <div className="space-y-4 pb-10">
      <PageHeader
        title="绑定 GitHub"
        subtitle="关联你的代码仓库，在项目与协作页展示贡献记录，方便伙伴了解你的技术背景。"
        backHref="/home"
      />

      <section className="glass-panel rounded-3xl p-4 shadow-soft ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-950">绑定后可以做什么</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-zinc-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                在个人主页展示 GitHub 昵称与公开仓库
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                项目协作页同步代码贡献，让伙伴一眼看到你的交付能力
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                仅读取公开信息，可随时在设置中解除绑定
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-4 shadow-sm ring-1 ring-white/70">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-zinc-950">隐私与安全</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-700">
              我们不会访问你的私有仓库与密码。授权范围仅限公开资料，解除绑定后相关展示会立即移除。
            </p>
          </div>
        </div>
      </section>

      <GitHubDemoActions />

      <div className="glass-panel flex items-start gap-3 rounded-3xl p-4 text-xs text-zinc-700 shadow-sm ring-1 ring-white/70">
        <Users className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
        <p>
          绑定 GitHub 能让匹配到的伙伴更快建立信任——代码贡献是最直观的「能力名片」。完成绑定后，记得在项目页更新你的协作状态。
        </p>
      </div>
    </div>
  );
}
