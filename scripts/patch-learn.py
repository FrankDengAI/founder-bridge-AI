# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent / "code_demo" / "app" / "(tabs)" / "learn" / "page.tsx"

def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    text = text.replace("const uid = getUserIdFromCookies();", "const uid = await getUserIdFromCookies();")
    text = text.replace(
        "登录后学习进度写入 SQLite，并与成就同步。",
        "登录后学习进度写入 PostgreSQL，并与成就同步。",
    )
    out = ROOT / "app" / "(shell)" / "(tabs)" / "learn" / "page.tsx"
    out.write_text(text, encoding="utf-8")
    print("wrote", out)


if __name__ == "__main__":
    main()
