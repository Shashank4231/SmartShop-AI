import EmptyState from "../../ui/EmptyState";
import Loader from "../../ui/Loader";
import Pagination from "../../ui/Pagination";
function DataTable({
  columns,
  data = [],
  loading = false,
  emptyTitle = "No data found",
  emptyDescription = "Nothing to display.",
  pagination,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="p-12">
          <Loader text="Loading data..." />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr
                key={row._id}
                className="group transition duration-200 hover:bg-blue-50/40"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-6 py-5 align-middle text-slate-700"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
          <Pagination
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;