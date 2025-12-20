import dotenv from "dotenv";
import connectDB from "../config/connectDB.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";

dotenv.config();

async function runSeed() {
  await connectDB();

  try {
    // Clear existing data (safe for development)
    await CategoryModel.deleteMany({});
    await SubCategoryModel.deleteMany({});
    await ProductModel.deleteMany({});

    // Create categories
    const categories = await CategoryModel.insertMany([
      { name: "Snacks", image: "" },
      { name: "Beverages", image: "" },
    ]);

    // Create subcategories
    const subCategories = await SubCategoryModel.insertMany([
      { name: "Chips", category: [categories[0]._id] },
      { name: "Cold Drinks", category: [categories[1]._id] },
    ]);

    // Create products (referencing category/subCategory ids)
    const products = [
      {
        name: "Plain Potato Chips",
        image: [],
        category: [categories[0]._id],
        subCategory: [subCategories[0]._id],
        unit: "100g",
        stock: 50,
        price: 20,
        discount: 0,
        description: "Crispy salted potato chips",
        more_details: { brand: "Tasty" },
        publish: true,
      },
      {
        name: "Cola Drink 500ml",
        image: [],
        category: [categories[1]._id],
        subCategory: [subCategories[1]._id],
        unit: "500ml",
        stock: 120,
        price: 35,
        discount: 5,
        description: "Refreshing cola",
        more_details: { brand: "Fizz" },
        publish: true,
      },
    ];

    const created = await ProductModel.insertMany(products);

    console.log("Seed completed:");
    console.log("Categories:", categories.length);
    console.log("SubCategories:", subCategories.length);
    console.log("Products:", created.length);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error", err);
    process.exit(1);
  }
}

runSeed();
