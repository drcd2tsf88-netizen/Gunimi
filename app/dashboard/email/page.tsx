import { getTranslations } from "next-intl/server";
import EmailCommandCenter from "@/components/email/EmailCommandCenter";
import { getEmailConnections } from "@/server/actions/email/getEmailConnections";
import { getEmailThreads } from "@/server/actions/email/getEmailThreads";

export async function generateMetadata() {
  const t = await getTranslations("email");
  return { title: t("pageTitle") };
}

export default async function EmailPage() {
  const [connections, threads] = await Promise.all([
    getEmailConnections(),
    getEmailThreads(50),
  ]);

  return (
    <div className="px-6 py-8 lg:px-8">
      <EmailCommandCenter threads={threads} connections={connections} />
    </div>
  );
}
