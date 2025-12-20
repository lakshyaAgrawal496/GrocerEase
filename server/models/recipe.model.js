import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    image_url: {
        type: String,
        default: ""
    },
    instructions: {
        type: String,
        required: true
    },
    ingredients: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true }
    }],
    nutrition: {
        calories: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    },
    tags: [{
        type: String,
        index: true
    }]
}, {
    timestamps: true
});

const RecipeModel = mongoose.model('Recipe', recipeSchema);

export default RecipeModel;
