import MealPlanModel from '../models/mealPlan.model.js';
import RecipeModel from '../models/recipe.model.js';
import ProductModel from '../models/product.model.js';
import CartProductModel from '../models/cartproduct.model.js';

// Helper: Simple string similarity for ingredient mapping
const findBestProductMatch = async (ingredientName) => {
    // In a real app, use fuzzy search or embeddings. Here, we use regex.
    const regex = new RegExp(ingredientName.split(' ')[0], 'i'); // Match first word
    const product = await ProductModel.findOne({ name: regex });
    return product;
};

export const createMealPlan = async (req, res) => {
    try {
        const { weekStart, items } = req.body;
        const userId = req.user.id; // From JWT middleware

        const mealPlan = new MealPlanModel({
            userId,
            weekStart: new Date(weekStart),
            items
        });

        await mealPlan.save();
        res.status(201).json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const mealPlan = await MealPlanModel.findById(id).populate('items.recipeId');
        if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });
        res.json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getShoppingList = async (req, res) => {
    try {
        const { id } = req.params;
        const mealPlan = await MealPlanModel.findById(id).populate('items.recipeId');
        if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

        const ingredients = {};

        // Aggregate ingredients
        mealPlan.items.forEach(item => {
            if (item.recipeId && item.recipeId.ingredients) {
                item.recipeId.ingredients.forEach(ing => {
                    const key = ing.name.toLowerCase();
                    if (ingredients[key]) {
                        ingredients[key].quantity += ing.quantity;
                    } else {
                        ingredients[key] = { ...ing, quantity: ing.quantity };
                    }
                });
            }
        });

        // Map to products
        const shoppingList = await Promise.all(Object.values(ingredients).map(async (ing) => {
            const product = await findBestProductMatch(ing.name);
            return {
                ingredientName: ing.name,
                totalQuantity: ing.quantity,
                unit: ing.unit,
                mappedProduct: product ? {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image[0]
                } : null
            };
        }));

        res.json(shoppingList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const mealPlan = await MealPlanModel.findById(id).populate('items.recipeId');
        if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

        // Reuse shopping list logic (simplified for brevity)
        const ingredients = {};
        mealPlan.items.forEach(item => {
            if (item.recipeId && item.recipeId.ingredients) {
                item.recipeId.ingredients.forEach(ing => {
                    const key = ing.name.toLowerCase();
                    if (ingredients[key]) {
                        ingredients[key].quantity += ing.quantity;
                    } else {
                        ingredients[key] = { ...ing, quantity: ing.quantity };
                    }
                });
            }
        });

        const cartItems = [];
        for (const ing of Object.values(ingredients)) {
            const product = await findBestProductMatch(ing.name);
            if (product) {
                // Check if already in cart
                const existing = await CartProductModel.findOne({ userId, productId: product._id });
                if (existing) {
                    existing.qty += 1; // Simple increment, real logic needs unit conversion
                    await existing.save();
                } else {
                    const newCartItem = new CartProductModel({
                        userId,
                        productId: product._id,
                        qty: 1
                    });
                    await newCartItem.save();
                }
                cartItems.push(product.name);
            }
        }

        res.json({ message: "Added to cart", items: cartItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const aiSuggest = async (req, res) => {
    try {
        // Simple fallback logic: return random recipes
        // In PR 4, we will add TF.js logic here or on client
        const count = await RecipeModel.countDocuments();
        const random = Math.floor(Math.random() * count);
        const recipes = await RecipeModel.find().limit(21); // Return enough for a week
        res.json(recipes.map(r => r._id));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
