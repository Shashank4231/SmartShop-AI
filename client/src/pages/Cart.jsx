import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import {
  clearUserCart,
  fetchCart,
  removeProductFromCart,
  updateProductQuantity,
} from "../features/cart/cartSlice";

import EmptyState from "../components/ui/EmptyState";

function Cart() {
  const dispatch = useDispatch();

  const {
    items,
    subtotal,
    shipping,
    discount,
    total,
    loading,
    error,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleIncrease = (item) => {
    dispatch(
      updateProductQuantity({
        productId: item.product._id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;

    dispatch(
      updateProductQuantity({
        productId: item.product._id,
        quantity: item.quantity - 1,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(
      removeProductFromCart({
        productId: item.product._id,
      })
    );
  };

  const handleClear = () => {
    dispatch(clearUserCart());
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">Shopping Cart</p>
        <h2 className="mt-2 text-4xl font-bold text-slate-900">
          Your Cart
        </h2>
      </div>

      {loading && <p className="text-slate-600">Updating cart...</p>}

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionText="Continue Shopping"
          actionLink="/products"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                loading={loading}
                onIncrease={() => handleIncrease(item)}
                onDecrease={() => handleDecrease(item)}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </div>

          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            loading={loading}
            onClear={handleClear}
          />
        </div>
      )}
    </section>
  );
}

export default Cart;