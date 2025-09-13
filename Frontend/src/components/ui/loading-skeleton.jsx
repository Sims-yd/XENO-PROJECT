export function LoadingSkeleton({ className = "" }) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} />
}

export function StatsCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton className="h-10 w-10 rounded-lg" />
        <LoadingSkeleton className="h-6 w-16" />
      </div>
      <LoadingSkeleton className="h-8 w-20 mb-2" />
      <LoadingSkeleton className="h-4 w-24 mb-1" />
      <LoadingSkeleton className="h-3 w-16" />
    </div>
  )
}

export function CampaignCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton className="h-6 w-6 rounded" />
        <div className="flex-1">
          <LoadingSkeleton className="h-5 w-48 mb-2" />
          <LoadingSkeleton className="h-4 w-32" />
        </div>
        <LoadingSkeleton className="h-6 w-16" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <LoadingSkeleton className="h-3 w-12 mb-1" />
            <LoadingSkeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
