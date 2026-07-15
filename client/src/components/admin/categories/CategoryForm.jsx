import { useEffect, useState } from "react";
import Input from "../../forms/Input";
import Button from "../../ui/Button";

const initialState = {
  name: "",
  description: "",
};

function CategoryForm({
  onSubmit,
  loading,
  mode = "create",
  initialData = null,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Electronics"
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
          placeholder="Write category description"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {mode === "edit" ? "Update Category" : "Save Category"}
      </Button>
    </form>
  );
}

export default CategoryForm;