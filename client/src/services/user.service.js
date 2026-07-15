import api from "./api";

export const getAdminUsers = (params) =>
  api.get("/admin/users", { params });

export const getAdminUserById = (userId) =>
  api.get(`/admin/users/${userId}`);

export const updateUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, {
    role,
  });

export const toggleUserBlock = (userId) =>
  api.patch(`/admin/users/${userId}/block`);