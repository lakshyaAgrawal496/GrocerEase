export const sampleRecipes = [
    {
        title: "Classic Avocado Toast",
        image_url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d",
        instructions: "Toast bread. Mash avocado with salt and pepper. Spread on toast. Top with egg if desired.",
        ingredients: [
            { name: "Whole Wheat Bread", quantity: 2, unit: "slice" },
            { name: "Avocado", quantity: 1, unit: "pc" },
            { name: "Salt", quantity: 1, unit: "pinch" },
            { name: "Black Pepper", quantity: 1, unit: "pinch" }
        ],
        nutrition: { calories: 350, carbs: 45, protein: 12, fat: 18 },
        tags: ["breakfast", "vegetarian", "quick"]
    },
    {
        title: "Grilled Chicken Salad",
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        instructions: "Grill chicken breast. Chop lettuce, cucumber, and tomatoes. Toss with dressing.",
        ingredients: [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Lettuce", quantity: 100, unit: "g" },
            { name: "Cucumber", quantity: 1, unit: "pc" },
            { name: "Tomato", quantity: 2, unit: "pc" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 450, carbs: 10, protein: 40, fat: 20 },
        tags: ["lunch", "high-protein", "keto"]
    },
    {
        title: "Spaghetti Aglio e Olio",
        image_url: "https://images.unsplash.com/photo-1673442635965-34f1b36d8944",
        instructions: "Boil pasta. Sauté garlic and chili flakes in olive oil. Toss pasta in oil. Garnish with parsley.",
        ingredients: [
            { name: "Spaghetti", quantity: 150, unit: "g" },
            { name: "Garlic", quantity: 4, unit: "clove" },
            { name: "Olive Oil", quantity: 3, unit: "tbsp" },
            { name: "Chili Flakes", quantity: 1, unit: "tsp" },
            { name: "Parsley", quantity: 1, unit: "bunch" }
        ],
        nutrition: { calories: 500, carbs: 70, protein: 12, fat: 22 },
        tags: ["dinner", "italian", "vegan"]
    },
    {
        title: "Oatmeal with Berries",
        image_url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf",
        instructions: "Cook oats in milk/water. Top with fresh berries and honey.",
        ingredients: [
            { name: "Rolled Oats", quantity: 50, unit: "g" },
            { name: "Milk", quantity: 200, unit: "ml" },
            { name: "Strawberries", quantity: 5, unit: "pc" },
            { name: "Honey", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 300, carbs: 55, protein: 10, fat: 6 },
        tags: ["breakfast", "vegetarian", "healthy"]
    },
    {
        title: "Beef Stir Fry",
        image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
        instructions: "Slice beef thinly. Stir fry with broccoli and soy sauce. Serve with rice.",
        ingredients: [
            { name: "Beef Steak", quantity: 200, unit: "g" },
            { name: "Broccoli", quantity: 150, unit: "g" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
            { name: "Rice", quantity: 100, unit: "g" }
        ],
        nutrition: { calories: 600, carbs: 45, protein: 35, fat: 25 },
        tags: ["dinner", "high-protein", "asian"]
    },
    {
        title: "Vegetable Curry",
        image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
        instructions: "Sauté onions and spices. Add mixed vegetables and coconut milk. Simmer until tender.",
        ingredients: [
            { name: "Mixed Vegetables", quantity: 300, unit: "g" },
            { name: "Coconut Milk", quantity: 200, unit: "ml" },
            { name: "Curry Powder", quantity: 1, unit: "tbsp" },
            { name: "Onion", quantity: 1, unit: "pc" }
        ],
        nutrition: { calories: 400, carbs: 30, protein: 8, fat: 28 },
        tags: ["dinner", "vegan", "gluten-free"]
    },
    {
        title: "Pancakes",
        image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
        instructions: "Mix flour, milk, egg, and baking powder. Cook on griddle. Serve with syrup.",
        ingredients: [
            { name: "Flour", quantity: 100, unit: "g" },
            { name: "Milk", quantity: 100, unit: "ml" },
            { name: "Egg", quantity: 1, unit: "pc" },
            { name: "Maple Syrup", quantity: 2, unit: "tbsp" }
        ],
        nutrition: { calories: 450, carbs: 60, protein: 10, fat: 15 },
        tags: ["breakfast", "comfort-food"]
    },
    {
        title: "Caesar Salad",
        image_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
        instructions: "Chop romaine lettuce. Toss with caesar dressing, croutons, and parmesan.",
        ingredients: [
            { name: "Romaine Lettuce", quantity: 200, unit: "g" },
            { name: "Caesar Dressing", quantity: 2, unit: "tbsp" },
            { name: "Croutons", quantity: 50, unit: "g" },
            { name: "Parmesan Cheese", quantity: 20, unit: "g" }
        ],
        nutrition: { calories: 350, carbs: 15, protein: 10, fat: 28 },
        tags: ["lunch", "vegetarian"]
    },
    {
        title: "Salmon with Asparagus",
        image_url: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d",
        instructions: "Season salmon. Bake with asparagus at 200°C for 15 mins.",
        ingredients: [
            { name: "Salmon Fillet", quantity: 200, unit: "g" },
            { name: "Asparagus", quantity: 100, unit: "g" },
            { name: "Lemon", quantity: 0.5, unit: "pc" },
            { name: "Butter", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 500, carbs: 5, protein: 45, fat: 30 },
        tags: ["dinner", "keto", "healthy"]
    },
    {
        title: "Smoothie Bowl",
        image_url: "https://images.unsplash.com/photo-1626074353765-517a681e40be",
        instructions: "Blend frozen berries and banana with yogurt. Top with granola.",
        ingredients: [
            { name: "Frozen Berries", quantity: 100, unit: "g" },
            { name: "Banana", quantity: 1, unit: "pc" },
            { name: "Yogurt", quantity: 150, unit: "g" },
            { name: "Granola", quantity: 30, unit: "g" }
        ],
        nutrition: { calories: 350, carbs: 60, protein: 12, fat: 5 },
        tags: ["breakfast", "vegetarian", "refreshing"]
    },
    {
        title: "Tacos",
        image_url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
        instructions: "Cook ground beef with taco seasoning. Serve in shells with lettuce and cheese.",
        ingredients: [
            { name: "Ground Beef", quantity: 150, unit: "g" },
            { name: "Taco Shells", quantity: 3, unit: "pc" },
            { name: "Lettuce", quantity: 50, unit: "g" },
            { name: "Cheddar Cheese", quantity: 30, unit: "g" }
        ],
        nutrition: { calories: 550, carbs: 35, protein: 25, fat: 30 },
        tags: ["dinner", "mexican"]
    },
    {
        title: "Greek Yogurt Parfait",
        image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
        instructions: "Layer yogurt, honey, and nuts in a glass.",
        ingredients: [
            { name: "Greek Yogurt", quantity: 200, unit: "g" },
            { name: "Honey", quantity: 1, unit: "tbsp" },
            { name: "Walnuts", quantity: 20, unit: "g" }
        ],
        nutrition: { calories: 300, carbs: 20, protein: 18, fat: 15 },
        tags: ["breakfast", "high-protein", "vegetarian"]
    },
    {
        title: "Chicken Wrap",
        image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f",
        instructions: "Wrap grilled chicken, lettuce, and mayo in a tortilla.",
        ingredients: [
            { name: "Tortilla", quantity: 1, unit: "pc" },
            { name: "Chicken Breast", quantity: 100, unit: "g" },
            { name: "Lettuce", quantity: 50, unit: "g" },
            { name: "Mayonnaise", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 400, carbs: 30, protein: 25, fat: 18 },
        tags: ["lunch", "quick"]
    },
    {
        title: "Mushroom Risotto",
        image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
        instructions: "Cook arborio rice with broth and mushrooms slowly. Finish with parmesan.",
        ingredients: [
            { name: "Arborio Rice", quantity: 100, unit: "g" },
            { name: "Mushrooms", quantity: 100, unit: "g" },
            { name: "Vegetable Broth", quantity: 500, unit: "ml" },
            { name: "Parmesan Cheese", quantity: 30, unit: "g" }
        ],
        nutrition: { calories: 550, carbs: 80, protein: 15, fat: 18 },
        tags: ["dinner", "italian", "vegetarian"]
    },
    {
        title: "Egg Salad Sandwich",
        image_url: "https://images.unsplash.com/photo-1553909489-cd47e3b4430f",
        instructions: "Mix boiled eggs with mayo and mustard. Serve on bread.",
        ingredients: [
            { name: "Bread", quantity: 2, unit: "slice" },
            { name: "Eggs", quantity: 2, unit: "pc" },
            { name: "Mayonnaise", quantity: 1, unit: "tbsp" },
            { name: "Mustard", quantity: 1, unit: "tsp" }
        ],
        nutrition: { calories: 400, carbs: 30, protein: 18, fat: 22 },
        tags: ["lunch", "vegetarian"]
    },
    {
        title: "Fruit Salad",
        image_url: "https://images.unsplash.com/photo-1568158879083-c42bd604709d",
        instructions: "Chop seasonal fruits and mix. Add mint.",
        ingredients: [
            { name: "Apple", quantity: 1, unit: "pc" },
            { name: "Banana", quantity: 1, unit: "pc" },
            { name: "Orange", quantity: 1, unit: "pc" },
            { name: "Mint", quantity: 1, unit: "sprig" }
        ],
        nutrition: { calories: 200, carbs: 50, protein: 2, fat: 0 },
        tags: ["snack", "vegan", "healthy"]
    },
    {
        title: "Quinoa Bowl",
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        instructions: "Cook quinoa. Top with roasted veggies and tahini dressing.",
        ingredients: [
            { name: "Quinoa", quantity: 100, unit: "g" },
            { name: "Sweet Potato", quantity: 100, unit: "g" },
            { name: "Chickpeas", quantity: 100, unit: "g" },
            { name: "Tahini", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 500, carbs: 70, protein: 18, fat: 15 },
        tags: ["lunch", "vegan", "healthy"]
    },
    {
        title: "BLT Sandwich",
        image_url: "https://images.unsplash.com/photo-1553909489-cd47e3b4430f",
        instructions: "Layer bacon, lettuce, and tomato on toasted bread with mayo.",
        ingredients: [
            { name: "Bread", quantity: 2, unit: "slice" },
            { name: "Bacon", quantity: 3, unit: "slice" },
            { name: "Lettuce", quantity: 1, unit: "leaf" },
            { name: "Tomato", quantity: 2, unit: "slice" }
        ],
        nutrition: { calories: 450, carbs: 30, protein: 15, fat: 30 },
        tags: ["lunch", "classic"]
    },
    {
        title: "Pasta Primavera",
        image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
        instructions: "Toss pasta with sautéed spring vegetables and olive oil.",
        ingredients: [
            { name: "Pasta", quantity: 150, unit: "g" },
            { name: "Zucchini", quantity: 100, unit: "g" },
            { name: "Bell Pepper", quantity: 1, unit: "pc" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" }
        ],
        nutrition: { calories: 450, carbs: 65, protein: 12, fat: 15 },
        tags: ["dinner", "vegan", "italian"]
    },
    {
        title: "Chocolate Chia Pudding",
        image_url: "https://images.unsplash.com/photo-1551884831-bbf3ddd77535",
        instructions: "Mix chia seeds, milk, cocoa powder, and maple syrup. Refrigerate overnight.",
        ingredients: [
            { name: "Chia Seeds", quantity: 3, unit: "tbsp" },
            { name: "Milk", quantity: 200, unit: "ml" },
            { name: "Cocoa Powder", quantity: 1, unit: "tbsp" },
            { name: "Maple Syrup", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 300, carbs: 35, protein: 10, fat: 12 },
        tags: ["breakfast", "vegan", "healthy"]
    },
    {
        title: "Caprese Salad",
        image_url: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f",
        instructions: "Slice tomatoes and mozzarella. Arrange with basil. Drizzle with balsamic glaze.",
        ingredients: [
            { name: "Tomato", quantity: 2, unit: "pc" },
            { name: "Mozzarella Cheese", quantity: 150, unit: "g" },
            { name: "Fresh Basil", quantity: 1, unit: "bunch" },
            { name: "Balsamic Glaze", quantity: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 300, carbs: 10, protein: 15, fat: 22 },
        tags: ["lunch", "vegetarian", "italian"]
    },
    {
        title: "Shrimp Scampi",
        image_url: "https://images.unsplash.com/photo-1625937751876-4515cd8e7752",
        instructions: "Sauté shrimp with garlic, butter, and lemon. Serve over linguine.",
        ingredients: [
            { name: "Shrimp", quantity: 200, unit: "g" },
            { name: "Linguine", quantity: 150, unit: "g" },
            { name: "Butter", quantity: 2, unit: "tbsp" },
            { name: "Garlic", quantity: 3, unit: "clove" },
            { name: "Lemon", quantity: 0.5, unit: "pc" }
        ],
        nutrition: { calories: 550, carbs: 60, protein: 25, fat: 20 },
        tags: ["dinner", "pescatarian", "italian"]
    },
    {
        title: "Veggie Burger",
        image_url: "https://images.unsplash.com/photo-1520072959219-c595dc870360",
        instructions: "Grill veggie patty. Serve on bun with lettuce, tomato, and onion.",
        ingredients: [
            { name: "Veggie Patty", quantity: 1, unit: "pc" },
            { name: "Burger Bun", quantity: 1, unit: "pc" },
            { name: "Lettuce", quantity: 1, unit: "leaf" },
            { name: "Tomato", quantity: 1, unit: "slice" },
            { name: "Onion", quantity: 1, unit: "slice" }
        ],
        nutrition: { calories: 400, carbs: 50, protein: 15, fat: 12 },
        tags: ["lunch", "vegetarian", "american"]
    },
    {
        title: "Chicken Curry",
        image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
        instructions: "Cook chicken with curry paste and coconut milk. Serve with rice.",
        ingredients: [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Curry Paste", quantity: 2, unit: "tbsp" },
            { name: "Coconut Milk", quantity: 200, unit: "ml" },
            { name: "Rice", quantity: 100, unit: "g" }
        ],
        nutrition: { calories: 600, carbs: 45, protein: 30, fat: 25 },
        tags: ["dinner", "asian", "spicy"]
    },
    {
        title: "French Toast",
        image_url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929",
        instructions: "Dip bread in egg and milk mixture. Fry until golden. Serve with syrup.",
        ingredients: [
            { name: "Bread", quantity: 2, unit: "slice" },
            { name: "Egg", quantity: 1, unit: "pc" },
            { name: "Milk", quantity: 50, unit: "ml" },
            { name: "Maple Syrup", quantity: 2, unit: "tbsp" }
        ],
        nutrition: { calories: 400, carbs: 55, protein: 12, fat: 15 },
        tags: ["breakfast", "sweet", "vegetarian"]
    },
    {
        title: "Pad Thai",
        image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
        instructions: "Stir fry rice noodles with egg, peanuts, and tamarind sauce.",
        ingredients: [
            { name: "Rice Noodles", quantity: 150, unit: "g" },
            { name: "Egg", quantity: 1, unit: "pc" },
            { name: "Peanuts", quantity: 30, unit: "g" },
            { name: "Tamarind Paste", quantity: 1, unit: "tbsp" },
            { name: "Bean Sprouts", quantity: 50, unit: "g" }
        ],
        nutrition: { calories: 550, carbs: 70, protein: 15, fat: 20 },
        tags: ["dinner", "asian", "thai"]
    },
    {
        title: "Minestrone Soup",
        image_url: "https://images.unsplash.com/photo-1547592166-23acbe3a624b",
        instructions: "Simmer vegetables, beans, and pasta in tomato broth.",
        ingredients: [
            { name: "Mixed Vegetables", quantity: 200, unit: "g" },
            { name: "Kidney Beans", quantity: 100, unit: "g" },
            { name: "Pasta", quantity: 50, unit: "g" },
            { name: "Tomato Broth", quantity: 500, unit: "ml" }
        ],
        nutrition: { calories: 350, carbs: 50, protein: 12, fat: 5 },
        tags: ["lunch", "vegan", "soup"]
    },
    {
        title: "BBQ Ribs",
        image_url: "https://images.unsplash.com/photo-1544025162-d76690b67f61",
        instructions: "Slow cook ribs with BBQ sauce until tender.",
        ingredients: [
            { name: "Pork Ribs", quantity: 300, unit: "g" },
            { name: "BBQ Sauce", quantity: 100, unit: "ml" }
        ],
        nutrition: { calories: 800, carbs: 30, protein: 40, fat: 50 },
        tags: ["dinner", "american", "meat"]
    },
    {
        title: "Falafel Wrap",
        image_url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
        instructions: "Wrap falafel, hummus, and salad in pita bread.",
        ingredients: [
            { name: "Falafel", quantity: 4, unit: "pc" },
            { name: "Pita Bread", quantity: 1, unit: "pc" },
            { name: "Hummus", quantity: 2, unit: "tbsp" },
            { name: "Salad", quantity: 50, unit: "g" }
        ],
        nutrition: { calories: 450, carbs: 60, protein: 15, fat: 18 },
        tags: ["lunch", "vegetarian", "middle-eastern"]
    },
    {
        title: "Cheesecake",
        image_url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50",
        instructions: "Bake cream cheese mixture on graham cracker crust. Chill.",
        ingredients: [
            { name: "Cream Cheese", quantity: 200, unit: "g" },
            { name: "Sugar", quantity: 50, unit: "g" },
            { name: "Graham Crackers", quantity: 50, unit: "g" },
            { name: "Butter", quantity: 20, unit: "g" }
        ],
        nutrition: { calories: 600, carbs: 40, protein: 8, fat: 45 },
        tags: ["dessert", "sweet"]
    }
];
