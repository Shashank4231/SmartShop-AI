import Button from "../ui/Button";

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {address.fullName}
          </h3>

          <p className="mt-2 text-slate-600">{address.addressLine1}</p>
          {address.addressLine2 && (
            <p className="text-slate-600">{address.addressLine2}</p>
          )}

          <p className="text-slate-600">
            {address.city}, {address.state} - {address.postalCode}
          </p>

          <p className="text-slate-600">{address.country}</p>
          <p className="mt-2 text-slate-600">Phone: {address.phone}</p>

          {address.isDefault && (
            <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              Default
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>

        {!address.isDefault && (
          <Button size="sm" variant="secondary" onClick={onSetDefault}>
            Set Default
          </Button>
        )}

        <Button size="sm" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default AddressCard;