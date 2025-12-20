import { Router } from 'express';
import { searchRecipes, getRecipes, seedRecipes } from '../controllers/recipe.controller.js';

const recipeRouter = Router();

recipeRouter.get('/search', searchRecipes);
recipeRouter.get('/', getRecipes);
recipeRouter.post('/seed', seedRecipes);

export default recipeRouter;
