import { getTranslations } from "next-intl/server";
import CalendarCommandCenter from "@/components/calendar/CalendarCommandCenter";
import { getCalendarConnections } from "@/server/actions/calendar/getCalendarConnections";
import { getCalendarEvents } from "@/server/actions/calendar/getCalendarEvents";
import { getCalendarContacts } from "@/server/actions/calendar/getCalendarContacts";
import { getWorkspaceCalendarItems } from "@/server/actions/calendar/getWorkspaceCalendarItems";

export async function generateMetadata() {
  const t = await getTranslations("calendar");
  return { title: t("pageTitle") };
}

export default async function CalendarPage() {
  const [connections, events, contacts, workspaceItems] = await Promise.all([
    getCalendarConnections(),
    getCalendarEvents(60),
    getCalendarContacts(),
    getWorkspaceCalendarItems(30),
  ]);

  return (
    <div className="px-6 py-8 lg:px-8">
      <CalendarCommandCenter
        events={events}
        connections={connections}
        contacts={contacts}
        workspaceItems={workspaceItems}
      />
    </div>
  );
}
