import type { Metadata } from "next";
import DesignSystemView from "@/components/design-system/DesignSystemView";

export const metadata: Metadata = {
  title: "Design System — GDL v1.0",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return <DesignSystemView />;
}
