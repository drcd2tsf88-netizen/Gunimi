export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-white/[0.04]" />
      <div className="h-4 w-96 animate-pulse rounded-xl bg-white/[0.03]" />
      <div className="h-96 animate-pulse rounded-2xl bg-white/[0.02]" />
    </div>
  );
}
