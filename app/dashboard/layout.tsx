import type {
  Metadata,
} from "next";

import DashboardLayoutClient
from "@/components/dashboard/DashboardLayoutClient";

export const metadata:
  Metadata = {
  title:
    "OrbitDesk Dashboard",

  description:
    "OrbitDesk AI Workspace Operating System Dashboard",
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