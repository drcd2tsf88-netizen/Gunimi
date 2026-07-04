"use client";

import Link
from "next/link";

import {
  ArrowUpRight,
  Orbit,
} from "lucide-react";

export default function LandingFooter() {
  const footerLinks = [
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
        "Enterprise",

      href:
        "#enterprise",
    },

    {
      label:
        "Privacy",

      href:
        "/privacy",
    },
  ];

  return (
    <footer
      className="
        relative
        overflow-hidden

        border-t
        border-white/5

        px-6
        py-12
      "
    >
      {/* AMBIENT */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_bottom,rgba(124,58,237,0.08),transparent_55%)]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto

          flex
          max-w-7xl
          flex-col
          gap-10

          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* BRAND */}

        <div
          className="
            max-w-md
          "
        >
          <div
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
              <h3
                className="
                  text-lg
                  font-semibold
                "
              >
                Gunimi
              </h3>

              <p
                className="
                  text-xs
                  text-white/40
                "
              >
                AI Workspace OS
              </p>
            </div>
          </div>

          <p
            className="
              mt-5

              text-sm
              leading-relaxed

              text-white/45
            "
          >
            Autonomous workspace
            operating system powered
            by realtime cognition,
            AI orchestration and
            intelligent execution
            systems.
          </p>
        </div>

        {/* LINKS */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4

            md:justify-end
          "
        >
          {footerLinks.map(
            (item) => {
              const isExternal =
                item.href.startsWith(
                  "#"
                );

              if (
                isExternal
              ) {
                return (
                  <a
                    key={
                      item.label
                    }
                    href={
                      item.href
                    }
                    className="
                      flex
                      items-center
                      gap-2

                      rounded-2xl

                      border
                      border-white/5

                      bg-white/[0.03]

                      px-4
                      py-3

                      text-sm
                      text-white/60

                      transition-all

                      hover:border-white/10
                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                  >
                    {item.label}

                    <ArrowUpRight
                      size={14}
                    />
                  </a>
                );
              }

              return (
                <Link
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                  className="
                    flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-white/5

                    bg-white/[0.03]

                    px-4
                    py-3

                    text-sm
                    text-white/60

                    transition-all

                    hover:border-white/10
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  {item.label}

                  <ArrowUpRight
                    size={14}
                  />
                </Link>
              );
            }
          )}
        </div>
      </div>

      {/* BOTTOM */}

      <div
        className="
          relative
          z-10

          mx-auto
          mt-10

          flex
          max-w-7xl
          flex-col
          gap-4

          border-t
          border-white/5

          pt-6

          text-sm
          text-white/35

          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <p>
          © 2026 Gunimi.
          All rights reserved.
        </p>

        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          <Link
            href="/login"
            className="
              transition-all

              hover:text-white/70
            "
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="
              transition-all

              hover:text-white/70
            "
          >
            Launch Orbit
          </Link>
        </div>
      </div>
    </footer>
  );
}