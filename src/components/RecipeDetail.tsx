import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  instruction: string;
  duration?: number;
}

interface Recipe {
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

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: (recipeId: string) => void;
  onStartCooking: (recipe: Recipe) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onToggleFavorite,
  onStartCooking,
}) => {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTimer !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTimer, timeLeft]);

  const startTimer = (duration: number) => {
    setActiveTimer(duration);
    setTimeLeft(duration * 60); // Convert minutes to seconds
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Recipes
        </button>
        <button
          onClick={() => onToggleFavorite(recipe.id)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              recipe.isFavorite ? "text-red-500" : "text-gray-400"
            }`}
            fill={recipe.isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-gray-600 mb-6">{recipe.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-gray-500">Prep Time</p>
              <p className="text-xl font-semibold">{recipe.prepTime} min</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Cook Time</p>
              <p className="text-xl font-semibold">{recipe.cookTime} min</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Servings</p>
              <p className="text-xl font-semibold">{recipe.servings}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-6">
              {recipe.steps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-blue-500">
                        Step {step.id}:
                      </span>
                      <p className="mt-2">{step.instruction}</p>
                    </div>
                    {step.duration && (
                      <button
                        onClick={() => startTimer(step.duration!)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        {activeTimer === step.duration
                          ? formatTime(timeLeft)
                          : `Set Timer (${step.duration} min)`}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onStartCooking(recipe)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Cooking
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
