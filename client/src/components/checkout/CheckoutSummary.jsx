import Button from "../ui/Button";

function CheckoutSummary({ items, subtotal, shipping, discount, total, onPlaceOrder, loading }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const product = item.product;
          const price = product.discountPrice || product.price;

          return (
            <div key={product._id} className="flex justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{product.title}</p>
                <p className="text-slate-500">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold">₹{price * item.quantity}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3 border-t pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Shipping</span>
          <span className="font-semibold">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Discount</span>
          <span className="font-semibold">₹{discount}</span>
        </div>

        <div className="flex justify-between border-t pt-4 text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold">₹{total}</span>
        </div>
      </div>

      <Button loading={loading} onClick={onPlaceOrder} className="mt-6 w-full">
        Place Order
      </Button>
    </div>
  );
}

export default CheckoutSummary;