export default function Loading() {
  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <div className="h-4 w-16 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-7 w-48 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-4 w-80 animate-pulse rounded-xl bg-white/[0.03]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-white/[0.02]" />
        ))}
      </div>
    </div>
  );
}
