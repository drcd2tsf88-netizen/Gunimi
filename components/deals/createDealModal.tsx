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
  ] = useState("25");

  const [
    expectedCloseDate,
    setExpectedCloseDate,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const filteredContacts =
    useMemo(() => {
      if (!companyId) {
        return contacts;
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

  function resetForm() {
    setTitle("");

    setCompanyId("");

    setContactId("");

    setValue("");

    setProbability("25");

    setExpectedCloseDate("");

    setDescription("");
  }

  async function handleSubmit() {
    try {
      if (!title.trim()) {
        toast.error(
          t(
            "deals.opportunityName"
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

          probability:
            Number(
              probability
            ) || 25,

          description,

          expectedCloseDate:
            expectedCloseDate ||
            undefined,
        });

      if (!deal) {
        toast.error(
          "Failed to create opportunity"
        );

        return;
      }

      toast.success(
        t(
          "deals.createOpportunity"
        )
      );

      resetForm();

      onCreated();

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create opportunity"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
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
            mt-4

            space-y-4
          "
        >
          <OrbitInput
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder={t(
              "deals.opportunityName"
            )}
          />

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

          <Select
            value={contactId}
            onValueChange={
              setContactId
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "deals.selectContact"
                )}
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

          <OrbitInput
            type="number"
            min="0"
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value
              )
            }
            placeholder={t(
              "deals.opportunityValue"
            )}
          />

          <OrbitInput
            type="number"
            min="0"
            max="100"
            value={
              probability
            }
            onChange={(e) =>
              setProbability(
                e.target.value
              )
            }
            placeholder={t(
              "deals.probability"
            )}
          />

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

          <OrbitTextarea
            value={
              description
            }
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder={t(
              "deals.description"
            )}
          />
        </div>

        <DialogFooter
          className="
            mt-6
          "
        >
          <OrbitButton
            variant="secondary"
            onClick={() =>
              onOpenChange(
                false
              )
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