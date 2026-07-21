export default function AppLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar Mock */}
      <div className="hidden md:flex flex-col w-64 md:sticky md:top-0 md:h-screen md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl animate-shimmer" />
          <div className="space-y-2 flex-1">
            <div className="h-3 rounded w-3/4 animate-shimmer" />
            <div className="h-2 rounded w-1/2 animate-shimmer" />
          </div>
        </div>
        <div className="space-y-4 pt-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-11 rounded-xl animate-shimmer opacity-85" />
          ))}
        </div>
      </div>
      
      {/* Content Area Mock */}
      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-3">
          <div className="h-8 rounded w-1/4 animate-shimmer" />
          <div className="h-4 rounded w-1/3 animate-shimmer" />
        </div>
        
        {/* Stats Grid Mock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-4 rounded w-1/2 animate-shimmer" />
                <div className="h-8 w-8 rounded-lg animate-shimmer" />
              </div>
              <div className="h-6 rounded w-1/3 animate-shimmer" />
            </div>
          ))}
        </div>
        
        {/* Table/Big Card Mock */}
        <div className="h-[400px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div className="h-6 rounded w-1/6 animate-shimmer" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 rounded animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
