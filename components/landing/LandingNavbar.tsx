"use client";

import Link
from "next/link";

import {
  useState,
} from "react";

import {
  ArrowRight,
  Menu,
  Orbit,
} from "lucide-react";

import LandingMobileNav
from "@/components/landing/LandingMobileNav";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const navItems = [
    {
      label:
        "Observatory",

      href:
        "#observatory",
    },

    {
      label:
        "AI Systems",

      href:
        "#systems",
    },

    {
      label:
        "Workflows",

      href:
        "#workflows",
    },

    {
      label:
        "Enterprise",

      href:
        "#enterprise",
    },
  ];

  return (
    <>
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50

          border-b
          border-white/5

          bg-[#050816]/70

          backdrop-blur-2xl
        "
      >
        <div
          className="
            mx-auto

            flex
            max-w-7xl
            items-center
            justify-between

            px-6
            py-5
          "
        >
          {/* LOGO */}

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11

                items-center
                justify-center

                rounded-2xl

                bg-violet-500/10

                text-violet-300
              "
            >
              <Orbit
                size={20}
              />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                "
              >
                OrbitDesk
              </h2>

              <p
                className="
                  text-xs
                  text-white/40
                "
              >
                AI Workspace OS
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <div
            className="
              hidden
              items-center
              gap-10

              text-sm
              text-white/60

              md:flex
            "
          >
            {navItems.map(
              (item) => (
                <a
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                  className="
                    transition-all

                    hover:text-white
                  "
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* LOGIN */}

           <div className="flex items-center gap-3">

  <Link
    href="/login"
    className="
      orbit-button-secondary
    "
  >
    Login
  </Link>

  <Link
    href="/register"
    className="
      orbit-button
    "
  >
    Launch Orbit
  </Link>

</div>

            {/* MOBILE */}

            <button
              onClick={() =>
                setMobileOpen(
                  true
                )
              }
              className="
                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                border
                border-white/10

                bg-white/[0.03]

                text-white/70

                md:hidden
              "
            >
              <Menu
                size={18}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV */}

      <LandingMobileNav
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />
    </>
  );
}