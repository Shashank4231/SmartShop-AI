import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardCard from "../../components/admin/DashboardCard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import { fetchDashboardStats } from "../../features/admin/adminSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">Admin Overview</p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue || 0}`}
          icon="💰"
        />

        <DashboardCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon="🛒"
        />

        <DashboardCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon="📦"
        />

        <DashboardCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
        />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>

        <div className="mt-5 space-y-4">
          {stats?.recentOrders?.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {order.user?.name || "Unknown User"} · ₹{order.total}
                  </p>
                </div>

                <StatusBadge status={order.orderStatus} />
              </div>
            ))
          ) : (
            <p className="text-slate-500">No recent orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;