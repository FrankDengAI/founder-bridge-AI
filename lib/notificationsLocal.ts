export const NOTIFS_STORAGE_KEY = "vibe_notifs_v1";

export type LocalNotif = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

const SEED: LocalNotif[] = [
  {
    id: "n1",
    title: "欢迎 aboard",
    body: "试试 ⌘/Ctrl + K 打开命令面板，一秒跳转任意模块。",
    at: "刚刚",
    read: false,
  },
  {
    id: "n2",
    title: "匹配算法已就绪",
    body: "在「匹配」里保存画像即可生成互补推荐与可解释分数。",
    at: "1 分钟前",
    read: false,
  },
  {
    id: "n3",
    title: "工作台上线",
    body: "统计看板 + 本地收藏聚合，适合路演演示真实数据。",
    at: "今天",
    read: false,
  },
  {
    id: "n4",
    title: "热门排序",
    body: "发现页与搜索均支持「热门」按点赞排序浏览。",
    at: "今天",
    read: true,
  },
];

export function loadLocalNotifs(): LocalNotif[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const arr = JSON.parse(raw) as LocalNotif[];
    return Array.isArray(arr) && arr.length ? arr : SEED;
  } catch {
    return SEED;
  }
}

export function saveLocalNotifs(items: LocalNotif[]) {
  localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(items));
}

/** 插入一条未读通知到列表顶部（供评论等客户端事件调用） */
export function prependLocalNotif(item: Omit<LocalNotif, "read"> & { read?: boolean }) {
  if (typeof window === "undefined") return;
  const next: LocalNotif[] = [
    { ...item, read: item.read ?? false },
    ...loadLocalNotifs().filter((n) => n.id !== item.id),
  ].slice(0, 80);
  saveLocalNotifs(next);
  window.dispatchEvent(new Event("vibe-notifs-updated"));
}
