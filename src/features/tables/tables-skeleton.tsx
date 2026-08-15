import { Skeleton } from "@/components/ui/skeleton";

export function TableCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-[#bccac0]/20 bg-white p-4 space-y-3 shadow-2xs">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="pt-2 border-t border-[#bccac0]/20 space-y-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TablesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <TableCardSkeleton key={i} />
      ))}
    </div>
  );
}
