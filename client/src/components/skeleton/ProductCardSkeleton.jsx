function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow">
      <div className="h-56 w-full bg-slate-200" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-32 rounded bg-slate-200" />

        <div className="flex items-center justify-between">
          <div className="h-7 w-24 rounded bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>

        <div className="h-11 w-full rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;