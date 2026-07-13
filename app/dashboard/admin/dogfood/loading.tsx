import GunimiSkeleton from "@/components/ui/GunimiSkeleton";

export default function DogfoodLoading() {
  return (
    <div className="px-6 py-8 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <GunimiSkeleton className="h-3 w-20" />
          <GunimiSkeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GunimiSkeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GunimiSkeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
