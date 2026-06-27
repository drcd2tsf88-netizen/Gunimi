import { getCRMContacts } from "@/server/actions/crm/getCRMContacts";
import CRMPageView from "@/components/crm/CRMPageView";

export default async function CRMPage() {
  const contacts = await getCRMContacts();

  return <CRMPageView initialContacts={contacts} />;
}
