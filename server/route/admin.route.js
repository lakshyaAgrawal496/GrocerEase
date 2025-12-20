import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import {
  getAllOrders,
  updateOrderStatus,
  getPendingOrders,
  getDeliveredOrders,
} from "../controllers/adminOrderController.js";
import {
  getTotalSales,
  getTotalRevenue,
  getTopSellingProducts,
  getAdminDashboardStats,
} from "../controllers/adminStatsController.js";

const adminRouter = Router();

// All admin routes require authentication and admin role
adminRouter.use(auth);
adminRouter.use(admin);

// Product Management Routes
adminRouter.get("/products", getAllProducts);
adminRouter.post("/products", addProduct);
adminRouter.put("/products/:productId", updateProduct);
adminRouter.delete("/products/:productId", deleteProduct);

// Order Management Routes
adminRouter.get("/orders", getAllOrders);
adminRouter.put("/orders/:orderId/status", updateOrderStatus);
adminRouter.get("/orders/pending", getPendingOrders);
adminRouter.get("/orders/delivered", getDeliveredOrders);

// Statistics Routes
adminRouter.get("/stats/dashboard", getAdminDashboardStats);
adminRouter.get("/stats/sales", getTotalSales);
adminRouter.get("/stats/revenue", getTotalRevenue);
adminRouter.get("/stats/top-products", getTopSellingProducts);

export default adminRouter;

