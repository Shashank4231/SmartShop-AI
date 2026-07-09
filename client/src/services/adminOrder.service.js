import api from "./api";

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", { params });
  return response.data;
};

export const getAdminOrderById = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data;
};

export const updateAdminOrderStatus = async ({ orderId, status }) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, {
    status,
  });

  return response.data;
};