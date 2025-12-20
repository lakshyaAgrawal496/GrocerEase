export const foodGenieChatbotKnowledgeBase = {
    // --- 1. Food Knowledge Base (Simulated Internet Data) ---
    recipes: {
        oats: [
            {
                title: "Classic 5-Min Oatmeal",
                time: "5 mins",
                difficulty: "Easy",
                ingredients: ["Rolled Oats", "Milk (or Water)", "Honey", "Banana", "Cinnamon"],
                steps: [
                    "Boil 1 cup of milk/water in a pan.",
                    "Add 1/2 cup rolled oats and reduce heat.",
                    "Cook for 3-5 mins until creamy.",
                    "Top with sliced banana, honey, and a pinch of cinnamon."
                ],
                tips: "Use milk for a creamier texture. Add chia seeds for extra protein."
            },
            {
                title: "Overnight Oats (No Cook)",
                time: "5 mins prep + Overnight",
                difficulty: "Very Easy",
                ingredients: ["Rolled Oats", "Yogurt", "Milk", "Chia Seeds", "Berries"],
                steps: [
                    "Mix oats, yogurt, milk, and chia seeds in a jar.",
                    "Refrigerate overnight (at least 4 hours).",
                    "Top with fresh berries before eating."
                ],
                tips: "Great for meal prep! Lasts 3 days in the fridge."
            },
            {
                title: "Savory Masala Oats",
                time: "10 mins",
                difficulty: "Easy",
                ingredients: ["Rolled Oats", "Onion", "Tomato", "Green Chili", "Turmeric", "Salt"],
                steps: [
                    "Sauté chopped onion, tomato, and chili in oil.",
                    "Add turmeric and salt.",
                    "Add oats and water. Cook until soft.",
                    "Garnish with coriander."
                ],
                tips: "Add peas and carrots for a healthier version."
            }
        ],
        pasta: [
            {
                title: "Creamy Tomato Basil Pasta",
                time: "20 mins",
                difficulty: "Medium",
                ingredients: ["Penne Pasta", "Pasta Sauce", "Fresh Cream", "Garlic", "Basil", "Parmesan"],
                steps: [
                    "Boil pasta in salted water until al dente.",
                    "Sauté garlic in olive oil. Add pasta sauce and simmer.",
                    "Stir in fresh cream for richness.",
                    "Toss pasta in the sauce. Top with basil and parmesan."
                ],
                tips: "Save some pasta water to adjust sauce consistency."
            },
            {
                title: "Aglio e Olio (Garlic & Oil)",
                time: "15 mins",
                difficulty: "Easy",
                ingredients: ["Spaghetti", "Olive Oil", "Garlic", "Chili Flakes", "Parsley"],
                steps: [
                    "Boil spaghetti.",
                    "Sauté lots of sliced garlic in generous olive oil (low heat).",
                    "Add chili flakes. Toss pasta in the oil.",
                    "Finish with fresh parsley and parmesan."
                ],
                tips: "Don't burn the garlic! It should be golden, not brown."
            }
        ],
        chicken: [
            {
                title: "Lemon Garlic Butter Chicken",
                time: "25 mins",
                difficulty: "Medium",
                ingredients: ["Chicken Breast", "Butter", "Lemon Juice", "Garlic", "Thyme"],
                steps: [
                    "Season chicken with salt and pepper.",
                    "Sear in a pan with butter until golden.",
                    "Add minced garlic, thyme, and lemon juice.",
                    "Simmer until chicken is cooked through."
                ],
                tips: "Serve with roasted veggies or mashed potatoes."
            },
            {
                title: "Classic Chicken Curry",
                time: "40 mins",
                difficulty: "Medium",
                ingredients: ["Chicken", "Onion", "Tomato", "Ginger Garlic Paste", "Curry Powder", "Yogurt"],
                steps: [
                    "Marinate chicken in yogurt and spices.",
                    "Sauté onions, ginger-garlic paste, and tomatoes.",
                    "Add chicken and cook until sealed.",
                    "Add water/stock and simmer until tender."
                ],
                tips: "Use bone-in chicken for better flavor."
            }
        ],
        biryani: [
            {
                title: "Quick Pressure Cooker Biryani",
                time: "45 mins",
                difficulty: "Medium",
                ingredients: ["Basmati Rice", "Chicken/Veg", "Biryani Masala", "Yogurt", "Fried Onions", "Mint"],
                steps: [
                    "Marinate meat/veg with yogurt and masala.",
                    "Sauté whole spices and onions in a cooker.",
                    "Layer marinated mix and soaked rice.",
                    "Add water (1:1.5 ratio), mint, and ghee.",
                    "Cook for 2 whistles. Let pressure release naturally."
                ],
                tips: "Soak rice for 20 mins for fluffy grains."
            }
        ],
        cookies: [
            {
                title: "Choco Chip Cookies",
                time: "30 mins",
                difficulty: "Medium",
                ingredients: ["Flour", "Butter", "Sugar", "Chocolate Chips", "Egg", "Vanilla"],
                steps: [
                    "Cream butter and sugar together.",
                    "Beat in egg and vanilla.",
                    "Mix in flour and baking soda.",
                    "Fold in chocolate chips.",
                    "Bake at 180°C for 10-12 mins."
                ],
                tips: "Don't overbake! They continue cooking on the hot tray."
            }
        ]
    },

    // --- 2. Customer Support Knowledge Base ---
    support: {
        late_order: "I'm sorry your order is delayed! 🕒\n\nI can check the live status for you. Please share your **Order ID**.\n\nUsually, delays happen due to high traffic or weather conditions. I'll make sure it gets prioritized!",
        refund: "I can help with that. 💰\n\nFor a refund, please tell me:\n1. Which item is the issue?\n2. Is it damaged, missing, or expired?\n\nOnce you confirm, I'll process it instantly to your wallet.",
        payment_issue: "Payment failed? Don't worry. 💳\n\nIf the amount was deducted, it will be auto-refunded within 24-48 hours.\n\nYou can try paying via UPI or Cash on Delivery for now.",
        missing_item: "Oh no! I apologize for the missing item. 🍎\n\nPlease let me know exactly what's missing, and I'll either send it right away or refund the amount.",
        contact_support: "You can reach our human support team at **support@grocerease.com** or call **1800-GROCER** (9 AM - 9 PM)."
    },

    // --- 3. Core Logic ---

    processQuery(query) {
        const lowerQuery = query.toLowerCase();

        // A. Customer Support Intent
        if (this.isSupportQuery(lowerQuery)) {
            return this.generateSupportResponse(lowerQuery);
        }

        // B. Food/Recipe Intent (Default "Always Help")
        return this.generateFoodResponse(lowerQuery);
    },

    isSupportQuery(query) {
        const supportKeywords = ['order', 'refund', 'late', 'missing', 'damaged', 'payment', 'money', 'wallet', 'support', 'customer care', 'complaint', 'return'];
        return supportKeywords.some(k => query.includes(k));
    },

    generateSupportResponse(query) {
        if (query.includes('late') || query.includes('delay') || query.includes('where')) return { text: this.support.late_order };
        if (query.includes('refund') || query.includes('return')) return { text: this.support.refund };
        if (query.includes('payment') || query.includes('failed') || query.includes('money')) return { text: this.support.payment_issue };
        if (query.includes('missing') || query.includes('item')) return { text: this.support.missing_item };

        return { text: "I'm here to help with your order! You can ask about:\n• Order Status\n• Refunds\n• Missing Items\n• Payments" };
    },

    generateFoodResponse(query) {
        // 1. Identify Ingredient/Dish
        const key = Object.keys(this.recipes).find(k => query.includes(k));

        // 2. If known recipe found
        if (key) {
            const recipes = this.recipes[key];
            const recipeList = recipes.map((r, i) =>
                `**${i + 1}) ${r.title}**\n⏱️ ${r.time} | 💪 ${r.difficulty}\n📝 *${r.steps[0]}..*`
            ).join('\n\n');

            // Collect ALL unique ingredients for grocery search
            const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients))].join(', ');

            return {
                text: `👨‍🍳 **FoodGenie Chatbot Ideas for "${key}":**\n\n${recipeList}\n\n💡 **Tip:** ${recipes[0].tips}\n\n👇 **I've found the ingredients for you below:**`,
                action: "grocery_search",
                query: allIngredients
            };
        }

        // 3. Smart Fallback (Simulated Internet Search)
        // Even if we don't have the recipe in our hardcoded DB, we pretend to be helpful and search groceries.
        // Extract potential food terms (simplified)
        const cleanQuery = query.replace(/\b(recipe|how to make|cook|ingredients|for)\b/gi, "").trim();

        if (cleanQuery.length > 2) {
            return {
                text: `👨‍🍳 **Cooking "${cleanQuery}"? Great choice!**\n\nHere is a quick guide:\n1. Prep your ingredients.\n2. Cook with love!\n3. Season to taste.\n\n(I'm adding more detailed recipes for this soon!)\n\n👇 **Here are the ingredients you might need:**`,
                action: "grocery_search",
                query: cleanQuery // Search for the dish name itself (e.g., "Butter Chicken" -> finds butter, chicken, masala)
            };
        }

        return {
            text: "👋 **I'm FoodGenie Chatbot!**\n\nI can help you cook *anything* or fix order issues.\n\nTry asking:\n• 'Oats recipes'\n• 'How to make pasta'\n• 'My order is late'"
        };
    }
};
