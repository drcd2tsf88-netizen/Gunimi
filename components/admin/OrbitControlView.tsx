"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Crown,
  Shield,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  platform_role: "user" | "beta" | "team" | "admin";
  onboarding_completed: boolean;
  status: string;
  created_at?: string;
};

export default function OrbitControlView({
  initialProfiles,
}: {
  initialProfiles: Profile[];
}) {
  const t = useTranslations("admin");
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);

  async function updateRole(
    id: string,
    role: "user" | "beta" | "team" | "admin"
  ) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, platform_role: role }),
    });

    if (!res.ok) {
      toast.error(t("failedToUpdateRole"));
      return;
    }

    toast.success(t("roleUpdated", { role }));
    void loadProfiles();
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!res.ok) {
      toast.error(t("failedToUpdateStatus"));
      return;
    }

    toast.success(t("statusUpdated", { status }));
    void loadProfiles();
  }

  async function loadProfiles() {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const { profiles: data } = (await res.json()) as { profiles: Profile[] };
    setProfiles(data ?? []);
  }

  const totalUsers = profiles.length;
  const betaUsers = profiles.filter((p) => p.platform_role === "beta").length;
  const admins = profiles.filter((p) => p.platform_role === "admin").length;
  const pendingUsers = profiles.filter((p) => p.platform_role === "user").length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-10 text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-200px] top-[-200px] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[180px]" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[200px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-violet-300">
            <Sparkles size={12} />
            Orbit Internal Systems
          </div>

          <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
                Orbit Control
                <br />
                <span className="bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  Center
                </span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
                Internal operational management layer for Gunimi AI Operating
                System beta access, memberships, platform governance and user
                infrastructure.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200">
                <Activity size={16} />
                Systems Online
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-200">
                <Brain size={16} />
                AI Infrastructure
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <OrbitStatCard title="Platform Users" value={totalUsers} icon={<Users size={20} />} />
          <OrbitStatCard title="Beta Access" value={betaUsers} icon={<CheckCircle2 size={20} />} />
          <OrbitStatCard title="Admins" value={admins} icon={<Crown size={20} />} />
          <OrbitStatCard title="Pending Access" value={pendingUsers} icon={<Shield size={20} />} />
        </div>

        {/* USER TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-14 overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-3xl"
        >
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Platform Users</h2>
              <p className="mt-3 text-sm text-zinc-400">
                Manage beta access, platform permissions, approvals and internal
                Orbit roles.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-500/10 bg-violet-500/5 px-4 py-3 text-sm text-violet-200">
              {profiles.length} Total Profiles
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-sm text-zinc-500">
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Onboarding</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-white/[0.04] transition-all hover:bg-white/[0.02]"
                  >
                    {/* USER */}
                    <td className="px-8 py-6">
                      <div>
                        <div className="font-medium">
                          {profile.full_name ?? "Orbit User"}
                        </div>
                        <div className="mt-2 text-sm text-zinc-500">
                          {profile.email}
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-8 py-6">
                      <div
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                          profile.platform_role === "admin"
                            ? "bg-red-500/10 text-red-300"
                            : profile.platform_role === "team"
                            ? "bg-cyan-500/10 text-cyan-300"
                            : profile.platform_role === "beta"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-white/5 text-zinc-400"
                        }`}
                      >
                        {profile.platform_role}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-8 py-6">
                      <div
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                          profile.status === "active"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-red-500/10 text-red-300"
                        }`}
                      >
                        {profile.status}
                      </div>
                    </td>

                    {/* ONBOARDING */}
                    <td className="px-8 py-6">
                      {profile.onboarding_completed ? (
                        <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
                          <CheckCircle2 size={14} />
                          Completed
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
                          <XCircle size={14} />
                          Pending
                        </div>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateRole(profile.id, "beta")}
                          className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300 transition-all hover:bg-emerald-500/10"
                        >
                          Approve Beta
                        </button>
                        <button
                          onClick={() => updateRole(profile.id, "team")}
                          className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300 transition-all hover:bg-cyan-500/10"
                        >
                          Make Team
                        </button>
                        <button
                          onClick={() => updateRole(profile.id, "admin")}
                          className="rounded-xl border border-red-500/10 bg-red-500/5 px-3 py-2 text-xs text-red-300 transition-all hover:bg-red-500/10"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(
                              profile.id,
                              profile.status === "suspended" ? "active" : "suspended"
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300 transition-all hover:bg-white/[0.06]"
                        >
                          {profile.status === "suspended" ? "Unsuspend" : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-10 flex items-center justify-between rounded-[28px] border border-white/[0.06] bg-white/[0.03] p-6 text-sm text-zinc-500">
          <div>Gunimi AI Operating System governance infrastructure.</div>
          <div className="flex items-center gap-2 text-violet-300">
            Internal Platform Layer
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </main>
  );
}

function OrbitStatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-3xl">
      <div className="absolute right-[-40px] top-[-40px] h-[120px] w-[120px] rounded-full bg-violet-500/5 blur-3xl" />
      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/10 bg-violet-500/5 text-violet-300">
          {icon}
        </div>
        <div className="mt-6 text-4xl font-semibold">{value}</div>
        <div className="mt-2 text-sm text-zinc-500">{title}</div>
      </div>
    </div>
  );
}
