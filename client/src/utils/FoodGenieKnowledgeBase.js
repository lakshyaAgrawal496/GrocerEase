export const foodGenieKnowledgeBase = {
    recipes: {
        pasta: {
            title: "Classic Tomato Basil Pasta",
            ingredients: ["Premium Penne Pasta", "Authentic Pasta Sauce", "Aged Parmesan Cheese", "Fresh Tomatoes (1kg)", "Organic Spinach"],
            instructions: [
                "Boil the penne pasta in salted water until al dente (approx 10-12 mins).",
                "In a separate pan, heat the pasta sauce and add chopped fresh tomatoes.",
                "Mix the drained pasta with the sauce.",
                "Garnish with fresh spinach and grated parmesan cheese.",
                "Serve hot and enjoy!"
            ],
            tags: ["pasta", "italian", "dinner", "lunch", "tomato", "basil"],
            time: "20 mins",
            difficulty: "Easy"
        },
        pizza: {
            title: "Homemade Margherita Pizza",
            ingredients: ["Whole Wheat Bread", "Authentic Pasta Sauce", "Fresh Tomatoes (1kg)", "Aged Parmesan Cheese"],
            instructions: [
                "Use the bread as a quick base or prepare fresh dough.",
                "Spread a generous layer of pasta sauce.",
                "Top with sliced tomatoes and grated cheese.",
                "Bake at 200°C for 10-15 minutes until crispy.",
                "Add fresh basil if available."
            ],
            tags: ["pizza", "italian", "snack", "dinner", "cheese"],
            time: "25 mins",
            difficulty: "Medium"
        },
        salad: {
            title: "Fresh Garden Salad",
            ingredients: ["Fresh Tomatoes (1kg)", "Organic Spinach", "Red Onions (1kg)"],
            instructions: [
                "Wash all vegetables thoroughly.",
                "Chop tomatoes, onions, and spinach.",
                "Toss everything in a bowl with olive oil and lemon juice.",
                "Season with salt and pepper.",
                "Add cheese or nuts for extra crunch."
            ],
            tags: ["salad", "healthy", "vegetable", "diet", "vegan", "keto"],
            time: "10 mins",
            difficulty: "Easy"
        },
        sandwich: {
            title: "Healthy Veggie Sandwich",
            ingredients: ["Whole Wheat Bread", "Fresh Tomatoes (1kg)", "Red Onions (1kg)", "Aged Parmesan Cheese"],
            instructions: [
                "Toast the bread slices until golden brown.",
                "Layer sliced tomatoes and onions.",
                "Add a slice of cheese.",
                "Grill for 2 minutes or serve fresh."
            ],
            tags: ["sandwich", "breakfast", "snack", "lunch"],
            time: "10 mins",
            difficulty: "Easy"
        },
        butter_chicken: {
            title: "Quick Butter Chicken (Cheat Version)",
            ingredients: ["Authentic Pasta Sauce", "Organic Fresh Milk", "Red Onions (1kg)"], // Simplified for demo
            instructions: [
                "Marinate chicken (if you have it) in yogurt and spices.",
                "Sauté onions until golden.",
                "Add pasta sauce (as a tomato base) and milk/cream.",
                "Simmer until thick and creamy.",
                "Serve with naan or rice."
            ],
            tags: ["butter chicken", "indian", "dinner", "curry"],
            time: "30 mins",
            difficulty: "Medium"
        }
    },

    substitutes: {
        "baking powder": ["1/4 tsp baking soda + 1/2 tsp cream of tartar", "Self-rising flour"],
        "egg": ["1/4 cup applesauce", "1 mashed banana", "1 tbsp flaxseed + 3 tbsp water"],
        "milk": ["Almond milk", "Soy milk", "Oat milk", "Water + Butter"],
        "butter": ["Olive oil", "Coconut oil", "Applesauce (for baking)"],
        "cream": ["Milk + Butter", "Coconut cream", "Cashew cream"]
    },

    dietPlans: {
        keto: ["Fresh Garden Salad (add cheese)", "Omelet with Spinach", "Grilled Chicken with Veggies"],
        vegan: ["Fresh Garden Salad", "Pasta with Tomato Sauce (no cheese)", "Fruit Smoothie"],
        high_protein: ["Grilled Chicken", "Egg Salad", "Protein Shake", "Lentil Soup"]
    },

    cookingTips: {
        rice: "Rinse rice until water runs clear to remove excess starch for fluffy grains.",
        pasta: "Save some pasta water before draining to make your sauce silky.",
        veggies: "Roast vegetables at high heat (400°F/200°C) for better flavor.",
        freshness: "Store herbs in a glass of water like flowers to keep them fresh longer."
    },

    findRecipe(query) {
        const lowerQuery = query.toLowerCase();
        for (const [key, recipe] of Object.entries(this.recipes)) {
            if (lowerQuery.includes(key) || recipe.tags.some(tag => lowerQuery.includes(tag))) {
                return { id: key, ...recipe };
            }
        }
        return null;
    },

    getIngredients(recipeId, productDatabase) {
        const recipe = this.recipes[recipeId];
        if (!recipe) return [];

        const recommendations = [];
        const allProducts = Object.values(productDatabase).flat();

        recipe.ingredients.forEach(ingredientName => {
            const match = allProducts.find(p => p.name === ingredientName);
            if (match) recommendations.push(match);
        });

        return recommendations;
    },

    generateResponse(query, context) {
        const lowerQuery = query.toLowerCase();

        // 1. Grocery Search Intent (JSON Action)
        if (lowerQuery.match(/\b(buy|shop|get|find|need|groceries for)\b/i) && !lowerQuery.includes("recipe")) {
            // Extract potential items (simplified NLP)
            // Remove the trigger phrase and common prepositions like 'for'
            let items = lowerQuery.replace(/\b(buy|shop|get|find|need|groceries|show me)\b/gi, "").trim();
            items = items.replace(/^\b(for|of)\b/g, "").trim(); // Remove leading 'for' or 'of'

            if (items.length > 2) {
                return {
                    text: `I can help you find these items. Calling grocery_search API...`,
                    action: "grocery_search",
                    query: items,
                    context: { ...context, lastTopic: 'shopping' }
                };
            }
        }

        // 2. Substitutes
        if (lowerQuery.includes("substitute") || lowerQuery.includes("replace")) {
            for (const [ingredient, subs] of Object.entries(this.substitutes)) {
                if (lowerQuery.includes(ingredient)) {
                    return {
                        text: `🔄 **Substitutes for ${ingredient}:**\n\n${subs.map(s => `• ${s}`).join('\n')}\n\nNeed anything else?`,
                        context: context
                    };
                }
            }
        }

        // 3. Diet Plans
        if (lowerQuery.includes("keto") || lowerQuery.includes("vegan") || lowerQuery.includes("protein")) {
            const diet = lowerQuery.includes("keto") ? "keto" : lowerQuery.includes("vegan") ? "vegan" : "high_protein";
            return {
                text: `🥗 **${diet.toUpperCase().replace('_', ' ')} Meal Ideas:**\n\n${this.dietPlans[diet].map(m => `• ${m}`).join('\n')}\n\nWould you like a recipe for any of these?`,
                context: context
            };
        }

        // 4. Cooking Tips / Questions
        if (lowerQuery.includes("tip") || lowerQuery.includes("trick") || lowerQuery.includes("how to store") || lowerQuery.includes("fresh")) {
            const tipKey = Object.keys(this.cookingTips).find(k => lowerQuery.includes(k)) || "freshness";
            return {
                text: `💡 **FoodGenie Tip:**\n\n${this.cookingTips[tipKey]}`,
                context: context
            };
        }

        // 5. Recipe Query
        if (lowerQuery.match(/\b(recipe|cook|make|prepare|how to)\b/i)) {
            const recipe = this.findRecipe(lowerQuery);
            if (recipe) {
                const steps = recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
                return {
                    text: `🍽️ **${recipe.title}**\n⏱️ Time: ${recipe.time} | 💪 Difficulty: ${recipe.difficulty}\n\n**Instructions:**\n${steps}\n\nWould you like to buy the ingredients for this?`,
                    context: { ...context, lastTopic: 'recipe', topicDetail: recipe.id }
                };
            }
            return {
                text: "I'd love to help you cook! I know recipes for Pasta, Pizza, Salad, Sandwiches, and Butter Chicken. Which one interests you?",
                context: context
            };
        }

        // 6. Context-Aware Ingredient Request
        if (lowerQuery.match(/\b(ingredients|items|what do i need)\b/i)) {
            if (context.lastTopic === 'recipe' && context.topicDetail) {
                return {
                    text: `Here are the ingredients for **${this.recipes[context.topicDetail].title}**:`,
                    action: 'SHOW_RECIPE_INGREDIENTS',
                    context: { ...context, lastTopic: 'shopping' }
                };
            }
        }

        // 7. General Fallback
        return {
            text: "👋 I'm **FoodGenie**, your intelligent food assistant!\n\nI can help you with:\n• 🍳 Recipes & Cooking Instructions\n• 🔄 Ingredient Substitutes\n• 🥗 Diet Meal Plans\n• 🛒 Finding Groceries\n\nTry asking: 'Give me a pasta recipe' or 'Substitutes for egg'.",
            context: context
        };
    }
};
