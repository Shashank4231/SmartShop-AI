import { ChevronRight } from "lucide-react";


function AdminPageHeader({
  icon,
  title,
  description,
  action,
  breadcrumb = [],
}) {
  return (
    <div className="mb-8">
      {breadcrumb.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          {breadcrumb.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-2"
            >
              <span>{item}</span>

              {index !== breadcrumb.length - 1 && (
                <ChevronRight size={14} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          {icon && (
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              {icon}
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              {title}
            </h1>

            {description && (
              <p className="mt-2 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>
    </div>
  );
}

export default AdminPageHeader;