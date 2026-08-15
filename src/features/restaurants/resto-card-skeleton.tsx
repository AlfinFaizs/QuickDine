import { Skeleton } from "@/components/ui/skeleton";

export function RestoCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#bccac0]/30 bg-white overflow-hidden shadow-2xs space-y-4">
      {/* Image Skeleton */}
      <Skeleton className="h-44 w-full rounded-none" />

      <div className="p-4 space-y-3">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description / Address */}
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />

        {/* Table status badge bar */}
        <div className="pt-2 border-t border-[#bccac0]/20 flex items-center justify-between">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function JelajahGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search & Filter Bar Skeletons */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-2xl" />
        <div className="flex gap-2 overflow-hidden justify-center py-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RestoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
