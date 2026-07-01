"use client";

import {
  useMemo,
  useState,
} from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { updateDeal } from "@/server/actions/deals/updateDeal";
import { deleteDeal } from "@/server/actions/deals/deleteDeal";

import OrbitButton from "@/components/ui/OrbitButton";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitTextarea from "@/components/ui/OrbitTextarea";
import OrbitField from "@/components/ui/OrbitField";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Deal } from "@/types/deal";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

type Props = {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  contacts: Contact[];
  onUpdated: () => void;
  onDeleted: () => void;
};

export default function EditDealSheet({
  deal,
  open,
  onOpenChange,
  companies,
  contacts,
  onUpdated,
  onDeleted,
}: Props) {
  const t = useTranslations();

  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState(deal.title);
  const [companyId, setCompanyId] = useState(deal.company?.id ?? "");
  const [contactId, setContactId] = useState(deal.contact?.id ?? "");
  const [value, setValue] = useState(String(deal.value ?? ""));
  const [probability, setProbability] = useState(deal.probability ?? 25);
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    deal.expected_close_date
      ? new Date(deal.expected_close_date).toISOString().split("T")[0]
      : ""
  );
  const [description, setDescription] = useState(deal.description ?? "");

  const filteredContacts = useMemo(() => {
    if (!companyId) return contacts;
    return contacts.filter((c) => c.company_id === companyId);
  }, [contacts, companyId]);

  const expectedRevenue = Number(value || 0) * (probability / 100);

  async function handleSave() {
    if (!title.trim()) {
      toast.error(t("deals.requiredField"));
      return;
    }

    if (probability < 0 || probability > 100) {
      toast.error(t("deals.invalidProbability"));
      return;
    }

    if (Number(value) < 0) {
      toast.error(t("deals.invalidValue"));
      return;
    }

    try {
      setLoading(true);
      toast.loading(t("deals.saving"), { id: "orbit-deal-save" });

      const result = await updateDeal({
        dealId: deal.id,
        title,
        companyId: companyId || undefined,
        contactId: contactId || undefined,
        value: Number(value) || 0,
        probability,
        description,
        expectedCloseDate: expectedCloseDate || undefined,
      });

      if (!result) {
        toast.error(t("deals.failedToUpdate"), { id: "orbit-deal-save" });
        return;
      }

      toast.success(t("deals.opportunityUpdated"), { id: "orbit-deal-save" });
      onOpenChange(false);
      onUpdated();
    } catch {
      toast.error(t("deals.failedToUpdate"), { id: "orbit-deal-save" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      toast.loading(t("deals.deleting"), { id: "orbit-deal-delete" });

      const ok = await deleteDeal(deal.id);

      if (!ok) {
        toast.error(t("deals.failedToDelete"), { id: "orbit-deal-delete" });
        return;
      }

      toast.success(t("deals.opportunityDeleted"), { id: "orbit-deal-delete" });
      setDeleteOpen(false);
      onOpenChange(false);
      onDeleted();
    } catch {
      toast.error(t("deals.failedToDelete"), { id: "orbit-deal-delete" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("deals.editOpportunity")}</SheetTitle>
            <SheetDescription>
              {t("deals.editOpportunitySubtitle")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-y-5 sm:grid-cols-2 sm:gap-x-6">
              {/* LEFT COLUMN */}

              <div className="space-y-5">
                <OrbitField label={t("deals.opportunityName")}>
                  <OrbitInput
                    value={title}
                    disabled={loading}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </OrbitField>

                <OrbitField label={t("deals.company")}>
                  <Select
                    value={companyId}
                    onValueChange={(val) => {
                      setCompanyId(val);
                      setContactId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("deals.selectOrganization")}
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OrbitField>

                <OrbitField label={t("deals.contact")}>
                  <Select
                    value={contactId}
                    onValueChange={setContactId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("deals.selectContact")}
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {filteredContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </OrbitField>

                <OrbitField label={t("deals.description")}>
                  <OrbitTextarea
                    value={description}
                    disabled={loading}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </OrbitField>
              </div>

              {/* RIGHT COLUMN */}

              <div className="space-y-5">
                <OrbitField label={t("deals.opportunityValue")}>
                  <OrbitInput
                    type="number"
                    min="0"
                    value={value}
                    disabled={loading}
                    placeholder="0"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </OrbitField>

                <OrbitField
                  label={`${t("deals.probability")} — ${probability}%`}
                >
                  <div className="space-y-2 pt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={probability}
                      disabled={loading}
                      onChange={(e) =>
                        setProbability(Number(e.target.value))
                      }
                      className="w-full accent-violet-500"
                    />

                    <div className="flex justify-between text-[10px] text-zinc-600">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </OrbitField>

                {/* EXPECTED REVENUE */}

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {t("deals.expectedRevenue")}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    €{Math.round(expectedRevenue).toLocaleString()}
                  </p>
                </div>

                <OrbitField label={t("deals.expectedCloseDate")}>
                  <OrbitInput
                    type="date"
                    value={expectedCloseDate}
                    disabled={loading}
                    onChange={(e) => setExpectedCloseDate(e.target.value)}
                  />
                </OrbitField>
              </div>
            </div>
          </div>

          <SheetFooter>
            <OrbitButton
              variant="danger"
              disabled={loading}
              onClick={() => setDeleteOpen(true)}
            >
              {t("deals.deleteOpportunity")}
            </OrbitButton>

            <div className="flex-1" />

            <OrbitButton
              variant="secondary"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </OrbitButton>

            <OrbitButton loading={loading} onClick={handleSave}>
              {t("common.save")}
            </OrbitButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* DELETE CONFIRMATION */}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deals.deleteOpportunity")}</DialogTitle>

            <DialogDescription>
              {t("deals.deleteConfirm")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <OrbitButton
              variant="secondary"
              disabled={deleting}
              onClick={() => setDeleteOpen(false)}
            >
              {t("common.cancel")}
            </OrbitButton>

            <OrbitButton
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
            >
              {t("deals.deleteOpportunity")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
