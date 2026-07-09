import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import CategoryForm from "../../components/admin/CategoryForm";
import DataTable from "../../components/admin/DataTable";
import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import Drawer from "../../components/ui/Drawer";

import {
  createAdminCategory,
  deleteAdminCategory,
  fetchCategories,
  updateAdminCategory,
} from "../../features/category/categorySlice";

function AdminCategories() {
  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.category);

  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setOpenDrawer(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setEditingCategory(null);
  };

  const handleSubmitCategory = async (categoryData) => {
    const result = editingCategory
      ? await dispatch(
          updateAdminCategory({
            categoryId: editingCategory._id,
            categoryData,
          })
        )
      : await dispatch(createAdminCategory(categoryData));

    if (
      createAdminCategory.fulfilled.match(result) ||
      updateAdminCategory.fulfilled.match(result)
    ) {
      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully"
      );

      handleCloseDrawer();
      dispatch(fetchCategories());
    } else {
      toast.error(result.payload || "Category action failed");
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const result = await dispatch(deleteAdminCategory(categoryToDelete._id));

    if (deleteAdminCategory.fulfilled.match(result)) {
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
    } else {
      toast.error(result.payload || "Failed to delete category");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Category",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "description",
      label: "Description",
      render: (category) => category.description || "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      render: (category) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenEdit(category)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => setCategoryToDelete(category)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Category Management
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Categories
          </h1>
        </div>

        <Button onClick={handleOpenCreate}>Add Category</Button>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        emptyTitle="No categories found"
        emptyDescription="Create your first category to organize products."
      />

      <Drawer
        isOpen={openDrawer}
        title={editingCategory ? "Edit Category" : "Add Category"}
        onClose={handleCloseDrawer}
      >
        <CategoryForm
          mode={editingCategory ? "edit" : "create"}
          initialData={editingCategory}
          loading={loading}
          onSubmit={handleSubmitCategory}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={!!categoryToDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
        confirmText="Delete"
        loading={loading}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}

export default AdminCategories;