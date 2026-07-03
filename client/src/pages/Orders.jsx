import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyOrders } from "../features/order/orderSlice";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";
import StatusBadge from "../components/ui/StatusBadge";

function Orders() {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return <Loader text="Loading orders..." />;
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</p>
      </section>
    );
  }

  if (!orders.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it will appear here."
          actionText="Shop Now"
          actionLink="/products"
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">Purchase History</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-3 text-lg font-bold">₹{order.total}</p>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <StatusBadge status={order.orderStatus} />

                <Link
                  to={`/orders/${order._id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              {order.orderItems?.map((item) => (
                <div key={item.product} className="flex justify-between py-2">
                  <span>{item.title}</span>
                  <span>x {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Orders;