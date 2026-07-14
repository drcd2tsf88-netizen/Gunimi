import {
  useState,
} from "react";

import * as Dialog
from "@radix-ui/react-dialog";

import toast
from "react-hot-toast";

import GunimiCard
from "@/components/ui/GunimiCard";

import GunimiInput
from "@/components/ui/GunimiInput";

import GunimiTextarea
from "@/components/ui/GunimiTextarea";

import { createCompany }
from "@/server/actions/company/createCompanies";

import { useTranslations }
from "next-intl";

type Props = {
  open: boolean;

  onClose: () => void;
};

export default function CreateOrganizationModal({
  open,
  onClose,
}: Props) {
  const t =
    useTranslations();

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    name,
    setName,
  ] = useState("");

  const [
    website,
    setWebsite,
  ] = useState("");

  const [
    industry,
    setIndustry,
  ] = useState("");

  const [
    country,
    setCountry,
  ] = useState("");

  const [
    annualValue,
    setAnnualValue,
  ] = useState("");

  const [
    notes,
    setNotes,
  ] = useState("");

  async function handleCreate() {
    if (!name.trim()) {
      return;
    }

    try {
      setCreating(true);

      const company =
        await createCompany({
          name,

          website,

          industry,

          country,

          annualValue:
            Number(
              annualValue
            ) || 0,

          notes,
        });

      if (!company) {
        toast.error(
          "Failed to create organization"
        );

        return;
      }

      toast.success(
        "Organization created"
      );

      setName("");
      setWebsite("");
      setIndustry("");
      setCountry("");
      setAnnualValue("");
      setNotes("");

      onClose();
    } catch {
      toast.error(
        "Failed to create organization"
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={
        onClose
      }
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed
            inset-0
            z-dialog

            bg-black/60
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed
            z-dialog

            left-1/2
            top-1/2

            w-full
            max-w-2xl

            -translate-x-1/2
            -translate-y-1/2
          "
        >
          <GunimiCard
            className="
              p-6
            "
          >
            <Dialog.Title
              className="
                text-xl
                font-semibold
              "
            >
              {t(
                "companies.createOrganization"
              )}
            </Dialog.Title>

            <div
              className="
                mt-6

                grid
                gap-4
              "
            >
              <GunimiInput
                placeholder={t(
                  "companies.organizationName"
                )}
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />

              <GunimiInput
                placeholder={t(
                  "companies.website"
                )}
                value={website}
                onChange={(e) =>
                  setWebsite(
                    e.target.value
                  )
                }
              />

              <div
                className="
                  grid
                  gap-4

                  md:grid-cols-2
                "
              >
                <GunimiInput
                  placeholder={t(
                    "companies.industry"
                  )}
                  value={industry}
                  onChange={(e) =>
                    setIndustry(
                      e.target.value
                    )
                  }
                />

                <GunimiInput
                  placeholder={t(
                    "companies.country"
                  )}
                  value={country}
                  onChange={(e) =>
                    setCountry(
                      e.target.value
                    )
                  }
                />
              </div>

              <GunimiInput
                type="number"
                placeholder={t(
                  "companies.annualValue"
                )}
                value={
                  annualValue
                }
                onChange={(e) =>
                  setAnnualValue(
                    e.target.value
                  )
                }
              />

              <GunimiTextarea
                placeholder={t(
                  "companies.notes"
                )}
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
              />

              <div
                className="
                  flex
                  justify-end
                  gap-3
                "
              >
                <button
                  onClick={
                    onClose
                  }
                  className="
                    rounded-xl

                    border
                    border-white/10

                    px-4
                    py-2
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleCreate
                  }
                  disabled={
                    creating
                  }
                  className="
                    rounded-xl

                    border
                    border-violet-500/20

                    bg-violet-500/10

                    px-4
                    py-2

                    text-violet-200
                  "
                >
                  {creating
                    ? t(
                        "companies.creating"
                      )
                    : t(
                        "companies.create"
                      )}
                </button>
              </div>
            </div>
          </GunimiCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}