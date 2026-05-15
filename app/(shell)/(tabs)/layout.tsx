import { TabsFrame } from "@/components/TabsFrame";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TabsFrame>{children}</TabsFrame>;
}
