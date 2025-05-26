import { useState } from "react";
import { CookingInstructions } from "./components/CookingInstructions";
import { VoiceCommandHandler } from "./components/VoiceCommandHandler";
import "./App.css";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [instructions, setInstructions] = useState<string[]>([
    "Preheat the oven to 350°F",
    "Mix all dry ingredients in a bowl",
    "Add wet ingredients and stir until smooth",
    "Pour into baking pan",
    "Bake for 30 minutes",
  ]);

  const handleCommand = (command: string) => {
    switch (command) {
      case "next":
        if (currentStep < instructions.length - 1) {
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
        console.log("Repeating step:", instructions[currentStep]);
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
                  {instructions[currentStep]}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Step {currentStep + 1} of {instructions.length}
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
                  disabled={currentStep === instructions.length - 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <CookingInstructions instructions={instructions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
