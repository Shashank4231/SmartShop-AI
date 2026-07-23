import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  cancelUserOrder,
  fetchOrderDetails,
} from "../features/order/orderSlice";

import useRazorpayPayment from "../hooks/useRazorpayPayment";

import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import StatusBadge from "../components/ui/StatusBadge";
import ConfirmationModal from "../components/ui/ConfirmationModal";

function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const [showCancelModal, setShowCancelModal] = useState(false);

  const { selectedOrder: order, loading, error } = useSelector(
    (state) => state.order
  );

  const {
    startRazorpayPayment,
    paymentLoading,
    paymentVerifying,
  } = useRazorpayPayment();

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    const result = await dispatch(cancelUserOrder(orderId));

    if (cancelUserOrder.fulfilled.match(result)) {
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
    } else {
      toast.error(result.payload || "Failed to cancel order");
    }
  };

  const handleRetryPayment = async () => {
    if (!order) {
      toast.error("Order details are unavailable");
      return;
    }

    if (order.paymentStatus === "Paid") {
      toast.error("This order has already been paid");
      return;
    }

    if (order.orderStatus === "Cancelled") {
      toast.error("Cancelled orders cannot be paid");
      return;
    }

    await startRazorpayPayment({
      order,
      address: order.shippingAddress,

      onSuccess: async () => {
        toast.success("Payment completed successfully");

        await dispatch(fetchOrderDetails(orderId));
      },

      onDismiss: () => {
        toast.error("Payment was not completed");
      },
    });
  };

  if (loading && !order) {
    return <Loader text="Loading order details..." />;
  }

  if (error && !order) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = ["Pending", "Confirmed"].includes(order.orderStatus);

  const canRetryPayment =
    order.paymentMethod === "RAZORPAY" &&
    order.paymentStatus !== "Paid" &&
    order.orderStatus !== "Cancelled";

  const paymentProcessing = paymentLoading || paymentVerifying;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Order Details
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>

          <p className="mt-2 text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-xl font-bold text-slate-900">
              Shipping Address
            </h3>

            <div className="mt-4 text-slate-600">
              <p className="font-semibold text-slate-900">
                {order.shippingAddress?.fullName}
              </p>

              <p>{order.shippingAddress?.addressLine1}</p>

              {order.shippingAddress?.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}

              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode}
              </p>

              <p>{order.shippingAddress?.country}</p>

              <p className="mt-2">
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Payment Information
                </h3>

                <div className="mt-4 space-y-2 text-slate-600">
                  <p>
                    Method:{" "}
                    <span className="font-semibold text-slate-900">
                      {order.paymentMethod}
                    </span>
                  </p>

                  <p>
                    Payment Status:{" "}
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : order.paymentStatus === "Failed"
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {canRetryPayment && (
                <Button
                  onClick={handleRetryPayment}
                  disabled={paymentProcessing}
                  className="w-full sm:w-auto"
                >
                  {paymentVerifying
                    ? "Verifying Payment..."
                    : paymentLoading
                      ? "Opening Payment..."
                      : "Retry Payment"}
                </Button>
              )}
            </div>

            {canRetryPayment && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-semibold text-amber-800">
                  Payment is incomplete
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  Your order has been created, but payment has not been
                  completed. You can safely retry without creating another
                  order.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-xl font-bold text-slate-900">
              Order Items
            </h3>

            <div className="mt-5 space-y-5">
              {order.orderItems.map((item) => (
                <div
                  key={item.product}
                  className="flex flex-col gap-4 border-b pb-5 last:border-b-0 md:flex-row md:items-center"
                >
                  <img
                    src={item.image || "https://placehold.co/200x150"}
                    alt={item.title}
                    className="h-28 w-full rounded-xl object-cover md:w-32"
                  />

                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Price: ₹{item.price}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-slate-900">
            Order Summary
          </h3>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold">₹{order.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>

              <span className="font-semibold">
                {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Discount</span>
              <span className="font-semibold">₹{order.discount}</span>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{order.total}</span>
            </div>
          </div>

          {canRetryPayment && (
            <Button
              onClick={handleRetryPayment}
              disabled={paymentProcessing}
              className="mt-6 w-full"
            >
              {paymentVerifying
                ? "Verifying Payment..."
                : paymentLoading
                  ? "Opening Payment..."
                  : `Pay ₹${order.total}`}
            </Button>
          )}

          {canCancel && (
            <Button
              variant="danger"
              onClick={() => setShowCancelModal(true)}
              disabled={paymentProcessing}
              className={`${canRetryPayment ? "mt-3" : "mt-6"} w-full`}
            >
              Cancel Order
            </Button>
          )}

          <Link to="/orders" className="mt-4 block text-center">
            <Button variant="outline" className="w-full">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        loading={loading}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
      />
    </section>
  );
}

export default OrderDetails;