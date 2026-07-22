import GunimiSkeleton from "@/components/ui/GunimiSkeleton";

export default function AdminAILoading() {
  return (
    <div className="space-y-6 p-6">
      <GunimiSkeleton className="h-8 w-48" />
      <GunimiSkeleton className="h-4 w-96" />
      <div className="grid gap-4 sm:grid-cols-3">
        <GunimiSkeleton className="h-24" />
        <GunimiSkeleton className="h-24" />
        <GunimiSkeleton className="h-24" />
      </div>
      <GunimiSkeleton className="h-64" />
    </div>
  );
}
