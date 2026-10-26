import { getTranslations } from "next-intl/server";
import CommunicationsCenter from "@/components/communications/CommunicationsCenter";
import { getEmailConnections } from "@/server/actions/email/getEmailConnections";
import { getCommunicationThreads } from "@/server/actions/communications/getCommunicationThreads";

export async function generateMetadata() {
  const t = await getTranslations("communications");
  return { title: t("pageTitle") };
}

export default async function CommunicationsPage() {
  const [connections, threads] = await Promise.all([
    getEmailConnections(),
    getCommunicationThreads(50),
  ]);

  return (
    <div className="px-6 py-8 lg:px-8">
      <CommunicationsCenter threads={threads} connections={connections} />
    </div>
  );
}
