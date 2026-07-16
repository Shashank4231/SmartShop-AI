import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import addressReducer from "../features/address/addressSlice";
import orderReducer from "../features/order/orderSlice";
import adminReducer from "../features/admin/adminSlice";
import categoryReducer from "../features/category/categorySlice";
import adminOrderReducer from "../features/adminOrder/adminOrderSlice";
import adminUserReducer from "../features/adminUser/adminUserSlice";
import paymentReducer from "../features/payment/paymentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    order: orderReducer,
    admin: adminReducer,
    category: categoryReducer,
    adminOrder: adminOrderReducer,
    adminUser: adminUserReducer,
    payment: paymentReducer,
  },
});