import { getTranslations } from "next-intl/server";
import NotesClientPage from "@/components/notes/NotesClientPage";

export async function generateMetadata() {
  const t = await getTranslations("notes");
  return { title: t("pageTitle") };
}

export default function NotesPage() {
  return <NotesClientPage />;
}
