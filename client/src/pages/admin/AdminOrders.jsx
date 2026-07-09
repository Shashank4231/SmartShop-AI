import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";

import { fetchAdminOrders } from "../../features/adminOrder/adminOrderSlice";

function AdminOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.adminOrder);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders({ search, status }));
  }, [dispatch, search, status]);

  const columns = [
    {
      key: "order",
      label: "Order",
      render: (order) => `#${order._id.slice(-8).toUpperCase()}`,
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) => order.user?.name || "Unknown User",
    },
    {
      key: "email",
      label: "Email",
      render: (order) => order.user?.email || "N/A",
    },
    {
      key: "total",
      label: "Total",
      render: (order) => `₹${order.total}`,
    },
    {
      key: "status",
      label: "Status",
      render: (order) => <StatusBadge status={order.orderStatus} />,
    },
    {
      key: "payment",
      label: "Payment",
      render: (order) => order.paymentStatus,
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <Link to={`/admin/orders/${order._id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Order Management
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Orders
        </h1>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4 rounded-2xl bg-white p-4 shadow md:grid-cols-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, or email..."
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle="No orders found"
        emptyDescription="Orders will appear here after customers place them."
      />
    </div>
  );
}

export default AdminOrders;