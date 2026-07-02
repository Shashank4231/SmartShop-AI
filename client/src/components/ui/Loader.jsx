function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
      <p className="text-sm font-semibold text-slate-600">{text}</p>
    </div>
  );
}

export default Loader;