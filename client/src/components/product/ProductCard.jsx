import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const image =
    product.images?.[0]?.url ||
    "https://placehold.co/600x400?text=SmartShop+AI";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={image}
        alt={product.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <p className="text-sm text-slate-500">{product.brand}</p>

        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900">
          {product.title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {product.category?.name}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-slate-900">
              ₹{product.discountPrice || product.price}
            </p>

            {product.discountPrice > 0 && (
              <p className="text-sm text-slate-400 line-through">
                ₹{product.price}
              </p>
            )}
          </div>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Stock: {product.stock}
          </span>
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="mt-5 block w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;