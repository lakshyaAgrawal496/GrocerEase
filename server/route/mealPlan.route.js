import { Router } from 'express';
import { createMealPlan, getMealPlan, getShoppingList, addToCart, aiSuggest } from '../controllers/mealPlan.controller.js';
import auth from '../middleware/auth.js';

const mealPlanRouter = Router();

mealPlanRouter.get('/ai-suggest', aiSuggest);
mealPlanRouter.post('/', auth, createMealPlan);
mealPlanRouter.get('/:id', auth, getMealPlan);
mealPlanRouter.get('/:id/shopping-list', auth, getShoppingList);
mealPlanRouter.post('/:id/add-to-cart', auth, addToCart);

export default mealPlanRouter;
