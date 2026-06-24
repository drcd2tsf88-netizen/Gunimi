"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { User } from "lucide-react";
import { updateUserProfile } from "@/server/actions/profile/updateUserProfile";
import { type UserProfile } from "@/server/actions/profile/getUserProfile";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitField from "@/components/ui/OrbitField";
import OrbitButton from "@/components/ui/OrbitButton";

type Props = {
  profile: UserProfile;
};

function ProfileAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  if (avatarUrl) {
    return (
      <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
        <Image
          src={avatarUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-lg font-semibold text-violet-300">
      {initials}
    </div>
  );
}

export default function ProfileSection({ profile }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const ok = await updateUserProfile({ full_name: fullName });
      if (ok) {
        toast.success(t("profileSaved"));
        router.refresh();
      } else {
        toast.error(t("failedToSaveProfile"));
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("nav_profile")}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold">{t("profileTitle")}</h2>
        <p className="mt-1 text-sm text-white/40">{t("profileSubtitle")}</p>
      </div>

      <OrbitCard className="p-6">
        <div className="flex items-center gap-4">
          <ProfileAvatar name={fullName || profile.email} avatarUrl={profile.avatar_url} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{fullName || profile.email}</p>
            <p className="mt-0.5 text-xs text-white/40">{profile.email}</p>
            <p className="mt-2 text-[10px] text-white/25">{t("profileAvatarSubtitle")}</p>
          </div>
        </div>
      </OrbitCard>

      <OrbitCard className="p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <OrbitField label={t("profileName")}>
            <div className="relative">
              <User
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("profileNamePlaceholder")}
                disabled={isPending}
                className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-sm text-white placeholder:text-white/25 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20 disabled:opacity-50"
              />
            </div>
          </OrbitField>

          <OrbitField label={t("profileEmail")}>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3">
              <span className="flex-1 truncate text-sm text-white/40">{profile.email}</span>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/30">
                {t("readOnly")}
              </span>
            </div>
          </OrbitField>
        </div>

        <div className="mt-6 flex justify-end">
          <OrbitButton onClick={handleSave} loading={isPending} disabled={!fullName.trim()}>
            {isPending ? t("saving") : t("saveChanges")}
          </OrbitButton>
        </div>
      </OrbitCard>
    </div>
  );
}
