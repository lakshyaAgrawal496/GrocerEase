import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

// Get all products with pagination (Admin)
export async function getAllProducts(request, response) {
  try {
    const { page = 1, limit = 12, search = "" } = request.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await ProductModel.find(query)
      .populate("category")
      .populate("subCategory")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    return response.json({
      message: "Products fetched successfully",
      data: products,
      totalProducts,
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

// Add new product (Admin)
export async function addProduct(request, response) {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish,
    } = request.body;

    if (!name || !price || !category || category.length === 0) {
      return response.status(400).json({
        message: "Name, price, and category are required",
        error: true,
        success: false,
      });
    }

    const newProduct = new ProductModel({
      name,
      image: image || [],
      category,
      subCategory: subCategory || [],
      unit: unit || "",
      stock: stock || 0,
      price,
      discount: discount || 0,
      description: description || "",
      more_details: more_details || {},
      publish: publish !== undefined ? publish : true,
    });

    const savedProduct = await newProduct.save();
    const populatedProduct = await ProductModel.findById(savedProduct._id)
      .populate("category")
      .populate("subCategory");

    return response.json({
      message: "Product added successfully",
      data: populatedProduct,
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

// Update product (Admin)
export async function updateProduct(request, response) {
  try {
    const { productId } = request.params;
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish,
    } = request.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (category) updateData.category = category;
    if (subCategory !== undefined) updateData.subCategory = subCategory;
    if (unit !== undefined) updateData.unit = unit;
    if (stock !== undefined) updateData.stock = stock;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (description !== undefined) updateData.description = description;
    if (more_details !== undefined) updateData.more_details = more_details;
    if (publish !== undefined) updateData.publish = publish;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("category")
      .populate("subCategory");

    if (!updatedProduct) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Product updated successfully",
      data: updatedProduct,
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

// Delete product (Admin)
export async function deleteProduct(request, response) {
  try {
    const { productId } = request.params;

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Product deleted successfully",
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

