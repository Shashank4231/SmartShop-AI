import QuantitySelector from "./QuantitySelector";

function CartItem({ item, onIncrease, onDecrease, onRemove, loading }) {
  const product = item.product;
  const image =
    product?.images?.[0]?.url || "https://placehold.co/300x200?text=Product";
  const price = product?.discountPrice || product?.price;

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center">
      <img
        src={image}
        alt={product?.title}
        className="h-32 w-full rounded-xl object-cover md:w-40"
      />

      <div className="flex-1">
        <p className="text-sm text-slate-500">{product?.brand}</p>

        <h3 className="mt-1 text-lg font-bold text-slate-900">
          {product?.title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Stock: {product?.stock}
        </p>

        <button
          onClick={onRemove}
          disabled={loading}
          className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <div className="flex flex-col items-start gap-4 md:items-end">
        <p className="text-xl font-bold text-slate-900">₹{price}</p>

        <QuantitySelector
          quantity={item.quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          disabled={loading}
        />

        <p className="text-sm text-slate-500">
          Item total: ₹{price * item.quantity}
        </p>
      </div>
    </div>
  );
}

export default CartItem;