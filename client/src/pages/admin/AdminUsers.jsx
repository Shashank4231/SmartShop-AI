import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, ShieldCheck, UserRoundX, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import AdminPageHeader from "../../components/admin/shared/AdminPageHeader";
import DataTable from "../../components/admin/shared/DataTable";
import UserDetailsDrawer from "../../components/admin/users/UserDetailsDrawer";

import Button from "../../components/ui/Button";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import StatusBadge from "../../components/ui/StatusBadge";

import {
  clearSelectedUser,
  fetchAdminUserDetails,
  fetchAdminUsers,
  toggleUserBlockThunk,
  updateUserRoleThunk,
} from "../../features/adminUser/adminUserSlice";

function AdminUsers() {
  const dispatch = useDispatch();

  const {
    users,
    selectedUser,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.adminUser);

  const currentUser = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [userToBlock, setUserToBlock] = useState(null);

  const [roleUser, setRoleUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search,
        role,
        status,
      })
    );
  }, [dispatch, search, role, status]);

  const handleViewUser = (user) => {
    setDetailsOpen(true);
    dispatch(fetchAdminUserDetails(user._id));
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    dispatch(clearSelectedUser());
  };

  const handleToggleBlock = async () => {
    if (!userToBlock) return;

    const result = await dispatch(
      toggleUserBlockThunk(userToBlock._id)
    );

    if (toggleUserBlockThunk.fulfilled.match(result)) {
      toast.success(
        result.payload.isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully"
      );

      setUserToBlock(null);
    } else {
      toast.error(result.payload || "Failed to update user");
    }
  };

  const handleUpdateRole = async () => {
    if (!roleUser) return;

    if (selectedRole === roleUser.role) {
      toast.error("Please select a different role");
      return;
    }

    const result = await dispatch(
      updateUserRoleThunk({
        userId: roleUser._id,
        role: selectedRole,
      })
    );

    if (updateUserRoleThunk.fulfilled.match(result)) {
      toast.success("User role updated successfully");
      setRoleUser(null);
    } else {
      toast.error(result.payload || "Failed to update role");
    }
  };

  const columns = [
    {
      key: "avatar",
      label: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={
              user.avatar?.url ||
              "https://placehold.co/80x80"
            }
            alt={user.name}
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="text-xs text-slate-500">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span className="capitalize">{user.role}</span>
      ),
    },
    {
      key: "verified",
      label: "Verified",
      render: (user) => (
        <StatusBadge
          status={user.isVerified ? "Verified" : "Unverified"}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <StatusBadge
          status={user.isBlocked ? "Blocked" : "Active"}
        />
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (user) =>
        new Date(user.createdAt).toLocaleDateString("en-IN"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => {
        const isSelf = currentUser?._id === user._id;

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Eye size={16} />}
              onClick={() => handleViewUser(user)}
            >
              View
            </Button>

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<ShieldCheck size={16} />}
              disabled={isSelf}
              onClick={() => {
                setRoleUser(user);
                setSelectedRole(user.role);
              }}
            >
              Role
            </Button>

            <Button
              size="sm"
              variant={user.isBlocked ? "success" : "danger"}
              leftIcon={<UserRoundX size={16} />}
              disabled={isSelf}
              onClick={() => setUserToBlock(user)}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <AdminPageHeader
        breadcrumb={["Admin", "Users"]}
        icon={<Users size={32} />}
        title="Users"
        description="Manage customer accounts, roles, and access."
      />

      {error && !detailsOpen && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email..."
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading && !detailsOpen}
        emptyTitle="No users found"
        emptyDescription="Try changing the search or filter options."
      />

      <UserDetailsDrawer
        isOpen={detailsOpen}
        onClose={handleCloseDetails}
        userData={selectedUser}
        loading={loading}
        error={error}
      />

      <ConfirmationModal
        isOpen={!!userToBlock}
        title={
          userToBlock?.isBlocked
            ? "Unblock User?"
            : "Block User?"
        }
        message={
          userToBlock?.isBlocked
            ? `Allow "${userToBlock?.name}" to access the application again?`
            : `Block "${userToBlock?.name}" from logging in and refreshing their session?`
        }
        confirmText={
          userToBlock?.isBlocked ? "Unblock" : "Block User"
        }
        loading={actionLoading}
        onCancel={() => setUserToBlock(null)}
        onConfirm={handleToggleBlock}
      />

      <ConfirmationModal
        isOpen={!!roleUser}
        title="Update User Role"
        message={
          <div>
            <p className="mb-4">
              Select a new role for{" "}
              <strong>{roleUser?.name}</strong>.
            </p>

            <select
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        }
        confirmText="Update Role"
        loading={actionLoading}
        onCancel={() => setRoleUser(null)}
        onConfirm={handleUpdateRole}
      />
    </div>
  );
}

export default AdminUsers;