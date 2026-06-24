import CalendarCommandCenter from "@/components/calendar/CalendarCommandCenter";
import { getCalendarConnections } from "@/server/actions/calendar/getCalendarConnections";
import { getCalendarEvents } from "@/server/actions/calendar/getCalendarEvents";
import { getCalendarContacts } from "@/server/actions/calendar/getCalendarContacts";

export default async function CalendarPage() {
  const [connections, events, contacts] = await Promise.all([
    getCalendarConnections(),
    getCalendarEvents(60),
    getCalendarContacts(),
  ]);

  return (
    <div className="px-6 py-8 lg:px-8">
      <CalendarCommandCenter events={events} connections={connections} contacts={contacts} />
    </div>
  );
}
