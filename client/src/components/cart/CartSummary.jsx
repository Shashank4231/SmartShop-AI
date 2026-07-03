import { Link } from "react-router-dom";

function CartSummary({ subtotal, shipping, discount, total, onClear, loading }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Discount</span>
          <span className="font-semibold">₹{discount}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold">₹{total}</span>
          </div>
        </div>
      </div>

      <Link to="/checkout">
        <button className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700">
          Proceed to Checkout
        </button>
      </Link>

      <button
        onClick={onClear}
        disabled={loading}
        className="mt-3 w-full rounded-xl border border-red-200 px-6 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Clear Cart
      </button>
    </div>
  );
}

export default CartSummary;