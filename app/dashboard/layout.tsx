import type {
  Metadata,
} from "next";

import DashboardLayoutClient
from "@/components/dashboard/DashboardLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s — Gunimi",
  },
  description: "Gunimi AI Workspace Operating System — manage relationships, knowledge, and communication.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}