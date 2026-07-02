import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import AddressCard from "../components/address/AddressCard";
import AddressForm from "../components/address/AddressForm";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import {
  createAddress,
  editAddress,
  fetchAddresses,
  makeDefaultAddress,
  removeAddress,
} from "../features/address/addressSlice";

function Addresses() {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    const result = editingAddress
      ? await dispatch(
          editAddress({
            addressId: editingAddress._id,
            addressData: formData,
          })
        )
      : await dispatch(createAddress(formData));

    if (createAddress.fulfilled.match(result) || editAddress.fulfilled.match(result)) {
      toast.success(editingAddress ? "Address updated" : "Address added");
      setShowForm(false);
      setEditingAddress(null);
    } else {
      toast.error(result.payload || "Address action failed");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    const result = await dispatch(removeAddress(addressId));

    if (removeAddress.fulfilled.match(result)) {
      toast.success("Address deleted");
    } else {
      toast.error(result.payload || "Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    const result = await dispatch(makeDefaultAddress(addressId));

    if (makeDefaultAddress.fulfilled.match(result)) {
      toast.success("Default address updated");
    } else {
      toast.error(result.payload || "Failed to update default address");
    }
  };

  if (loading && addresses.length === 0) {
    return <Loader text="Loading addresses..." />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Shipping Details</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            My Addresses
          </h2>
        </div>

        <Button
          onClick={() => {
            setEditingAddress(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Close Form" : "Add New Address"}
        </Button>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      {showForm && (
        <div className="mb-8">
          <AddressForm
            initialData={editingAddress}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <EmptyState
          title="No addresses saved"
          description="Add a shipping address to make checkout faster."
          actionText="Add Address"
          actionLink="/addresses"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address._id)}
              onSetDefault={() => handleSetDefault(address._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Addresses;