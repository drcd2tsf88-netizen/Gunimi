import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";

import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitButton from "@/components/ui/OrbitButton";

import EmailConnectionCard from "@/components/email/EmailConnectionCard";
import EmailThreadList from "@/components/email/EmailThreadList";

import { getEmailConnections } from "@/server/actions/email/getEmailConnections";
import { getEmailThreads } from "@/server/actions/email/getEmailThreads";

export default async function EmailPage() {
  const t = await getTranslations("email");

  const [connections, threads] = await Promise.all([
    getEmailConnections(),
    getEmailThreads(50),
  ]);

  const hasConnection = connections.length > 0;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <OrbitSection>
        <div className="flex items-start justify-between gap-4">
          <OrbitHeading
            badge={t("badge")}
            title={t("title")}
            subtitle={t("subtitle")}
          />

          {hasConnection && (
            <a href="/api/email/connect/gmail" className="shrink-0 mt-1">
              <OrbitButton variant="secondary" className="gap-2 text-sm">
                <Mail size={14} />
                {t("addEmail")}
              </OrbitButton>
            </a>
          )}
        </div>
      </OrbitSection>

      {/* CONNECTION */}
      <OrbitSection>
        <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          {t("connectionStatus")}
        </p>
        <EmailConnectionCard connections={connections} />
      </OrbitSection>

      {/* THREADS */}
      {hasConnection && (
        <OrbitSection>
          <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            {t("recentThreads")}
          </p>
          <EmailThreadList threads={threads} />
        </OrbitSection>
      )}
    </div>
  );
}
