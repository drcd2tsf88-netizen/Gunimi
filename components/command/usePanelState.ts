"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { createTask } from "@/server/actions/tasks/createTask";
import { createContact } from "@/server/actions/crm/createContact";
import { createCompany } from "@/server/actions/company/createCompanies";
import { createDeal } from "@/server/actions/deals/createDeal";
import type { ContactExtra } from "@/components/command/panels/CreateContactPanel";
import type { CompanyExtra } from "@/components/command/panels/CreateCompanyPanel";
import type { DealExtra } from "@/components/command/panels/CreateDealPanel";
import type { PanelId } from "@/lib/commands/panels";

interface UsePanelStateOptions {
  query: string;
  activePanel: PanelId | null;
  setActivePanel: (panel: PanelId | null) => void;
  setOpen: (open: boolean) => void;
  clearSearchResults: () => void;
}

export function usePanelState({
  query,
  activePanel,
  setActivePanel,
  setOpen,
  clearSearchResults,
}: UsePanelStateOptions) {
  const t = useTranslations("command");
  const [panelError, setPanelError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Keyed by PanelId — stores secondary field values between panel open/close
  // cycles within the same palette session. Cleared on full palette close.
  const panelDraftsRef = useRef<Partial<Record<PanelId, Record<string, string>>>>({});

  function openPanel(panel: PanelId) {
    if (activePanel === panel) return;
    setActivePanel(panel);
    setPanelError(null);
    // query is intentionally NOT cleared — it becomes the entity name draft
    clearSearchResults();
  }

  function saveDraft(panel: PanelId, draft: Record<string, string>) {
    panelDraftsRef.current = { ...panelDraftsRef.current, [panel]: draft };
  }

  function resetPanel() {
    setPanelError(null);
    setIsExecuting(false);
    panelDraftsRef.current = {};
  }

  async function runPanelAction<T>(
    fn: () => Promise<T | null>,
    successMessage: string,
    errorMessage: string
  ): Promise<void> {
    if (isExecuting) return;
    setIsExecuting(true);
    setPanelError(null);
    try {
      const result = await fn();
      if (!result) {
        setPanelError(errorMessage);
        setIsExecuting(false);
        return;
      }
      toast.success(successMessage);
      setOpen(false);
    } catch {
      setPanelError(errorMessage);
      setIsExecuting(false);
    }
  }

  async function handleCreateTask() {
    const title = query.trim();
    if (!title) return;
    await runPanelAction(
      () => createTask({ title }),
      t("createTaskSuccess"),
      t("createTaskError")
    );
  }

  async function handleCreateContact(extra: ContactExtra) {
    const name = query.trim();
    if (!name) return;
    await runPanelAction(
      () => createContact({
        name,
        email: extra.email || undefined,
        phone: extra.phone || undefined,
      }),
      t("createContactSuccess"),
      t("createContactError")
    );
  }

  async function handleCreateCompany(extra: CompanyExtra) {
    const name = query.trim();
    if (!name) return;
    await runPanelAction(
      () => createCompany({
        name,
        industry: extra.industry || undefined,
        notes: extra.notes || undefined,
      }),
      t("createCompanySuccess"),
      t("createCompanyError")
    );
  }

  async function handleCreateDeal(extra: DealExtra) {
    const title = query.trim();
    if (!title) return;
    const numericValue = parseFloat(extra.value.replace(/[^0-9.]/g, ""));
    await runPanelAction(
      () => createDeal({
        title,
        value: isNaN(numericValue) ? 0 : Math.max(0, numericValue),
        description: extra.notes || undefined,
      }),
      t("createDealSuccess"),
      t("createDealError")
    );
  }

  return {
    panelError,
    setPanelError,
    isExecuting,
    openPanel,
    saveDraft,
    resetPanel,
    panelDraftsRef,
    handleCreateTask,
    handleCreateContact,
    handleCreateCompany,
    handleCreateDeal,
  };
}
