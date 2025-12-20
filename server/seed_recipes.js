import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RecipeModel from './models/recipe.model.js';
import { sampleRecipes } from './seeds/recipes.js';

dotenv.config();

const seedRecipes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing recipes
        await RecipeModel.deleteMany({});
        console.log('Cleared existing recipes');

        // Insert new recipes
        await RecipeModel.insertMany(sampleRecipes);
        console.log(`Seeded ${sampleRecipes.length} recipes successfully!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding recipes:', error);
        process.exit(1);
    }
};

seedRecipes();
