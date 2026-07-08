import EmptyState from "../ui/EmptyState";
import Loader from "../ui/Loader";
import Pagination from "../ui/Pagination";

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
      <div className="rounded-2xl bg-white p-12 shadow">
        <Loader text="Loading..." />
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-6 py-4 font-bold text-slate-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row._id}
                className="border-t transition hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-6 py-4"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="border-t bg-white px-6 py-4">
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