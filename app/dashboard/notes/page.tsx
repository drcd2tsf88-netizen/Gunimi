import { getTranslations } from "next-intl/server";
import { getWorkspaceNotes } from "@/server/actions/notes/getWorkspaceNotes";
import { getTags } from "@/server/actions/tags/getTags";
import { getContacts } from "@/server/actions/crm/getContacts";
import { getCompanies } from "@/server/actions/company/getCompanies";
import NotesClientPage from "@/components/notes/NotesClientPage";

export async function generateMetadata() {
  const t = await getTranslations("notes");
  return { title: t("pageTitle") };
}

export default async function NotesPage() {
  const [notes, tags, contacts, companies] = await Promise.all([
    getWorkspaceNotes(),
    getTags(),
    getContacts(),
    getCompanies(),
  ]);

  return (
    <NotesClientPage
      initialNotes={notes}
      allTags={tags}
      contactOptions={contacts.map((c) => ({ id: c.id, name: c.name }))}
      companyOptions={companies.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
