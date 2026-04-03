import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton, TableSkeleton } from ".";

const RiskOverviewSkeleton = () => {
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
};

export default RiskOverviewSkeleton;
