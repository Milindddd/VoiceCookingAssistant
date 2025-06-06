export interface Step {
  id: number;
  instruction: string;
  duration?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  steps: Step[];
  isFavorite: boolean;
}

export interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  favorites: string[];
  isLoading: boolean;
  error: string | null;
} 