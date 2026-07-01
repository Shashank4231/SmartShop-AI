import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <p className="text-slate-600">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;