function AddressSelector({ addresses, selectedAddress, onSelect }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h3 className="text-xl font-bold text-slate-900">Shipping Address</h3>

      <div className="mt-5 space-y-4">
        {addresses.map((address) => (
          <label
            key={address._id}
            className={`block cursor-pointer rounded-xl border p-4 ${
              selectedAddress === address._id
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress === address._id}
              onChange={() => onSelect(address._id)}
              className="mr-2"
            />

            <span className="font-semibold">{address.fullName}</span>

            <p className="mt-2 text-sm text-slate-600">
              {address.addressLine1}, {address.city}, {address.state} -{" "}
              {address.postalCode}
            </p>

            <p className="text-sm text-slate-600">Phone: {address.phone}</p>
          </label>
        ))}
      </div>
    </div>
  );
}

export default AddressSelector;