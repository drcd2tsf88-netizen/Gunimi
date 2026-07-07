export type PageSkeletonVariant = "list" | "detail" | "settings" | "default";

interface Props {
  variant?: PageSkeletonVariant;
}

export default function PageLoadingSkeleton({
  variant = "default",
}: Props) {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Page header */}
      <div className="space-y-2">
        <div className="h-8 w-52 rounded-[10px] bg-[#0F1520]" />
        <div className="h-4 w-80 rounded-[8px] bg-[#0A0E17]" />
      </div>

      {variant === "list" && (
        <div className="space-y-3">
          {/* Toolbar row */}
          <div className="flex items-center justify-between">
            <div className="h-9 w-64 rounded-[10px] bg-[#0A0E17]" />
            <div className="h-9 w-28 rounded-[10px] bg-[#0A0E17]" />
          </div>
          {/* Rows */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-14 rounded-[14px] bg-[#0A0E17]" />
          ))}
        </div>
      )}

      {variant === "detail" && (
        <>
          {/* Hero card */}
          <div className="h-36 rounded-[22px] bg-[#0A0E17]" />
          {/* Two-column content */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-52 rounded-[18px] bg-[#0A0E17]" />
              <div className="h-40 rounded-[18px] bg-[#0A0E17]" />
            </div>
            <div className="space-y-4">
              <div className="h-40 rounded-[18px] bg-[#0A0E17]" />
              <div className="h-32 rounded-[18px] bg-[#0A0E17]" />
            </div>
          </div>
        </>
      )}

      {variant === "settings" && (
        <div className="space-y-4">
          {/* Section tabs */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-[#0A0E17]" />
            ))}
          </div>
          {/* Settings cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-[18px] bg-[#0A0E17]" />
          ))}
        </div>
      )}

      {variant === "default" && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-[22px] bg-[#0A0E17]" />
          ))}
        </div>
      )}
    </div>
  );
}
