"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import EmailThreadCompactList from "@/components/email/EmailThreadCompactList";

import type { EmailThread } from "@/types/email";

type Props = {
  threads: EmailThread[];
};

export default function CompanyEmails({ threads }: Props) {
  const t = useTranslations("companies");

  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {t("emailsTitle")}
      </p>

      {threads.length === 0 ? (
        <GunimiEmptyState
          title={t("noEmails")}
          description={t("noEmailsDescription")}
          icon={Mail}
        />
      ) : (
        <GunimiCard className="overflow-hidden p-0">
          <EmailThreadCompactList threads={threads} showContact compact />
        </GunimiCard>
      )}
    </div>
  );
}
