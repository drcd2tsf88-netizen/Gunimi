"use client";

export default function OrbitLoader() {
  return (
    <div
      className="
        flex
        min-h-screen

        flex-col
        items-center
        justify-center

        bg-[#050816]

        text-white
      "
    >
      <div
        className="
          h-16
          w-16

          animate-spin

          rounded-full

          border-2
          border-violet-500/20

          border-t-violet-400
        "
      />

      <p
        className="
          mt-10

          text-lg
          text-white/70
        "
      >
        Initializing Orbit AI...
      </p>

      <p
        className="
          mt-3

          text-sm
          text-white/40
        "
      >
        Synchronizing workspace cognition systems
      </p>
    </div>
  );
}