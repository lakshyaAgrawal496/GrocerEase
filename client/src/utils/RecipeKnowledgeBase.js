export const recipeKnowledgeBase = {
    recipes: {
        pasta: {
            title: "Classic Tomato Basil Pasta",
            ingredients: ["Premium Penne Pasta", "Authentic Pasta Sauce", "Aged Parmesan Cheese", "Fresh Tomatoes (1kg)", "Organic Spinach"],
            instructions: [
                "Boil the penne pasta in salted water until al dente.",
                "In a separate pan, heat the pasta sauce and add chopped fresh tomatoes.",
                "Mix the drained pasta with the sauce.",
                "Garnish with fresh spinach and grated parmesan cheese.",
                "Serve hot and enjoy!"
            ],
            tags: ["pasta", "italian", "dinner", "lunch"]
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
            tags: ["pizza", "italian", "snack", "dinner"]
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
            tags: ["salad", "healthy", "vegetable", "diet"]
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
            tags: ["sandwich", "breakfast", "snack", "lunch"]
        }
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

        // Find matching products from the database
        const recommendations = [];
        const allProducts = Object.values(productDatabase).flat();

        recipe.ingredients.forEach(ingredientName => {
            const match = allProducts.find(p => p.name === ingredientName);
            if (match) recommendations.push(match);
        });

        return recommendations;
    },

    generateConversationalResponse(query, context) {
        // Greetings
        if (query.match(/\b(hi|hello|hey|greetings)\b/i)) {
            return {
                text: "Hello! I'm Blinky. I can help you find recipes, track orders, or suggest products. What are you in the mood for today?",
                context: { ...context, lastTopic: 'greeting' }
            };
        }

        // Recipe Query
        if (query.match(/\b(recipe|cook|make|prepare|how to)\b/i)) {
            const recipe = this.findRecipe(query);
            if (recipe) {
                const steps = recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
                return {
                    text: `🍽️ **${recipe.title}**\n\nHere's how to make it:\n${steps}\n\nWould you like me to recommend the ingredients for this?`,
                    context: { ...context, lastTopic: 'recipe', topicDetail: recipe.id }
                };
            }
            return {
                text: "I'd love to help you cook! I know recipes for Pasta, Pizza, Salad, and Sandwiches. Which one interests you?",
                context: context
            };
        }

        // Context-Aware Recommendation Request
        if (query.match(/\b(recommend|suggest|ingredients|buy|need|cart)\b/i)) {
            if (context.lastTopic === 'recipe' && context.topicDetail) {
                return {
                    text: `Great choice! Here are the fresh ingredients you'll need for the **${this.recipes[context.topicDetail].title}**:`,
                    action: 'SHOW_RECIPE_INGREDIENTS',
                    context: { ...context, lastTopic: 'recommendation' } // Clear recipe context after showing
                };
            }
            // Fallback for general recommendation if no context
            return {
                text: "I can suggest products based on what you want to cook. Ask me for a recipe first (like 'How to make pasta'), and then I can help you get the ingredients!",
                context: context
            };
        }

        // General Fallback
        return {
            text: "I'm listening! You can ask me for recipes, order status, or just chat. Try asking 'How to make a salad'!",
            context: context
        };
    }
};
