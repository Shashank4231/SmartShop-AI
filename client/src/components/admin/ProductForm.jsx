import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../forms/Input";

const initialState = {
  title: "",
  description: "",
  price: "",
  discountPrice: "",
  brand: "",
  category: "",
  stock: "",
  tags: "",
  isFeatured: false,
};

function ProductForm({
  categories,
  onSubmit,
  loading,
  mode = "create",
  initialData = null,
}) {
  const [formData, setFormData] = useState(initialState);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        discountPrice: initialData.discountPrice || "",
        brand: initialData.brand || "",
        category: initialData.category?._id || initialData.category || "",
        stock: initialData.stock || "",
        tags: initialData.tags?.join(", ") || "",
        isFeatured: initialData.isFeatured || false,
      });
    } else if (categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category: prev.category || categories[0]._id,
      }));
    }
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      productData.append(key, value);
    });

    images.forEach((image) => {
      productData.append("images", image);
    });

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Product Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter product title"
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
          placeholder="Enter product description"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />

        <Input
          label="Discount Price"
          name="discountPrice"
          type="number"
          value={formData.discountPrice}
          onChange={handleChange}
        />

        <Input
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        />

        <Input
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Category
        </label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Tags"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="phone, apple, smartphone"
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Product Images
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        {mode === "edit" && (
          <p className="mt-2 text-xs text-slate-500">
            Uploading new images will add them to the existing product images.
          </p>
        )}

        {images.length > 0 && (
          <p className="mt-2 text-sm text-slate-500">
            {images.length} image(s) selected
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
        />
        Mark as featured product
      </label>

      <Button type="submit" loading={loading} className="w-full">
        {mode === "edit" ? "Update Product" : "Save Product"}
      </Button>
    </form>
  );
}

export default ProductForm;