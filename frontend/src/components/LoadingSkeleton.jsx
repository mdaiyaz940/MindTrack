export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
    </div>
  );
}

export function MoodSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}