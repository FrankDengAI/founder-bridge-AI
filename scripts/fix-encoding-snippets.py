# -*- coding: utf-8 -*-
from pathlib import Path

root = Path(__file__).resolve().parents[1]

(root / "lib" / "session.ts").write_text(
    '''import "server-only";
import { getUserIdFromSession } from "@/lib/auth/sessionStore";

/** \u4ece\u7b7e\u540d Session Cookie \u89e3\u6790\u5f53\u524d\u7528\u6237 id\uff0c\u672a\u767b\u5f55\u8fd4\u56de null\u3002 */
export async function getUserIdFromCookies(): Promise<string | null> {
  return getUserIdFromSession();
}
''',
    encoding="utf-8",
)

posts = root / "app" / "api" / "posts" / "route.ts"
t = posts.read_text(encoding="utf-8")
t = t.replace(
    "/** ???id ????????????????????????????????????????????? */",
    "/** \u6309 id \u5217\u8868\u67e5\u8be2\u65f6\u7981\u7528 orderBy\uff0c\u4fdd\u6301\u8bf7\u6c42\u987a\u5e8f */",
)
t = t.replace(
    '{ error: "???????????????20 ????" }',
    '{ error: "\u6807\u9898\u4e0d\u80fd\u4e3a\u7a7a\uff0c\u957f\u5ea6 1\u2013120 \u5b57" }',
)
posts.write_text(t, encoding="utf-8")
print("fixed session.ts and posts/route.ts")
