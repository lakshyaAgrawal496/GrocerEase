import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

// Get all orders with pagination and filters (Admin)
export async function getAllOrders(request, response) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search = "",
    } = request.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Filter by delivery status
    if (status && status !== "all") {
      query.delivery_status = status;
    }

    // Search by order ID or product name
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "product_details.name": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await OrderModel.find(query)
      .populate("userId", "name email")
      .populate("productId")
      .populate("delivery_address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await OrderModel.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    return response.json({
      message: "Orders fetched successfully",
      data: orders,
      totalOrders,
      totalPages,
      currentPage: parseInt(page),
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

// Update order delivery status (Admin)
export async function updateOrderStatus(request, response) {
  try {
    const { orderId } = request.params;
    const { delivery_status } = request.body;

    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

    if (!delivery_status || !validStatuses.includes(delivery_status)) {
      return response.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        error: true,
        success: false,
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { delivery_status },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email")
      .populate("productId")
      .populate("delivery_address");

    if (!updatedOrder) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Order status updated successfully",
      data: updatedOrder,
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

// Get pending orders (Admin)
export async function getPendingOrders(request, response) {
  try {
    const orders = await OrderModel.find({ delivery_status: "Pending" })
      .populate("userId", "name email")
      .populate("productId")
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return response.json({
      message: "Pending orders fetched successfully",
      data: orders,
      count: orders.length,
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

// Get delivered orders (Admin)
export async function getDeliveredOrders(request, response) {
  try {
    const orders = await OrderModel.find({ delivery_status: "Delivered" })
      .populate("userId", "name email")
      .populate("productId")
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return response.json({
      message: "Delivered orders fetched successfully",
      data: orders,
      count: orders.length,
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

