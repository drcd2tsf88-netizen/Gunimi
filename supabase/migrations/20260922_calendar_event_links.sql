-- Link calendar events to workspace entities
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES workspace_people(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deal_id    UUID REFERENCES workspace_deals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES workspace_companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_calendar_events_contact_id ON calendar_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_deal_id    ON calendar_events(deal_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_company_id ON calendar_events(company_id);
