"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex">

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-0 z-50 h-screen w-72
            border-r border-zinc-800 bg-zinc-950 p-6
            transition-transform duration-300

            ${mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"}

            lg:translate-x-0
          `}
        >

          {/* Logo */}
          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                OrbitDesk
              </h1>

              <p className="mt-2 text-zinc-500">
                AI Business OS
              </p>

            </div>

            {/* Close Mobile */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden"
            >
              ✕
            </button>

          </div>

          {/* Navigation */}
          <nav className="mt-10 space-y-3">

            <Link
              href="/dashboard"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/crm"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              CRM
            </Link>

            <Link
              href="/dashboard/tasks"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Tasks
            </Link>

            <Link
              href="/dashboard/ai"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              AI Assistant
            </Link>

            <Link
              href="/dashboard/analytics"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Analytics
            </Link>

            <Link
              href="/dashboard/automations"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Automations
            </Link>

            <Link
              href="/dashboard/settings"
              className="block rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Settings
            </Link>

          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-10 w-full rounded-lg border border-zinc-700 p-3 transition hover:bg-zinc-800"
          >
            Logout
          </button>

        </aside>

        {/* Main Content */}
        <section className="flex-1 lg:ml-72">

          {/* Mobile Topbar */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800 bg-black/80 p-4 backdrop-blur lg:hidden">

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2"
            >
              ☰
            </button>

            <h1 className="text-xl font-bold">
              OrbitDesk
            </h1>

            <div />

          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-10">
            {children}
          </div>

        </section>

      </div>

    </main>
  );
}