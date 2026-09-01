import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { APP_CONFIG } from "@/lib/config/app";
import PitchView from "@/components/pitch/PitchView";

export const metadata: Metadata = {
  title: `Gunimi — ${APP_CONFIG.tagline}`,
  description:
    "Gunimi is an AI-first workspace OS. Contacts, deals, emails, meetings and intelligence — connected in one living system.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Gunimi — The workspace that understands your business.",
    description:
      "Contacts, deals, emails, meetings and intelligence in one living workspace.",
    type: "website",
  },
};

export default async function PitchPage() {
  const t = await getTranslations("pitch");

  const translations = {
    badge: t("badge"),
    nav: {
      prev: t("nav.prev"),
      next: t("nav.next"),
      slideOf: t("nav.slideOf"),
    },
    cta: {
      startFree: t("cta.startFree"),
      requestDemo: t("cta.requestDemo"),
      openWorkspace: t("cta.openWorkspace"),
    },
    slides: {
      hero: {
        label: t("slides.hero.label"),
        title: t("slides.hero.title"),
        subtitle: t("slides.hero.subtitle"),
        hint: t("slides.hero.hint"),
      },
      problem: {
        label: t("slides.problem.label"),
        title: t("slides.problem.title"),
        body: t("slides.problem.body"),
        tools: t.raw("slides.problem.tools") as string[],
        footer: t("slides.problem.footer"),
      },
      solution: {
        label: t("slides.solution.label"),
        title: t("slides.solution.title"),
        body: t("slides.solution.body"),
        chain: t.raw("slides.solution.chain") as string[],
      },
      relationships: {
        label: t("slides.relationships.label"),
        title: t("slides.relationships.title"),
        body: t("slides.relationships.body"),
        tiers: t.raw("slides.relationships.tiers") as { label: string; desc: string }[],
        extras: t.raw("slides.relationships.extras") as string[],
      },
      signals: {
        label: t("slides.signals.label"),
        title: t("slides.signals.title"),
        body: t("slides.signals.body"),
        examples: t.raw("slides.signals.examples") as string[],
        footer: t("slides.signals.footer"),
      },
      email: {
        label: t("slides.email.label"),
        title: t("slides.email.title"),
        body: t("slides.email.body"),
        features: t.raw("slides.email.features") as string[],
        quote: t("slides.email.quote"),
      },
      calendar: {
        label: t("slides.calendar.label"),
        title: t("slides.calendar.title"),
        body: t("slides.calendar.body"),
        features: t.raw("slides.calendar.features") as string[],
        quote: t("slides.calendar.quote"),
      },
      execution: {
        label: t("slides.execution.label"),
        title: t("slides.execution.title"),
        sections: t.raw("slides.execution.sections") as { title: string; points: string[] }[],
      },
      architecture: {
        label: t("slides.architecture.label"),
        title: t("slides.architecture.title"),
        stack: t.raw("slides.architecture.stack") as { layer: string; tech: string }[],
        security: t.raw("slides.architecture.security") as string[],
      },
      pricing: {
        label: t("slides.pricing.label"),
        title: t("slides.pricing.title"),
        subtitle: t("slides.pricing.subtitle"),
        tiers: t.raw("slides.pricing.tiers") as { name: string; price: string; desc: string }[],
        currentOffer: t("slides.pricing.currentOffer"),
        ctaLabel: t("slides.pricing.ctaLabel"),
      },
    },
  };

  return <PitchView t={translations} />;
}
