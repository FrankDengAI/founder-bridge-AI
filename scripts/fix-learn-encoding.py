# -*- coding: utf-8 -*-
"""Rewrite learn page strings with correct UTF-8."""
from pathlib import Path
import re

p = Path(__file__).resolve().parents[1] / "app" / "(shell)" / "(tabs)" / "learn" / "page.tsx"
t = p.read_text(encoding="utf-8")

STEPS = '''const STEPS = [
  "想法生成",
  "需求拆解",
  "提示词编写",
  "代码生成",
  "页面设计",
  "GitHub 管理",
  "部署上线",
  "用户反馈",
] as const;'''

t = re.sub(r"const STEPS = \[.*?\] as const;", STEPS, t, count=1, flags=re.S)
t = re.sub(
    r'title="[^"]*"',
    'title="学习与项目"',
    t,
    count=1,
)
t = re.sub(
    r'subtitle="[^"]*"',
    'subtitle="把「路线 → 步骤 → 项目 → 发布」串成可点击的闭环；登录后学习进度写入 PostgreSQL，并与成就同步。"',
    t,
    count=1,
)

replacements = {
    "能力扩展区": "能力扩展区",
    "将学习输出沉淀为笔记与项目卡片，再在「匹配」里寻找互补角色，形成闭环。": "将学习输出沉淀为笔记与项目卡片，再在「匹配」里寻找互补角色，形成闭环。",
    "打开工作台": "打开工作台",
    "去匹配": "去匹配",
    "工具导航": "工具导航",
    "Vibe Coding 学习路线": "Vibe Coding 学习路线",
    "每一步都可进入详情页，内含行动清单与扩展建议。": "每一步都可进入详情页，内含行动清单与扩展建议。",
    "绑定 GitHub（演示）": "绑定 GitHub（演示）",
    "发布学习笔记": "发布学习笔记",
    "我的项目展示": "我的项目展示",
    "打开产品预览": "打开产品预览",
    "演示账号暂无项目记录。请先运行": "演示账号暂无项目记录。请先运行",
    "打开仓库": "打开仓库",
    "打开预览": "打开预览",
    "App 内嵌预览": "App 内嵌预览",
}

# Replace common mojibake blocks by rewriting whole file from code_demo with utf-8 read after fixing source
demo = Path(__file__).resolve().parents[2] / "code_demo" / "app" / "(tabs)" / "learn" / "page.tsx"
if demo.exists():
    base = demo.read_text(encoding="utf-8")
    base = base.replace("const uid = getUserIdFromCookies();", "const uid = await getUserIdFromCookies();")
    base = base.replace(
        "登录后学习进度写入 SQLite，并与成就同步。",
        "登录后学习进度写入 PostgreSQL，并与成就同步。",
    )
    p.write_text(base, encoding="utf-8")
    print("rewrote learn from code_demo utf-8")
else:
    p.write_text(t, encoding="utf-8")
    print("patched learn strings in place")
