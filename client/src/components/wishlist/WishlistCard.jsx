import { Link } from "react-router-dom";

function WishlistCard({ product, onRemove }) {
  const image =
    product.images?.[0]?.url || "https://placehold.co/500x350?text=Product";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <img src={image} alt={product.title} className="h-56 w-full object-cover" />

      <div className="p-5">
        <p className="text-sm text-slate-500">{product.brand}</p>

        <h3 className="mt-1 text-lg font-bold text-slate-900">
          {product.title}
        </h3>

        <p className="mt-3 text-xl font-bold">
          ₹{product.discountPrice || product.price}
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            View
          </Link>

          <button
            onClick={() => onRemove(product._id)}
            className="flex-1 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;