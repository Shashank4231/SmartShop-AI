import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";

import {
  fetchAdminOrderDetails,
  updateAdminOrderStatusThunk,
} from "../../features/adminOrder/adminOrderSlice";

function AdminOrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder, loading, error } = useSelector(
    (state) => state.adminOrder
  );

  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrderDetails(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (selectedOrder?.orderStatus) {
      setStatus(selectedOrder.orderStatus);
    }
  }, [selectedOrder]);

  const handleUpdateStatus = async () => {
    const result = await dispatch(
      updateAdminOrderStatusThunk({ orderId, status })
    );

    if (updateAdminOrderStatusThunk.fulfilled.match(result)) {
      toast.success("Order status updated");
    } else {
      toast.error(result.payload || "Failed to update order status");
    }
  };

  if (loading) return <Loader text="Loading order..." />;

  if (error) {
    return <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</p>;
  }

  if (!selectedOrder) return null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">Order Management</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Order #{selectedOrder._id.slice(-8).toUpperCase()}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Customer Information
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-semibold">
                {selectedOrder.user?.name || "Unknown User"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-semibold">
                {selectedOrder.user?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Order Status</p>
              <div className="mt-2">
                <StatusBadge status={selectedOrder.orderStatus} />
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">Payment Status</p>
              <p className="font-semibold">{selectedOrder.paymentStatus}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Payment Method</p>
              <p className="font-semibold">{selectedOrder.paymentMethod}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{selectedOrder.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Shipping Address
          </h2>

          <div className="space-y-2 text-slate-600">
            <p className="font-semibold text-slate-900">
              {selectedOrder.shippingAddress?.fullName}
            </p>
            <p>{selectedOrder.shippingAddress?.addressLine1}</p>

            {selectedOrder.shippingAddress?.addressLine2 && (
              <p>{selectedOrder.shippingAddress.addressLine2}</p>
            )}

            <p>
              {selectedOrder.shippingAddress?.city},{" "}
              {selectedOrder.shippingAddress?.state} -{" "}
              {selectedOrder.shippingAddress?.postalCode}
            </p>

            <p>{selectedOrder.shippingAddress?.country}</p>
            <p className="pt-2">Phone: {selectedOrder.shippingAddress?.phone}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Ordered Items</h2>

        <div className="space-y-5">
          {selectedOrder.orderItems.map((item) => (
            <div
              key={item.product}
              className="flex items-center justify-between border-b pb-4 last:border-none"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "https://placehold.co/100x100"}
                  alt={item.title}
                  className="h-20 w-20 rounded-xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-900">₹{item.price}</p>
                <p className="text-sm text-slate-500">
                  Total ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Order Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{selectedOrder.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{selectedOrder.shipping}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>-₹{selectedOrder.discount}</span>
          </div>

          <hr />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{selectedOrder.total}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Update Order Status
        </h2>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <Button onClick={handleUpdateStatus} loading={loading}>
            Save Status
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;