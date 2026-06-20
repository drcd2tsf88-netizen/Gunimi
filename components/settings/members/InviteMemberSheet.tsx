"use client";

import { useState, useTransition } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { createWorkspaceInvite } from "@/server/actions/workspace/createWorkspaceInvite";

import OrbitButton from "@/components/ui/OrbitButton";
import OrbitField from "@/components/ui/OrbitField";
import OrbitInput from "@/components/ui/OrbitInput";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited: () => void;
};

export default function InviteMemberSheet({ open, onOpenChange, onInvited }: Props) {
  const t = useTranslations("settings");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setEmail("");
    onOpenChange(false);
  }

  function handleSubmit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error(t("invalidEmail"));
      return;
    }

    startTransition(async () => {
      const result = await createWorkspaceInvite({ email: trimmed });

      if (result) {
        toast.success(t("inviteSent"));
        setEmail("");
        onInvited();
        onOpenChange(false);
      } else {
        toast.error(t("failedToInvite"));
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) handleClose(); else onOpenChange(next); }}>
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle>{t("inviteMember")}</SheetTitle>
          <SheetDescription>{t("inviteByEmailSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-6">
          <OrbitField label={t("emailAddress")}>
            <OrbitInput
              type="email"
              value={email}
              disabled={isPending}
              placeholder={t("emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </OrbitField>
        </div>

        <SheetFooter>
          <OrbitButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {t("cancel")}
          </OrbitButton>
          <OrbitButton loading={isPending} onClick={handleSubmit}>
            {t("sendInvite")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
