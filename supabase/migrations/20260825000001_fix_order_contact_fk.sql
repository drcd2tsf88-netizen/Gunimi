-- Fix order contact_id FK: workspace_members → workspace_contacts
-- An order's contact is a customer contact (workspace_contacts), not an internal workspace member.
-- ADR-002: workspace_contacts is the correct compatibility bridge until workspace_people exists.

alter table workspace_orders
  drop constraint if exists workspace_orders_contact_id_fkey;

alter table workspace_orders
  add constraint workspace_orders_contact_id_fkey
    foreign key (contact_id) references workspace_contacts(id) on delete set null;
