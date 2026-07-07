"use client";

import { useState, useTransition } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { createWorkspaceInvite } from "@/server/actions/workspace/createWorkspaceInvite";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiField from "@/components/ui/GunimiField";
import GunimiInput from "@/components/ui/GunimiInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [role, setRole] = useState<"admin" | "member">("member");
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setEmail("");
    setRole("member");
    onOpenChange(false);
  }

  function handleSubmit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error(t("invalidEmail"));
      return;
    }

    startTransition(async () => {
      const result = await createWorkspaceInvite({ email: trimmed, role });

      if (result.ok) {
        toast.success(t("inviteSent"));
        setEmail("");
        setRole("member");
        onInvited();
        onOpenChange(false);
      } else {
        if (result.error === "already_invited") {
          toast.error(t("alreadyInvited"));
        } else if (result.error === "already_member") {
          toast.error(t("alreadyMember"));
        } else if (result.error === "forbidden") {
          toast.error(t("forbidden"));
        } else {
          toast.error(t("failedToInvite"));
        }
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

        <div className="flex-1 px-6 py-6 space-y-4">
          <GunimiField label={t("emailAddress")}>
            <GunimiInput
              type="email"
              value={email}
              disabled={isPending}
              placeholder={t("emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </GunimiField>

          <GunimiField label={t("inviteRole")}>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "admin" | "member")}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">{t("roleMember")}</SelectItem>
                <SelectItem value="admin">{t("roleAdmin")}</SelectItem>
              </SelectContent>
            </Select>
          </GunimiField>
        </div>

        <SheetFooter>
          <GunimiButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {t("cancel")}
          </GunimiButton>
          <GunimiButton loading={isPending} onClick={handleSubmit}>
            {t("sendInvite")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
