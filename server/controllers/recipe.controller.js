import RecipeModel from '../models/recipe.model.js';

export const searchRecipes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const recipes = await RecipeModel.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        }).limit(20);

        res.json({ data: recipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModel.find().limit(50);
        res.json({ data: recipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const seedRecipes = async (req, res) => {
    try {
        const recipes = [
            // BREAKFASTS
            {
                title: 'Avocado Toast with Poached Egg',
                image_url: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=300&q=80',
                instructions: 'Toast bread. Poach egg. Assemble.',
                ingredients: [
                    { name: 'Sourdough Bread', quantity: 2, unit: 'slice' },
                    { name: 'Avocado', quantity: 1, unit: 'pc' },
                    { name: 'Egg', quantity: 2, unit: 'pc' }
                ],
                nutrition: { calories: 450, protein: 18, carbs: 30, fat: 25 },
                tags: ['breakfast', 'vegetarian', 'high-protein']
            },
            {
                title: 'Berry Oatmeal Bowl',
                image_url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=300&q=80',
                instructions: 'Boil oats. Add berries.',
                ingredients: [
                    { name: 'Rolled Oats', quantity: 50, unit: 'g' },
                    { name: 'Almond Milk', quantity: 200, unit: 'ml' },
                    { name: 'Blueberries', quantity: 50, unit: 'g' }
                ],
                nutrition: { calories: 300, protein: 8, carbs: 55, fat: 5 },
                tags: ['breakfast', 'vegan', 'fiber']
            },
            {
                title: 'Greek Yogurt Parfait',
                image_url: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=300&q=80',
                instructions: 'Layer yogurt and granola.',
                ingredients: [
                    { name: 'Greek Yogurt', quantity: 150, unit: 'g' },
                    { name: 'Honey', quantity: 1, unit: 'tbsp' },
                    { name: 'Granola', quantity: 30, unit: 'g' }
                ],
                nutrition: { calories: 250, protein: 15, carbs: 30, fat: 6 },
                tags: ['breakfast', 'vegetarian']
            },
            {
                title: 'Keto Bacon & Eggs',
                image_url: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=300&q=80',
                instructions: 'Fry bacon. Fry eggs.',
                ingredients: [
                    { name: 'Bacon', quantity: 3, unit: 'strip' },
                    { name: 'Egg', quantity: 3, unit: 'pc' },
                    { name: 'Butter', quantity: 10, unit: 'g' }
                ],
                nutrition: { calories: 500, protein: 25, carbs: 2, fat: 40 },
                tags: ['breakfast', 'keto', 'high-protein']
            },
            {
                title: 'Green Smoothie',
                image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=300&q=80',
                instructions: 'Blend all ingredients.',
                ingredients: [
                    { name: 'Spinach', quantity: 50, unit: 'g' },
                    { name: 'Banana', quantity: 1, unit: 'pc' },
                    { name: 'Protein Powder', quantity: 1, unit: 'scoop' }
                ],
                nutrition: { calories: 280, protein: 22, carbs: 35, fat: 3 },
                tags: ['breakfast', 'vegan', 'quick']
            },
            // LUNCHES
            {
                title: 'Chicken Caesar Salad',
                image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300&q=80',
                instructions: 'Grill chicken. Toss salad.',
                ingredients: [
                    { name: 'Chicken Breast', quantity: 150, unit: 'g' },
                    { name: 'Romaine Lettuce', quantity: 1, unit: 'head' },
                    { name: 'Parmesan', quantity: 20, unit: 'g' }
                ],
                nutrition: { calories: 400, protein: 40, carbs: 10, fat: 20 },
                tags: ['lunch', 'high-protein']
            },
            {
                title: 'Quinoa Vegetable Bowl',
                image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
                instructions: 'Cook quinoa. Roast veggies.',
                ingredients: [
                    { name: 'Quinoa', quantity: 100, unit: 'g' },
                    { name: 'Sweet Potato', quantity: 1, unit: 'pc' },
                    { name: 'Chickpeas', quantity: 100, unit: 'g' }
                ],
                nutrition: { calories: 450, protein: 12, carbs: 70, fat: 10 },
                tags: ['lunch', 'vegan', 'gluten-free']
            },
            {
                title: 'Turkey Sandwich',
                image_url: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&w=300&q=80',
                instructions: 'Assemble sandwich.',
                ingredients: [
                    { name: 'Whole Wheat Bread', quantity: 2, unit: 'slice' },
                    { name: 'Turkey Deli Meat', quantity: 100, unit: 'g' },
                    { name: 'Tomato', quantity: 1, unit: 'slice' }
                ],
                nutrition: { calories: 350, protein: 25, carbs: 40, fat: 8 },
                tags: ['lunch', 'quick']
            },
            {
                title: 'Lentil Soup',
                image_url: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?auto=format&fit=crop&w=300&q=80',
                instructions: 'Simmer lentils with stock.',
                ingredients: [
                    { name: 'Dry Lentils', quantity: 100, unit: 'g' },
                    { name: 'Carrot', quantity: 1, unit: 'pc' },
                    { name: 'Vegetable Stock', quantity: 500, unit: 'ml' }
                ],
                nutrition: { calories: 320, protein: 18, carbs: 50, fat: 2 },
                tags: ['lunch', 'vegan', 'warm']
            },
            {
                title: 'Tuna Salad Wrap',
                image_url: 'https://images.unsplash.com/photo-1529566118374-b959d9347561?auto=format&fit=crop&w=300&q=80',
                instructions: 'Mix tuna and mayo. Wrap.',
                ingredients: [
                    { name: 'Canned Tuna', quantity: 1, unit: 'tin' },
                    { name: 'Tortilla', quantity: 1, unit: 'pc' },
                    { name: 'Mayonnaise', quantity: 1, unit: 'tbsp' }
                ],
                nutrition: { calories: 380, protein: 30, carbs: 25, fat: 15 },
                tags: ['lunch', 'pescatarian']
            },
            // DINNERS
            {
                title: 'Spaghetti Bolognese',
                image_url: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=300&q=80',
                instructions: 'Cook sauce. Boil pasta.',
                ingredients: [
                    { name: 'Ground Beef', quantity: 200, unit: 'g' },
                    { name: 'Spaghetti', quantity: 100, unit: 'g' },
                    { name: 'Tomato Sauce', quantity: 200, unit: 'ml' }
                ],
                nutrition: { calories: 700, protein: 35, carbs: 80, fat: 25 },
                tags: ['dinner', 'italian']
            },
            {
                title: 'Grilled Salmon with Asparagus',
                image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=300&q=80',
                instructions: 'Grill salmon and asparagus.',
                ingredients: [
                    { name: 'Salmon Fillet', quantity: 180, unit: 'g' },
                    { name: 'Asparagus', quantity: 100, unit: 'g' },
                    { name: 'Lemon', quantity: 0.5, unit: 'pc' }
                ],
                nutrition: { calories: 550, protein: 40, carbs: 5, fat: 35 },
                tags: ['dinner', 'keto', 'pescatarian']
            },
            {
                title: 'Vegan Chickpea Curry',
                image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&q=80',
                instructions: 'Simmer chickpeas in coconut milk.',
                ingredients: [
                    { name: 'Chickpeas', quantity: 1, unit: 'can' },
                    { name: 'Coconut Milk', quantity: 200, unit: 'ml' },
                    { name: 'Curry Paste', quantity: 1, unit: 'tbsp' }
                ],
                nutrition: { calories: 600, protein: 15, carbs: 65, fat: 30 },
                tags: ['dinner', 'vegan', 'spicy']
            },
            {
                title: 'Steak Frites',
                image_url: 'https://images.unsplash.com/photo-1600891965058-2083a68297b6?auto=format&fit=crop&w=300&q=80',
                instructions: 'Pan sear steak. Bake fries.',
                ingredients: [
                    { name: 'Ribeye Steak', quantity: 250, unit: 'g' },
                    { name: 'Potato', quantity: 2, unit: 'pc' },
                    { name: 'Butter', quantity: 20, unit: 'g' }
                ],
                nutrition: { calories: 900, protein: 50, carbs: 40, fat: 60 },
                tags: ['dinner', 'luxury']
            },
            {
                title: 'Chicken Stir Fry',
                image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80',
                instructions: 'Wok fry chicken and veg.',
                ingredients: [
                    { name: 'Chicken Thigh', quantity: 150, unit: 'g' },
                    { name: 'Broccoli', quantity: 100, unit: 'g' },
                    { name: 'Soy Sauce', quantity: 2, unit: 'tbsp' }
                ],
                nutrition: { calories: 450, protein: 30, carbs: 15, fat: 20 },
                tags: ['dinner', 'asian', 'quick']
            },
            {
                title: 'Tacos al Pastor',
                image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80',
                instructions: 'Marinate pork. Serve in tortilla.',
                ingredients: [
                    { name: 'Pork Shoulder', quantity: 150, unit: 'g' },
                    { name: 'Corn Tortilla', quantity: 3, unit: 'pc' },
                    { name: 'Pineapple', quantity: 50, unit: 'g' }
                ],
                nutrition: { calories: 600, protein: 25, carbs: 50, fat: 28 },
                tags: ['dinner', 'mexican']
            },
            {
                title: 'Mushroom Risotto',
                image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=300&q=80',
                instructions: 'Slow cook arborio rice.',
                ingredients: [
                    { name: 'Arborio Rice', quantity: 100, unit: 'g' },
                    { name: 'Mushrooms', quantity: 100, unit: 'g' },
                    { name: 'Vegetable Broth', quantity: 500, unit: 'ml' }
                ],
                nutrition: { calories: 500, protein: 10, carbs: 85, fat: 12 },
                tags: ['dinner', 'vegetarian', 'italian']
            },
            // SNACKS / EXTRAS
            {
                title: 'Protein Shake',
                image_url: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=300&q=80',
                instructions: 'Shake powder with water.',
                ingredients: [
                    { name: 'Whey Protein', quantity: 30, unit: 'g' },
                    { name: 'Water', quantity: 300, unit: 'ml' }
                ],
                nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1 },
                tags: ['snack', 'high-protein']
            },
            {
                title: 'Hummus & Carrots',
                image_url: 'https://images.unsplash.com/photo-1633436375795-12b3b339712f?auto=format&fit=crop&w=300&q=80',
                instructions: 'Dip carrots.',
                ingredients: [
                    { name: 'Hummus', quantity: 50, unit: 'g' },
                    { name: 'Carrot', quantity: 2, unit: 'pc' }
                ],
                nutrition: { calories: 200, protein: 6, carbs: 25, fat: 10 },
                tags: ['snack', 'vegan', 'healthy']
            },
            {
                title: 'Apple Slices with Peanut Butter',
                image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
                instructions: 'Slice apple. Spread PB.',
                ingredients: [
                    { name: 'Apple', quantity: 1, unit: 'pc' },
                    { name: 'Peanut Butter', quantity: 2, unit: 'tbsp' }
                ],
                nutrition: { calories: 280, protein: 8, carbs: 25, fat: 16 },
                tags: ['snack', 'vegetarian', 'quick']
            }
        ];

        await RecipeModel.deleteMany({});
        await RecipeModel.insertMany(recipes);

        res.json({ message: "Recipes seeded successfully", count: recipes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
