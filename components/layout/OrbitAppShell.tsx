"use client";

import {
  useState,
} from "react";

import OrbitSidebar
from "./OrbitSidebar";

import OrbitTopbar
from "./OrbitTopbar";

type OrbitAppShellProps = {
  children:
    React.ReactNode;
};

export default function OrbitAppShell({
  children,
}: OrbitAppShellProps) {
  const [
    mobileOpen,

    setMobileOpen,
  ] = useState(false);

  return (
    <div
      className="
        min-h-screen

        bg-[#060816]

        text-white
      "
    >
      {/* SIDEBAR */}

      <OrbitSidebar
        mobileOpen={
          mobileOpen
        }
        setMobileOpen={
          setMobileOpen
        }
      />

      {/* CONTENT */}

      <main
        className="
          min-h-screen

          lg:ml-[88px]
          xl:ml-[240px]
        "
      >
        {/* TOPBAR */}

        <OrbitTopbar
          mobileOpen={
            mobileOpen
          }
          setMobileOpen={
            setMobileOpen
          }
        />

        {/* PAGE */}

        <div
          className="
            mx-auto

            w-full
            max-w-[1600px]

            px-4
            py-4

            sm:px-5
            lg:px-6
            lg:py-5
          "
        >
          {children}
        </div>
      </main>
    </div>
  );
}