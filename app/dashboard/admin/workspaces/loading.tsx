export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-8 w-64 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-4 w-96 animate-pulse rounded bg-white/[0.04]" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-white/[0.03]" />
    </div>
  );
}
