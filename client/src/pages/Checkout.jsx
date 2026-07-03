import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AddressSelector from "../components/checkout/AddressSelector";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import PaymentMethod from "../components/checkout/PaymentMethod";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";

import { fetchAddresses } from "../features/address/addressSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { placeOrder } from "../features/order/orderSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses, loading: addressLoading } = useSelector(
    (state) => state.address
  );

  const {
    items,
    subtotal,
    shipping,
    discount,
    total,
    loading: cartLoading,
  } = useSelector((state) => state.cart);

  const { loading: orderLoading } = useSelector((state) => state.order);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault);

    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]._id);
    }
  }, [addresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const result = await dispatch(
      placeOrder({
        addressId: selectedAddress,
        paymentMethod,
      })
    );

    if (placeOrder.fulfilled.match(result)) {
      await dispatch(fetchCart());
      toast.success("Order placed successfully");

      navigate("/order-success", {
        state: {
          order: result.payload,
        },
      });
    } else {
      toast.error(result.payload || "Failed to place order");
    }
  };

  if (addressLoading || cartLoading) {
    return <Loader text="Loading checkout..." />;
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState
          title="Your cart is empty"
          description="Add products to your cart before checkout."
          actionText="Explore Products"
          actionLink="/products"
        />
      </section>
    );
  }

  if (addresses.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState
          title="No shipping address found"
          description="Please add an address before placing your order."
          actionText="Add Address"
          actionLink="/addresses"
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">Secure Checkout</p>
        <h2 className="mt-2 text-4xl font-bold text-slate-900">Checkout</h2>
      </div>

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

          <Link
            to="/addresses"
            className="inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Manage addresses
          </Link>
        </div>

        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          loading={orderLoading}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </section>
  );
}

export default Checkout;