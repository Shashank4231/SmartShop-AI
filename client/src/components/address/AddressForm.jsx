import { useState } from "react";
import Button from "../ui/Button";
import Input from "../forms/Input";

const initialState = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function AddressForm({ onSubmit, loading, initialData, onCancel }) {
  const [formData, setFormData] = useState(initialData || initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <Input label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
        <Input label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
        <Input label="City" name="city" value={formData.city} onChange={handleChange} />
        <Input label="State" name="state" value={formData.state} onChange={handleChange} />
        <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
        <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
        />
        Set as default address
      </label>

      <div className="mt-6 flex gap-3">
        <Button type="submit" loading={loading}>
          Save Address
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default AddressForm;