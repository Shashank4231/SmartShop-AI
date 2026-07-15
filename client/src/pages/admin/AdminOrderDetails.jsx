import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  IndianRupee,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  Wallet,
} from "lucide-react";

import OrderTimeline from "../../components/admin/orders/OrderTimeline";

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
    if (!status || status === selectedOrder.orderStatus) {
      toast.error("Please select a different order status");
      return;
    }

    const result = await dispatch(
      updateAdminOrderStatusThunk({
        orderId,
        status,
      })
    );

    if (updateAdminOrderStatusThunk.fulfilled.match(result)) {
      toast.success("Order status updated successfully");
    } else {
      toast.error(result.payload || "Failed to update order status");
    }
  };

  if (loading && !selectedOrder) {
    return <Loader text="Loading order details..." />;
  }

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">
        {error}
      </p>
    );
  }

  if (!selectedOrder) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">
          Order Management
        </p>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Order #{selectedOrder._id.slice(-8).toUpperCase()}
            </h1>

            <p className="mt-2 text-slate-500">
              Placed on{" "}
              {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <StatusBadge status={selectedOrder.orderStatus} />
        </div>
      </div>

      {/* Customer + Shipping */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Customer Information
              </h2>

              <p className="text-sm text-slate-500">
                Customer profile and payment details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <User className="shrink-0 text-slate-500" size={20} />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </p>

                <p className="truncate font-semibold text-slate-900">
                  {selectedOrder.user?.name || "Unknown User"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Mail className="shrink-0 text-slate-500" size={20} />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>

                <p className="break-all font-semibold text-slate-900">
                  {selectedOrder.user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Wallet className="shrink-0 text-slate-500" size={20} />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Method
                </p>

                <p className="font-semibold text-slate-900">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="shrink-0 text-slate-500" size={20} />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment Status
                  </p>
                </div>
              </div>

              <StatusBadge status={selectedOrder.paymentStatus} />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <MapPin size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Shipping Address
              </h2>

              <p className="text-sm text-slate-500">
                Delivery location and contact information
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 text-slate-600">
            <p className="text-lg font-bold text-slate-900">
              {selectedOrder.shippingAddress?.fullName}
            </p>

            <div className="mt-4 flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0 text-slate-500" size={19} />

              <div className="space-y-1">
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
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
              <Phone className="shrink-0 text-slate-500" size={19} />

              <p className="font-semibold text-slate-900">
                {selectedOrder.shippingAddress?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
            <Package size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Ordered Items
            </h2>

            <p className="text-sm text-slate-500">
              {selectedOrder.orderItems.length} product item(s)
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {selectedOrder.orderItems.map((item) => (
            <div
              key={item.product}
              className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "https://placehold.co/100x100"}
                  alt={item.title}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                />

                <div>
                  <h3 className="font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Unit price: ₹{item.price}
                  </p>
                </div>
              </div>

              <p className="text-lg font-bold text-slate-900">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Order Summary */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <IndianRupee size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <p className="text-sm text-slate-500">
                Pricing and final payable amount
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-900">
                ₹{selectedOrder.subtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span className="font-semibold text-slate-900">
                {selectedOrder.shipping === 0
                  ? "FREE"
                  : `₹${selectedOrder.shipping}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <span className="font-semibold text-emerald-600">
                -₹{selectedOrder.discount}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-4 text-xl">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-slate-900">
                ₹{selectedOrder.total}
              </span>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Update Order Status
              </h2>

              <p className="text-sm text-slate-500">
                Manage the fulfilment progress
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <Button
              onClick={handleUpdateStatus}
              loading={loading}
              disabled={status === selectedOrder.orderStatus}
              leftIcon={<Truck size={18} />}
              className="w-full"
            >
              Save Status
            </Button>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <OrderTimeline currentStatus={selectedOrder.orderStatus} />
    </div>
  );
}

export default AdminOrderDetails;