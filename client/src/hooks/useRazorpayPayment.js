import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { loadRazorpayScript } from "../utils/loadRazorpay";
import {
  createPaymentOrder,
  verifyPayment,
} from "../features/payment/paymentSlice";

function useRazorpayPayment() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    loading: paymentLoading,
    verifying: paymentVerifying,
  } = useSelector((state) => state.payment);

  const startRazorpayPayment = async ({
    order,
    address,
    onSuccess,
    onDismiss,
  }) => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error(
        "Unable to load Razorpay. Please check your internet connection."
      );
      return false;
    }

    const paymentOrderResult = await dispatch(
      createPaymentOrder(order._id)
    );

    if (!createPaymentOrder.fulfilled.match(paymentOrderResult)) {
      toast.error(
        paymentOrderResult.payload ||
          "Failed to initialise Razorpay payment"
      );
      return false;
    }

    const paymentOrder = paymentOrderResult.payload;

    const options = {
      key: paymentOrder.keyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: "SmartShop AI",
      description: `Payment for order #${order._id
        .slice(-8)
        .toUpperCase()}`,
      order_id: paymentOrder.razorpayOrderId,

      handler: async (response) => {
        const verificationResult = await dispatch(
          verifyPayment({
            orderId: order._id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
        );

        if (verifyPayment.fulfilled.match(verificationResult)) {
          toast.success("Payment completed successfully");

          onSuccess?.(verificationResult.payload);
        } else {
          toast.error(
            verificationResult.payload ||
              "Payment verification failed"
          );
        }
      },

      prefill: {
        name: address?.fullName || user?.name || "",
        email: user?.email || "",
        contact: "",
      },

      notes: {
        mongoOrderId: order._id,
      },

      theme: {
        color: "#0f172a",
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment was not completed");
          onDismiss?.();
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      toast.error(
        response.error?.description ||
          "Payment failed. Please try again."
      );
    });

    razorpay.open();

    return true;
  };

  return {
    startRazorpayPayment,
    paymentLoading,
    paymentVerifying,
  };
}

export default useRazorpayPayment;