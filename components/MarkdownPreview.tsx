"use client";

/** 轻量 Markdown 预览（演示用，支持标题/列表/代码块/粗体） */
export function MarkdownPreview({ source }: { source: string }) {
  const lines = source.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      nodes.push(
        <pre
          key={`code-${i}`}
          className="my-2 overflow-x-auto rounded-xl bg-zinc-900 p-3 text-[11px] leading-relaxed text-zinc-100"
        >
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="mt-3 text-sm font-semibold text-zinc-900">
          {inlineFormat(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="mt-3 text-base font-semibold text-zinc-950">
          {inlineFormat(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={i} className="mt-3 text-lg font-bold text-zinc-950">
          {inlineFormat(line.slice(2))}
        </h1>,
      );
    } else if (line.startsWith("- ")) {
      nodes.push(
        <li key={i} className="ml-4 list-disc text-sm text-zinc-700">
          {inlineFormat(line.slice(2))}
        </li>,
      );
    } else if (line.trim() === "") {
      nodes.push(<div key={i} className="h-2" />);
    } else {
      nodes.push(
        <p key={i} className="text-sm leading-relaxed text-zinc-700">
          {inlineFormat(line)}
        </p>,
      );
    }
    i++;
  }
  return <div className="prose-vibe space-y-1">{nodes}</div>;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, idx) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-zinc-900">
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code
          key={idx}
          className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px] text-violet-800"
        >
          {p.slice(1, -1)}
        </code>
      );
    }
    return p;
  });
}
