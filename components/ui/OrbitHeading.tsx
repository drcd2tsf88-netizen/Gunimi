type OrbitHeadingProps = {
  title: string;

  subtitle?: string;

  badge?: string;
};

export default function OrbitHeading({
  title,

  subtitle,

  badge,
}: OrbitHeadingProps) {
  return (
    <div
      className="
        space-y-3
      "
    >
      {/* BADGE */}

      {badge && (
        <div
          className="
            inline-flex
            items-center

            rounded-full

            border
            border-white/[0.08]

            bg-white/[0.03]

            px-3
            py-1.5

            text-[10px]
            uppercase

            tracking-[0.18em]

            text-violet-300

            backdrop-blur-xl
          "
        >
          {badge}
        </div>
      )}

      {/* CONTENT */}

      <div
        className="
          space-y-2
        "
      >
        <h1
          className="
            text-3xl
            font-semibold

            tracking-tight

            text-white
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="
              max-w-2xl

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}