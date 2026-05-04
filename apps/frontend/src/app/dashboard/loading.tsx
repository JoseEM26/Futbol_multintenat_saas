import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 md:p-0">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-48 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-14 w-40 bg-slate-200 rounded-2xl hidden md:block"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-4">
            <div className="h-1/2 w-full bg-slate-50 rounded-3xl"></div>
            <div className="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
            <div className="h-4 w-1/2 bg-slate-50 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Table/List Skeleton */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 h-96 w-full">
        <div className="h-8 w-48 bg-slate-100 rounded-lg mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-slate-50 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
