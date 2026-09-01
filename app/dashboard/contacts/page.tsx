import { getTranslations } from "next-intl/server";
import { getCRMContacts } from "@/server/actions/crm/getCRMContacts";
import { getWorkspaceContactTagsMap } from "@/server/actions/crm/getWorkspaceContactTagsMap";
import { getContactsHealthMap } from "@/server/actions/relationships/getContactsHealthMap";
import CRMPageView from "@/components/crm/CRMPageView";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: t("pageTitle") };
}

export default async function CRMPage() {
  const [contacts, contactTagsMap, healthMap] = await Promise.all([
    getCRMContacts(),
    getWorkspaceContactTagsMap(),
    getContactsHealthMap(),
  ]);

  return <CRMPageView initialContacts={contacts} initialContactTagsMap={contactTagsMap} healthMap={healthMap} />;
}
