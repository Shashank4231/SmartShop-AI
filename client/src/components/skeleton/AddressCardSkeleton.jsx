function AddressCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow">
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-44 rounded bg-slate-200" />
      </div>

      <div className="mt-5 flex gap-3">
        <div className="h-9 w-16 rounded-xl bg-slate-200" />
        <div className="h-9 w-24 rounded-xl bg-slate-200" />
        <div className="h-9 w-20 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export default AddressCardSkeleton;