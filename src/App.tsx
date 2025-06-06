import { useState, useEffect } from "react";
import { CookingInstructions } from "./components/CookingInstructions";
import { VoiceCommandHandler } from "./components/VoiceCommandHandler";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";
import { Recipe, RecipeState } from "./types/recipe";
import "./App.css";

// Sample recipes data
const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Chocolate Chip Cookies",
    description:
      "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    prepTime: 15,
    cookTime: 10,
    servings: 24,
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup (2 sticks) butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips",
    ],
    steps: [
      {
        id: 1,
        instruction: "Preheat oven to 375°F (190°C).",
      },
      {
        id: 2,
        instruction: "Mix flour, baking soda, and salt in a small bowl.",
      },
      {
        id: 3,
        instruction:
          "Beat butter, granulated sugar, and brown sugar until creamy.",
      },
      {
        id: 4,
        instruction: "Add eggs and vanilla; beat well.",
      },
      {
        id: 5,
        instruction: "Gradually mix in flour mixture.",
      },
      {
        id: 6,
        instruction: "Stir in chocolate chips.",
      },
      {
        id: 7,
        instruction: "Drop rounded tablespoons onto ungreased baking sheets.",
      },
      {
        id: 8,
        instruction: "Bake for 9 to 11 minutes or until golden brown.",
        duration: 11,
      },
    ],
    isFavorite: false,
  },
];

function App() {
  const [recipeState, setRecipeState] = useState<RecipeState>({
    recipes: sampleRecipes,
    selectedRecipe: null,
    favorites: [],
    isLoading: false,
    error: null,
  });
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setRecipeState((prev) => ({
        ...prev,
        favorites: JSON.parse(savedFavorites),
      }));
    }
  }, []);

  const handleToggleFavorite = (recipeId: string) => {
    setRecipeState((prev) => {
      const newFavorites = prev.favorites.includes(recipeId)
        ? prev.favorites.filter((id) => id !== recipeId)
        : [...prev.favorites, recipeId];

      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(newFavorites));

      return {
        ...prev,
        favorites: newFavorites,
        recipes: prev.recipes.map((recipe) => ({
          ...recipe,
          isFavorite: newFavorites.includes(recipe.id),
        })),
      };
    });
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setRecipeState((prev) => ({
      ...prev,
      selectedRecipe: recipe,
    }));
  };

  const handleStartCooking = (recipe: Recipe) => {
    setRecipeState((prev) => ({
      ...prev,
      selectedRecipe: recipe,
    }));
    setIsCookingMode(true);
    setCurrentStep(0);
  };

  const handleBack = () => {
    setRecipeState((prev) => ({
      ...prev,
      selectedRecipe: null,
    }));
    setIsCookingMode(false);
  };

  const handleCommand = (command: string) => {
    if (!recipeState.selectedRecipe) return;

    switch (command) {
      case "next":
        if (currentStep < recipeState.selectedRecipe.steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
        break;
      case "previous":
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
        break;
      case "repeat":
        // In a real app, we would use text-to-speech here
        console.log(
          "Repeating step:",
          recipeState.selectedRecipe.steps[currentStep].instruction
        );
        break;
      default:
        if (command.startsWith("timer")) {
          const minutes = command.split(" ")[1];
          console.log(`Setting timer for ${minutes} minutes`);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Voice Cooking Assistant
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isCookingMode && recipeState.selectedRecipe ? (
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center mb-8">
                <VoiceCommandHandler onCommand={handleCommand} />
              </div>

              <div className="mt-8">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Current Step
                  </h2>
                  <p className="text-lg text-gray-700 mt-2">
                    {recipeState.selectedRecipe.steps[currentStep].instruction}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    Step {currentStep + 1} of{" "}
                    {recipeState.selectedRecipe.steps.length}
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleCommand("previous")}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleCommand("next")}
                    disabled={
                      currentStep ===
                      recipeState.selectedRecipe.steps.length - 1
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              <CookingInstructions
                instructions={recipeState.selectedRecipe.steps.map(
                  (step) => step.instruction
                )}
              />
            </div>
          </div>
        ) : recipeState.selectedRecipe ? (
          <RecipeDetail
            recipe={recipeState.selectedRecipe}
            onBack={handleBack}
            onToggleFavorite={handleToggleFavorite}
            onStartCooking={handleStartCooking}
          />
        ) : (
          <RecipeList
            recipes={recipeState.recipes}
            onSelectRecipe={handleSelectRecipe}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>
    </div>
  );
}

export default App;
