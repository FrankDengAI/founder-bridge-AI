#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
仅启动「电脑网页端」code_demo_web（Next.js 品牌站，无数据库）。
本文件所在目录即项目根（code_demo_web），在资源管理器中进入本文件夹后双击运行本脚本，
或在终端执行：python main.py

与仓库根目录 main.py 的区别：
  - 根目录 main.py 默认启动 code_demo（旧版独立 App 壳）
  - 本脚本启动当前目录的 Next 应用（品牌 + App 已合并；见下方端口说明）

用法：
  python main.py
  python main.py --port 3000
  python main.py --no-auto-port
  python main.py --skip-setup

默认监听 3001（可用 -p 或环境变量 PORT 修改）。本仓库已合并 App 与品牌站为同一 Next 应用：
/login 内嵌的 /welcome/login 与当前站点同源，无需另起「壳端」、一般也无需设置 NEXT_PUBLIC_MINIAPP_URL。
若你仍用旧版「网页 + 独立壳」双进程本地演示，请把壳端与网页错开端口，并在 .env.local 中设置 NEXT_PUBLIC_MINIAPP_URL 指向壳端 origin。
"""

from __future__ import annotations

import argparse
import os
import shutil
import socket
import subprocess
import sys
from pathlib import Path
from typing import Optional


def _wrap_cmd_for_os(argv: list[str]) -> list[str]:
    if sys.platform != "win32" or len(argv) < 1:
        return argv
    head = Path(argv[0]).name.lower()
    if head in ("npm", "npx"):
        return ["cmd", "/c", argv[0], *argv[1:]]
    return argv


def project_dir() -> Path:
    d = Path(__file__).resolve().parent
    if not (d / "package.json").is_file():
        print(f"错误：未在 {d} 找到 package.json", file=sys.stderr)
        sys.exit(1)
    return d


def run(cmd: list[str], cwd: Path, env: Optional[dict[str, str]] = None) -> None:
    print(f"\n> {' '.join(cmd)}\n", flush=True)
    merged = os.environ.copy()
    if env:
        merged.update(env)
    r = subprocess.run(_wrap_cmd_for_os(cmd), cwd=str(cwd), env=merged, shell=False)
    if r.returncode != 0:
        sys.exit(r.returncode)


def _default_port_from_env() -> int:
    """首选端口：环境变量 PORT（合法整数）优先于内置默认 3001；非法或空则 3001。"""
    raw = (os.environ.get("PORT") or "").strip()
    if not raw:
        return 3001
    try:
        return int(raw)
    except ValueError:
        return 3001


def _can_bind_port(port: int) -> bool:
    try:
        with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            except (AttributeError, OSError):
                pass
            s.bind(("::", port))
        return True
    except (OSError, AttributeError):
        pass
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind(("0.0.0.0", port))
        return True
    except OSError:
        return False


def _resolve_listen_port(preferred: int, auto: bool, max_scan: int = 30) -> int:
    if _can_bind_port(preferred):
        return preferred
    if not auto:
        print(
            f"错误：端口 {preferred} 已被占用。请换端口，例如：\n"
            f"  python main.py --port {preferred + 1}",
            file=sys.stderr,
        )
        sys.exit(1)
    for p in range(preferred + 1, preferred + max_scan):
        if _can_bind_port(p):
            print(f"提示：端口 {preferred} 已被占用，已自动改用 {p}。", flush=True)
            return p
    print(
        f"错误：在 {preferred}～{preferred + max_scan - 1} 内未找到空闲端口。",
        file=sys.stderr,
    )
    sys.exit(1)


def ensure_npm() -> None:
    if not (shutil.which("npm") or shutil.which("npm.cmd")):
        print("错误：未在 PATH 中找到 npm，请先安装 Node.js 18+。", file=sys.stderr)
        sys.exit(1)


def maybe_first_time_setup(cwd: Path, skip: bool) -> None:
    if skip:
        return
    if (cwd / "node_modules").is_dir():
        return
    print("[首次] 未检测到 node_modules，正在安装网页端依赖…", flush=True)
    run(["npm", "install"], cwd=cwd)


def main() -> None:
    parser = argparse.ArgumentParser(description="启动 VibeCoding 电脑网页端（code_demo_web）")
    parser.add_argument(
        "--port",
        "-p",
        type=int,
        default=_default_port_from_env(),
        help="监听端口（-p 优先于环境变量 PORT；二者都未设或 PORT 非法时默认 3001）",
    )
    parser.add_argument(
        "--no-auto-port",
        action="store_true",
        help="端口被占用时直接退出，不自动换端口",
    )
    parser.add_argument(
        "--skip-setup",
        action="store_true",
        help="跳过首次 npm install（仍执行 npm run dev）",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="启动前删除 .next 缓存（修复 Cannot find module './xxxx.js' 等开发缓存损坏）",
    )
    args = parser.parse_args()

    ensure_npm()
    cwd = project_dir()
    maybe_first_time_setup(cwd, skip=args.skip_setup)
    port = _resolve_listen_port(args.port, auto=not args.no_auto_port)

    dev_script = "dev:clean" if args.clean else "dev"
    if args.clean:
        print("[清理] 将先删除 .next 再启动开发服务器…", flush=True)

    print("\n【网页端】在电脑浏览器打开: http://localhost:%d" % port, flush=True)
    print(
        "（品牌站 + App 已同仓：/login 内嵌本站 /welcome/login；仅双进程旧演示时才需 NEXT_PUBLIC_MINIAPP_URL）",
        flush=True,
    )
    print("（手机壳/App 数据演示请在仓库根目录运行 python main.py）\n", flush=True)

    run(["npm", "run", dev_script, "--", "-p", str(port)], cwd=cwd)


if __name__ == "__main__":
    main()
