import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar,
    ShoppingCart,
    Sparkles,
    Plus,
    Trash2,
    ChevronRight,
    Search,
    Save,
    Loader2
} from 'lucide-react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

export default function MealPlanner() {
    const [recipes, setRecipes] = useState([]);
    const [plan, setPlan] = useState({}); // { "Mon-Breakfast": recipe }
    const [draggedRecipe, setDraggedRecipe] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [planId, setPlanId] = useState(null); // To store saved plan ID

    // Fetch recipes on mount
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await Axios({
                    ...SummaryApi.getRecipes
                });
                if (response.data.data) {
                    setRecipes(response.data.data);
                }
            } catch (error) {
                AxiosToastError(error);
            }
        };
        fetchRecipes();
    }, []);

    // --- ACTIONS ---

    const handleDragStart = (recipe) => {
        setDraggedRecipe(recipe);
    };

    const handleDrop = (day, meal) => {
        if (draggedRecipe) {
            setPlan(prev => ({
                ...prev,
                [`${day}-${meal}`]: draggedRecipe
            }));
            setDraggedRecipe(null);
        }
    };

    const removeMeal = (day, meal) => {
        const newPlan = { ...plan };
        delete newPlan[`${day}-${meal}`];
        setPlan(newPlan);
    };

    const handleAiSuggest = async () => {
        setIsAiLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.aiSuggestMealPlan
            });

            // If API returns array of IDs:
            const suggestedRecipeIds = response.data;

            // Map IDs to full recipe objects
            // Note: backend might return objects directly or IDs. 
            // My controller returns IDs currently.

            // If backend returns IDs, we need to find them in our recipes list.
            // If backend returns objects, we use them.

            let suggestedRecipes = [];
            if (suggestedRecipeIds.length > 0 && typeof suggestedRecipeIds[0] === 'string') {
                suggestedRecipes = recipes.filter(r => suggestedRecipeIds.includes(r._id));
            } else {
                suggestedRecipes = suggestedRecipeIds;
            }

            const newPlan = {};
            let idx = 0;
            // Simple round-robin distribution
            DAYS.forEach(day => {
                MEALS.forEach(meal => {
                    if (idx < suggestedRecipes.length) {
                        newPlan[`${day}-${meal}`] = suggestedRecipes[idx];
                        idx++;
                    }
                });
            });
            setPlan(newPlan);

            toast.success("AI generated a plan for you!");
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const savePlan = async () => {
        try {
            // Convert plan object to array for backend
            const items = Object.entries(plan).map(([key, recipe]) => {
                const [day, meal] = key.split('-');
                return {
                    day,
                    meal: meal.toLowerCase(), // backend expects lowercase
                    recipeId: recipe._id
                };
            });

            const response = await Axios({
                ...SummaryApi.createMealPlan,
                data: {
                    weekStart: new Date(), // Should be selected week
                    items
                }
            });

            if (response.data) {
                setPlanId(response.data._id);
                toast.success("Meal plan saved!");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleAddToCart = async () => {
        if (!planId) {
            toast.error("Please save the plan first!");
            return;
        }
        try {
            const response = await Axios({
                ...SummaryApi.addMealPlanToCart,
                url: SummaryApi.addMealPlanToCart.url.replace(':id', planId)
            });
            toast.success("Items added to cart!");
            setShowShoppingList(false);
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const calculateDailyNutrition = (day) => {
        let cals = 0;
        let protein = 0;
        MEALS.forEach(meal => {
            const recipe = plan[`${day}-${meal}`];
            if (recipe && recipe.nutrition) {
                cals += recipe.nutrition.calories || 0;
                protein += recipe.nutrition.protein || 0;
            }
        });
        return { cals, protein };
    };

    const shoppingList = useMemo(() => {
        const list = {};
        Object.values(plan).forEach(recipe => {
            if (recipe.ingredients) {
                recipe.ingredients.forEach(ing => {
                    if (list[ing.name]) {
                        list[ing.name].quantity += ing.quantity;
                    } else {
                        list[ing.name] = { ...ing };
                    }
                });
            }
        });
        return Object.values(list);
    }, [plan]);

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER ---

    if (showShoppingList) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShoppingCart className="text-green-600" /> Shopping List
                        </h2>
                        <button onClick={() => setShowShoppingList(false)} className="text-gray-400 hover:text-gray-600">Close</button>
                    </div>

                    <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
                        {shoppingList.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Your plan is empty. Add meals first!</p>
                        ) : (
                            shoppingList.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="text-gray-800 font-semibold text-sm bg-white px-2 py-1 rounded border shadow-sm">
                                        {item.quantity} {item.unit}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowShoppingList(false)}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                        >
                            Back to Plan
                        </button>
                        <button
                            className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 transition flex justify-center items-center gap-2"
                            onClick={handleAddToCart}
                        >
                            Add to Cart <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans text-slate-800">

            {/* SIDEBAR - RECIPES */}
            <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                        <Calendar className="text-indigo-600" /> Meal Planner
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Drag recipes to the calendar</p>
                </div>

                <div className="p-4 bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredRecipes.map(recipe => (
                        <div
                            key={recipe._id}
                            draggable
                            onDragStart={() => handleDragStart(recipe)}
                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-indigo-200 transition group flex gap-3"
                        >
                            <img src={recipe.image_url} alt={recipe.title} className="w-16 h-16 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-sm truncate">{recipe.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                    <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">{recipe.nutrition?.calories} cal</span>
                                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{recipe.nutrition?.protein}g prot</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleAiSuggest}
                        disabled={isAiLoading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
                    >
                        {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {isAiLoading ? 'Thinking...' : 'AI Auto-Fill Week'}
                    </button>
                </div>
            </div>

            {/* MAIN CALENDAR AREA */}
            <div className="flex-1 p-6 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Weekly Plan</h2>
                        <p className="text-gray-500">November 25 - December 01</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={savePlan}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium transition"
                        >
                            <Save size={18} /> Save Plan
                        </button>
                        <button
                            onClick={() => setShowShoppingList(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md shadow-green-200 flex items-center gap-2 font-medium transition"
                        >
                            <ShoppingCart size={18} /> Generate List
                        </button>
                    </div>
                </header>

                {/* CALENDAR GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {DAYS.map(day => {
                        const { cals, protein } = calculateDailyNutrition(day);
                        const isTargetMet = cals > 1500; // Mock target

                        return (
                            <div key={day} className="flex flex-col gap-3">
                                <div className={`p-3 rounded-xl border ${isTargetMet ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200'}`}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-800">{day}</h3>
                                        <span className={`text-xs font-medium ${isTargetMet ? 'text-green-600' : 'text-gray-500'}`}>
                                            {cals} cal
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isTargetMet ? 'bg-green-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${Math.min((cals / 2500) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {MEALS.map(meal => {
                                        const recipe = plan[`${day}-${meal}`];
                                        return (
                                            <div
                                                key={meal}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={() => handleDrop(day, meal)}
                                                className={`
                          relative group min-h-[100px] rounded-xl border-2 border-dashed transition-all duration-200
                          ${recipe
                                                        ? 'bg-white border-transparent shadow-sm hover:shadow-md'
                                                        : 'border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50'
                                                    }
                        `}
                                            >
                                                <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider pointer-events-none">
                                                    {meal}
                                                </div>

                                                {recipe ? (
                                                    <div className="p-2 h-full flex flex-col pt-6">
                                                        <img src={recipe.image_url} className="w-full h-24 object-cover rounded-lg mb-2" alt="food" />
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm leading-tight text-gray-800 mb-1">{recipe.title}</p>
                                                            <p className="text-xs text-gray-600">{recipe.nutrition?.calories} cal</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeMeal(day, meal)}
                                                            className="absolute top-1 right-1 p-1.5 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-400">
                                                        <Plus size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
