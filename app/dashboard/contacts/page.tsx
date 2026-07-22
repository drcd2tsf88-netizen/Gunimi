import { getTranslations } from "next-intl/server";
import { getCRMContacts } from "@/server/actions/crm/getCRMContacts";
import CRMPageView from "@/components/crm/CRMPageView";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: t("pageTitle") };
}

export default async function CRMPage() {
  const contacts = await getCRMContacts();

  return <CRMPageView initialContacts={contacts} />;
}
