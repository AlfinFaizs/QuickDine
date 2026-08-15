import { Skeleton } from "@/components/ui/skeleton";

export function KdsOrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#bccac0]/30 bg-white p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#bccac0]/20 pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="h-3 w-16 ml-auto" />
          <Skeleton className="h-5 w-20 ml-auto" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 py-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Action button */}
      <div className="border-t border-[#bccac0]/20 pt-3">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function KdsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <KdsOrderCardSkeleton key={i} />
      ))}
    </div>
  );
}
