import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AddressSelector from "../components/checkout/AddressSelector";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import PaymentMethod from "../components/checkout/PaymentMethod";
import Loader from "../components/ui/Loader";

import { fetchAddresses } from "../features/address/addressSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { placeOrder } from "../features/order/orderSlice";

import useRazorpayPayment from "../hooks/useRazorpayPayment";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    items = [],
    subtotal = 0,
    loading: cartLoading,
  } = useSelector((state) => state.cart);

  const {
    addresses = [],
    loading: addressLoading,
    error: addressError,
  } = useSelector((state) => state.address);

  const { loading: orderLoading } = useSelector(
    (state) => state.order
  );

  const {
    startRazorpayPayment,
    paymentLoading,
    paymentVerifying,
  } = useRazorpayPayment();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAddress || addresses.length === 0) {
      return;
    }

    const defaultAddress = addresses.find(
      (address) => address.isDefault
    );

    setSelectedAddress(
      defaultAddress?._id || addresses[0]?._id || ""
    );
  }, [addresses, selectedAddress]);

  const selectedOrderAddress = useMemo(
    () =>
      addresses.find(
        (address) => address._id === selectedAddress
      ),
    [addresses, selectedAddress]
  );

  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    const result = await dispatch(
      placeOrder({
        addressId: selectedAddress,
        paymentMethod,
      })
    );

    if (!placeOrder.fulfilled.match(result)) {
      toast.error(result.payload || "Failed to place order");
      return;
    }

    const createdOrder = result.payload;

    if (paymentMethod === "RAZORPAY") {
      await startRazorpayPayment({
        order: createdOrder,
        address: selectedOrderAddress,

        onSuccess: async (verifiedOrder) => {
          await dispatch(fetchCart());

          navigate("/order-success", {
            state: {
              order: verifiedOrder,
            },
          });
        },

        onDismiss: () => {
          navigate(`/orders/${createdOrder._id}`);
        },
      });

      return;
    }

    await dispatch(fetchCart());

    toast.success("Order placed successfully");

    navigate("/order-success", {
      state: {
        order: createdOrder,
      },
    });
  };

  const checkoutLoading =
    orderLoading || paymentLoading || paymentVerifying;

  if (cartLoading || addressLoading) {
    return <Loader text="Preparing checkout..." />;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-slate-500">
            Select your delivery address and payment method.
          </p>
        </div>

        {addressError && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-red-600">
            {addressError}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <AddressSelector
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelect={setSelectedAddress}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            paymentMethod={paymentMethod}
            loading={checkoutLoading}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </main>
  );
}

export default Checkout;