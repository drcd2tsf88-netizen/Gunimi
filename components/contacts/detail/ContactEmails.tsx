"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import EmailThreadCompactList from "@/components/email/EmailThreadCompactList";

import type { EmailThread } from "@/types/email";

type Props = {
  threads: EmailThread[];
};

export default function ContactEmails({ threads }: Props) {
  const t = useTranslations("contacts");

  return (
    <GunimiSection>
      <GunimiHeading
        badge={t("emailsBadge")}
        title={t("emails")}
        subtitle={t("emailsSubtitle")}
      />

      {threads.length === 0 ? (
        <GunimiEmptyState
          title={t("noEmails")}
          description={t("noEmailsDescription")}
          icon={Mail}
        />
      ) : (
        <div className="mt-6">
          <GunimiCard className="overflow-hidden p-0">
            <EmailThreadCompactList threads={threads} showCompany />
          </GunimiCard>
        </div>
      )}
    </GunimiSection>
  );
}
