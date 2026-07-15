import {
  CalendarDays,
  Heart,
  IndianRupee,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";

import Drawer from "../../ui/Drawer";
import Loader from "../../ui/Loader";
import StatusBadge from "../../ui/StatusBadge";

function UserDetailsDrawer({
  isOpen,
  onClose,
  userData,
  loading,
  error,
}) {
  const user = userData?.user;
  const recentOrders = userData?.recentOrders || [];
  const totalSpending = userData?.totalSpending || 0;

  return (
    <Drawer
      isOpen={isOpen}
      title="User Details"
      onClose={onClose}
      width="max-w-2xl"
    >
      {loading && <Loader text="Loading user details..." />}

      {!loading && error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && user && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <img
                src={user.avatar?.url || "https://placehold.co/120x120"}
                alt={user.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />

              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-900">
                  {user.name}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-slate-500">
                  <Mail size={17} />
                  <span className="break-all">{user.email}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold capitalize text-blue-700">
                    {user.role}
                  </span>

                  <StatusBadge
                    status={user.isVerified ? "Verified" : "Unverified"}
                  />

                  <StatusBadge
                    status={user.isBlocked ? "Blocked" : "Active"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-blue-600" size={21} />

                <div>
                  <p className="text-sm text-slate-500">Joined</p>
                  <p className="font-bold text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <IndianRupee className="text-emerald-600" size={21} />

                <div>
                  <p className="text-sm text-slate-500">Total Spending</p>
                  <p className="font-bold text-slate-900">
                    ₹{totalSpending}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <MapPin className="text-orange-600" size={21} />

                <div>
                  <p className="text-sm text-slate-500">Saved Addresses</p>
                  <p className="font-bold text-slate-900">
                    {user.addresses?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <Heart className="text-red-600" size={21} />

                <div>
                  <p className="text-sm text-slate-500">Wishlist Products</p>
                  <p className="font-bold text-slate-900">
                    {user.wishlist?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <Package className="text-violet-600" size={23} />

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Orders
                </h3>
                <p className="text-sm text-slate-500">
                  Latest purchases made by this user
                </p>
              </div>
            </div>

            {recentOrders.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-slate-500">
                This user has not placed any orders yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.orderStatus} />
                      <p className="font-bold text-slate-900">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user.addresses?.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="text-orange-600" size={23} />
                <h3 className="text-xl font-bold text-slate-900">
                  Saved Addresses
                </h3>
              </div>

              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <div
                    key={address._id}
                    className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-900">
                        {address.fullName}
                      </p>

                      {address.isDefault && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-2">{address.addressLine1}</p>

                    {address.addressLine2 && <p>{address.addressLine2}</p>}

                    <p>
                      {address.city}, {address.state} - {address.postalCode}
                    </p>

                    <p>{address.country}</p>
                    <p className="mt-2 font-semibold">Phone: {address.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

export default UserDetailsDrawer;