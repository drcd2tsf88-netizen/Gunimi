import { getTranslations } from "next-intl/server";
import { getWorkspaceSignals } from "@/server/actions/signals/getWorkspaceSignals";
import SignalsPageView from "@/components/signals/SignalsPageView";

export async function generateMetadata() {
  const t = await getTranslations("signalsPage");
  return { title: t("title") };
}

export default async function SignalsPage() {
  const signals = await getWorkspaceSignals();
  return <SignalsPageView initialSignals={signals} />;
}
