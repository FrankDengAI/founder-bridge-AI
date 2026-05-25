"use client";

import { useEffect } from "react";
import { completeMission, pushRecentView } from "@/lib/retention";

export function RecordRecentView({
  postId,
  title,
  postType,
}: {
  postId: string;
  title: string;
  postType?: string;
}) {
  useEffect(() => {
    pushRecentView({ postId, title, at: Date.now() });
    if (postType === "RECRUIT") completeMission("browse_recruit");
  }, [postId, title, postType]);
  return null;
}
