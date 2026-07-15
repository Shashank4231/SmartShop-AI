import { Plus } from "lucide-react";
import { PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../components/admin/shared/DataTable";
import AdminPageHeader from "../../components/admin/shared/AdminPageHeader";
import ProductForm from "../../components/admin/products/ProductForm";

import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import Loader from "../../components/ui/Loader";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

import {
  createAdminProduct,
  deleteAdminProduct,
  fetchProducts,
  updateAdminProduct,
} from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";

function AdminProducts() {
  const dispatch = useDispatch();

  const { products, pagination, loading, error } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.category);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [category, setCategory] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const limit = 10;

  useEffect(() => {
    dispatch(
      fetchProducts({
        limit,
        page,
        search,
        sort,
        order,
        category,
      })
    );

    dispatch(fetchCategories());
  }, [dispatch, page, search, sort, order, category]);

  const refetchProducts = () => {
    dispatch(
      fetchProducts({
        limit,
        page,
        search,
        sort,
        order,
        category,
      })
    );
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (productData) => {
    const result = editingProduct
      ? await dispatch(
        updateAdminProduct({
          productId: editingProduct._id,
          productData,
        })
      )
      : await dispatch(createAdminProduct(productData));

    if (
      createAdminProduct.fulfilled.match(result) ||
      updateAdminProduct.fulfilled.match(result)
    ) {
      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully"
      );

      handleCloseDrawer();
      refetchProducts();
    } else {
      toast.error(result.payload || "Product action failed");
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const result = await dispatch(deleteAdminProduct(productToDelete._id));

    if (deleteAdminProduct.fulfilled.match(result)) {
      toast.success("Product deleted successfully");
      setProductToDelete(null);
      refetchProducts();
    } else {
      toast.error(result.payload || "Failed to delete product");
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (product) => (
        <img
          src={product.images?.[0]?.url || "https://placehold.co/80x80"}
          alt={product.title}
          className="h-14 w-14 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "title",
      label: "Product",
    },
    {
      key: "brand",
      label: "Brand",
    },
    {
      key: "price",
      label: "Price",
      render: (product) => `₹${product.discountPrice || product.price}`,
    },
    {
      key: "stock",
      label: "Stock",
    },
    {
      key: "category",
      label: "Category",
      render: (product) => product.category?.name || "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenEdit(product)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => setProductToDelete(product)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading && products.length === 0) {
    return <Loader text="Loading products..." />;
  }

  return (
    <div>
      <AdminPageHeader
        breadcrumb={["Admin", "Products"]}
        icon={<PackagePlus size={32} />}
        title="Products"
        description="Manage your catalog, inventory and pricing."
        action={
          <Button
            onClick={handleOpenCreate}
            leftIcon={<Plus size={18} />}
          >
            Add Product
          </Button>
        }
      />

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4 rounded-2xl bg-white p-4 shadow md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        >
          <option value="createdAt">Newest</option>
          <option value="title">Name</option>
          <option value="price">Price</option>
          <option value="stock">Stock</option>
        </select>

        <select
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyTitle="No products found"
        emptyDescription="Try a different search keyword or create a new product."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Drawer
        isOpen={openDrawer}
        title={editingProduct ? "Edit Product" : "Add Product"}
        onClose={handleCloseDrawer}
      >
        <ProductForm
          mode={editingProduct ? "edit" : "create"}
          initialData={editingProduct}
          categories={categories}
          loading={loading}
          onSubmit={handleSubmitProduct}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={!!productToDelete}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action will remove it from active product listings.`}
        confirmText="Delete"
        loading={loading}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}

export default AdminProducts;