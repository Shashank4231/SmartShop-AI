function OrderCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow">
      <div className="flex justify-between gap-6">
        <div className="space-y-3">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-6 w-24 rounded bg-slate-200" />
        </div>

        <div className="space-y-3">
          <div className="h-7 w-24 rounded-full bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t pt-4">
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default OrderCardSkeleton;