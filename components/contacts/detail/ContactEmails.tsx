"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import EmailThreadCompactList from "@/components/email/EmailThreadCompactList";

import type { EmailThread } from "@/types/email";

type Props = {
  threads: EmailThread[];
};

export default function ContactEmails({ threads }: Props) {
  const t = useTranslations("contacts");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("emailsBadge")}
        title={t("emails")}
        subtitle={t("emailsSubtitle")}
      />

      {threads.length === 0 ? (
        <OrbitEmptyState
          title={t("noEmails")}
          description={t("noEmailsDescription")}
          icon={Mail}
        />
      ) : (
        <div className="mt-6">
          <OrbitCard className="overflow-hidden p-0">
            <EmailThreadCompactList threads={threads} showCompany />
          </OrbitCard>
        </div>
      )}
    </OrbitSection>
  );
}
