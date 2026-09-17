import { getFounderMetrics } from "@/server/actions/founder/getFounderMetrics";
import FounderDashboard from "./FounderDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FounderPage() {
  const metrics = await getFounderMetrics();
  return <FounderDashboard metrics={metrics} />;
}
