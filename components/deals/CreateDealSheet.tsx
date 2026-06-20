"use client";

import {
  useMemo,
  useState,
} from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { createDeal } from "@/server/actions/deals/createDeal";

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

import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  contacts: Contact[];
  onCreated: () => void;
};

export default function CreateDealSheet({
  open,
  onOpenChange,
  companies,
  contacts,
  onCreated,
}: Props) {
  const t = useTranslations();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [value, setValue] = useState("");
  const [probability, setProbability] = useState(25);
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [description, setDescription] = useState("");

  const filteredContacts = useMemo(() => {
    if (!companyId) return [];
    return contacts.filter((c) => c.company_id === companyId);
  }, [contacts, companyId]);

  const expectedRevenue =
    Number(value || 0) * (probability / 100);

  function resetForm() {
    setTitle("");
    setCompanyId("");
    setContactId("");
    setValue("");
    setProbability(25);
    setExpectedCloseDate("");
    setDescription("");
  }

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  async function handleSubmit() {
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

      const deal = await createDeal({
        title,
        companyId: companyId || undefined,
        contactId: contactId || undefined,
        value: Number(value) || 0,
        probability,
        description,
        expectedCloseDate: expectedCloseDate || undefined,
      });

      if (!deal) {
        toast.error(t("deals.failedToCreateOpportunity"));
        return;
      }

      toast.success(t("deals.opportunityCreated"));
      resetForm();
      onCreated();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(t("deals.failedToCreateOpportunity"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
        else onOpenChange(next);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {t("deals.createOpportunity")}
          </SheetTitle>

          <SheetDescription>
            {t("deals.commercialPipelineSubtitle")}
          </SheetDescription>
        </SheetHeader>

        {/* FORM */}

        <div
          className="
            flex-1

            overflow-y-auto

            px-6
            py-6
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-x-6
              gap-y-5
            "
          >
            {/* LEFT COLUMN */}

            <div className="space-y-5">
              <OrbitField
                label={t("deals.opportunityName")}
              >
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
                      placeholder={t(
                        "deals.selectOrganization"
                      )}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </OrbitField>

              <OrbitField label={t("deals.contact")}>
                <Select
                  disabled={!companyId}
                  value={contactId}
                  onValueChange={setContactId}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        companyId
                          ? t("deals.selectContact")
                          : t(
                              "deals.selectOrganizationFirst"
                            )
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {filteredContacts.map((contact) => (
                      <SelectItem
                        key={contact.id}
                        value={contact.id}
                      >
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
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </OrbitField>
            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-5">
              <OrbitField
                label={t("deals.opportunityValue")}
              >
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

                  <div
                    className="
                      flex
                      justify-between

                      text-[10px]
                      text-zinc-600
                    "
                  >
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </OrbitField>

              {/* EXPECTED REVENUE */}

              <div
                className="
                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.02]

                  p-4
                "
              >
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.18em]

                    text-zinc-500
                  "
                >
                  {t("deals.expectedRevenue")}
                </p>

                <p
                  className="
                    mt-2

                    text-2xl
                    font-semibold
                    text-white
                  "
                >
                  €{Math.round(expectedRevenue).toLocaleString()}
                </p>
              </div>

              <OrbitField
                label={t("deals.expectedCloseDate")}
              >
                <OrbitInput
                  type="date"
                  value={expectedCloseDate}
                  disabled={loading}
                  onChange={(e) =>
                    setExpectedCloseDate(e.target.value)
                  }
                />
              </OrbitField>
            </div>
          </div>
        </div>

        <SheetFooter>
          <OrbitButton
            variant="secondary"
            disabled={loading}
            onClick={handleClose}
          >
            {t("common.cancel")}
          </OrbitButton>

          <OrbitButton
            loading={loading}
            onClick={handleSubmit}
          >
            {t("deals.createOpportunity")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
