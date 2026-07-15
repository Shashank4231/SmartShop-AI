import clsx from "clsx";

function InfoCard({
  title,
  description,
  icon,
  action,
  children,
  className = "",
}) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {(title || icon || action) && (
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="rounded-xl bg-slate-100 p-3">
                {icon}
              </div>
            )}

            <div>
              {title && (
                <h2 className="text-xl font-bold text-slate-900">
                  {title}
                </h2>
              )}

              {description && (
                <p className="text-sm text-slate-500">
                  {description}
                </p>
              )}
            </div>
          </div>

          {action}
        </div>
      )}

      {children}
    </div>
  );
}

export default InfoCard;