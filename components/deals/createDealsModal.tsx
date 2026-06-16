"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useTranslations,
} from "next-intl";

import toast from "react-hot-toast";

import {
  createDeal,
} from "@/server/actions/deals/createDeal";

import OrbitButton
from "@/components/ui/OrbitButton";

import OrbitInput
from "@/components/ui/OrbitInput";

import OrbitTextarea
from "@/components/ui/OrbitTextarea";

import OrbitField
from "@/components/ui/OrbitField";

import OrbitCard
from "@/components/ui/OrbitCard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  companies: any[];

  contacts: any[];

  onCreated: () => void;
};

export default function CreateDealModal({
  open,
  onOpenChange,
  companies,
  contacts,
  onCreated,
}: Props) {
  const t =
    useTranslations();

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [
    companyId,
    setCompanyId,
  ] = useState("");

  const [
    contactId,
    setContactId,
  ] = useState("");

  const [value, setValue] =
    useState("");

  const [
    probability,
    setProbability,
  ] = useState(25);

  const [
    expectedCloseDate,
    setExpectedCloseDate,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const filteredContacts =
    useMemo(() => {
      if (!companyId) {
        return [];
      }

      return contacts.filter(
        (contact) =>
          contact.company_id ===
          companyId
      );
    }, [
      contacts,
      companyId,
    ]);

  const expectedRevenue =
    (
      Number(value || 0) *
      (probability / 100)
    );

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
    try {
      if (!title.trim()) {
        toast.error(
          t(
            "deals.requiredField"
          )
        );

        return;
      }

      if (
        probability < 0 ||
        probability > 100
      ) {
        toast.error(
          t(
            "deals.invalidProbability"
          )
        );

        return;
      }

      if (
        Number(value) < 0
      ) {
        toast.error(
          t(
            "deals.invalidValue"
          )
        );

        return;
      }

      setLoading(true);

      const deal =
        await createDeal({
          title,

          companyId:
            companyId ||
            undefined,

          contactId:
            contactId ||
            undefined,

          value:
            Number(value) || 0,

          probability,

          description,

          expectedCloseDate:
            expectedCloseDate ||
            undefined,
        });

      if (!deal) {
        toast.error(
          t(
            "deals.failedToCreateOpportunity"
          )
        );

        return;
      }

      toast.success(
        t(
          "deals.opportunityCreated"
        )
      );

      resetForm();

      onCreated();

      onOpenChange(false);

    } catch (error) {
      console.error(error);

      toast.error(
        t(
          "deals.failedToCreateOpportunity"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          handleClose();
          return;
        }

        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "deals.createOpportunity"
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              "deals.commercialPipelineSubtitle"
            )}
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            mt-6
            space-y-5
          "
        >
          <OrbitField
            label={t(
              "deals.opportunityName"
            )}
          >
            <OrbitInput
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />
          </OrbitField>

          <OrbitField
            label={t(
              "deals.company"
            )}
          >
            <Select
              value={companyId}
              onValueChange={(
                value
              ) => {
                setCompanyId(
                  value
                );

                setContactId(
                  ""
                );
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
                {companies.map(
                  (
                    company
                  ) => (
                    <SelectItem
                      key={
                        company.id
                      }
                      value={
                        company.id
                      }
                    >
                      {
                        company.name
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </OrbitField>

          <OrbitField
            label={t(
              "deals.contact"
            )}
          >
            <Select
              disabled={
                !companyId
              }
              value={contactId}
              onValueChange={
                setContactId
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    companyId
                      ? t(
                          "deals.selectContact"
                        )
                      : t(
                          "deals.selectOrganizationFirst"
                        )
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {filteredContacts.map(
                  (
                    contact
                  ) => (
                    <SelectItem
                      key={
                        contact.id
                      }
                      value={
                        contact.id
                      }
                    >
                      {
                        contact.name
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </OrbitField>

          <OrbitField
            label={t(
              "deals.opportunityValue"
            )}
          >
            <OrbitInput
              type="number"
              min="0"
              value={value}
              onChange={(e) =>
                setValue(
                  e.target.value
                )
              }
            />
          </OrbitField>

          <OrbitField
            label={`${t(
              "deals.probability"
            )} (${probability}%)`}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={
                probability
              }
              onChange={(e) =>
                setProbability(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                w-full
              "
            />
          </OrbitField>

          <OrbitCard
            className="
              p-4
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
            >
              {t(
                "deals.expectedRevenue"
              )}
            </p>

            <h3
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              €
              {expectedRevenue.toLocaleString()}
            </h3>
          </OrbitCard>

          <OrbitField
            label={t(
              "deals.expectedCloseDate"
            )}
          >
            <OrbitInput
              type="date"
              value={
                expectedCloseDate
              }
              onChange={(e) =>
                setExpectedCloseDate(
                  e.target.value
                )
              }
            />
          </OrbitField>

          <OrbitField
            label={t(
              "deals.description"
            )}
          >
            <OrbitTextarea
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </OrbitField>
        </div>

        <DialogFooter
          className="
            mt-6
          "
        >
          <OrbitButton
            variant="secondary"
            disabled={loading}
            onClick={
              handleClose
            }
          >
            {t(
              "common.cancel"
            )}
          </OrbitButton>

          <OrbitButton
            loading={loading}
            onClick={
              handleSubmit
            }
          >
            {t(
              "deals.createOpportunity"
            )}
          </OrbitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}