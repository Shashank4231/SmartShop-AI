function StatCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
  subtitle,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`${color} flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;