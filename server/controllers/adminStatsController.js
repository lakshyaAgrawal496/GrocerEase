import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

// Get total sales (count of delivered orders)
export async function getTotalSales(request, response) {
  try {
    const totalSales = await OrderModel.countDocuments({
      delivery_status: "Delivered",
    });

    return response.json({
      message: "Total sales fetched successfully",
      data: {
        totalSales,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get total revenue (sum of totalAmt from delivered orders)
export async function getTotalRevenue(request, response) {
  try {
    const result = await OrderModel.aggregate([
      {
        $match: {
          delivery_status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
        },
      },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    return response.json({
      message: "Total revenue fetched successfully",
      data: {
        totalRevenue,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get top selling products
export async function getTopSellingProducts(request, response) {
  try {
    const { limit = 10 } = request.query;

    const topProducts = await OrderModel.aggregate([
      {
        $match: {
          delivery_status: "Delivered",
        },
      },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: { $ifNull: ["$quantity", 1] } },
          totalRevenue: { $sum: "$totalAmt" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          productId: "$_id",
          productName: "$productDetails.name",
          productImage: { $arrayElemAt: ["$productDetails.image", 0] },
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
        },
      },
    ]);

    return response.json({
      message: "Top selling products fetched successfully",
      data: topProducts,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get complete admin dashboard stats
export async function getAdminDashboardStats(request, response) {
  try {
    // Total orders
    const totalOrders = await OrderModel.countDocuments();

    // Total delivered orders
    const totalDelivered = await OrderModel.countDocuments({
      delivery_status: "Delivered",
    });

    // Total revenue from delivered orders
    const revenueResult = await OrderModel.aggregate([
      {
        $match: {
          delivery_status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmt" },
        },
      },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Total products sold (sum of quantities from delivered orders)
    const productsSoldResult = await OrderModel.aggregate([
      {
        $match: {
          delivery_status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalProductsSold: { $sum: { $ifNull: ["$quantity", 1] } },
        },
      },
    ]);
    const totalProductsSold = productsSoldResult.length > 0 ? productsSoldResult[0].totalProductsSold : 0;

    // Orders by status
    const ordersByStatus = await OrderModel.aggregate([
      {
        $group: {
          _id: "$delivery_status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Total products in inventory
    const totalProducts = await OrderModel.distinct("productId").length;
    const totalProductsInDB = await ProductModel.countDocuments();

    // Total users
    const totalUsers = await UserModel.countDocuments();

    // Pending orders count
    const pendingOrders = await OrderModel.countDocuments({
      delivery_status: "Pending",
    });

    // Shipped orders count
    const shippedOrders = await OrderModel.countDocuments({
      delivery_status: "Shipped",
    });

    // Cancelled orders count
    const cancelledOrders = await OrderModel.countDocuments({
      delivery_status: "Cancelled",
    });

    return response.json({
      message: "Dashboard stats fetched successfully",
      data: {
        totalOrders,
        totalDelivered,
        totalRevenue,
        totalProductsSold,
        totalProducts: totalProductsInDB,
        totalUsers,
        ordersByStatus: {
          pending: pendingOrders,
          shipped: shippedOrders,
          delivered: totalDelivered,
          cancelled: cancelledOrders,
        },
        statusBreakdown: ordersByStatus,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

