export type CalendarConnection = {
  id: string;
  provider: "google" | "microsoft";
  provider_account_email: string | null;
  connected_at: string;
  last_synced_at: string | null;
};

export type CalendarEventRow = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  organizer_email: string | null;
  organizer_name: string | null;
  location: string | null;
  html_link: string | null;
  status: "confirmed" | "tentative" | "cancelled";
  all_day: boolean;
};
