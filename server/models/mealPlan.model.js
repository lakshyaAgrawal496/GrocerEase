import mongoose from 'mongoose';

const mealPlanItemSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: true
    },
    meal: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner'],
        required: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }
});

const mealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    weekStart: {
        type: Date,
        required: true
    },
    items: [mealPlanItemSchema]
}, {
    timestamps: true
});

const MealPlanModel = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlanModel;
