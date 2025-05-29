import { useState } from "react";
import { useTextToSpeech } from "../hooks/useTextToSpeech";

interface CookingInstructionsProps {
  instructions: string[];
}

export function CookingInstructions({
  instructions,
}: CookingInstructionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { isSpeaking, speak, stop, pause, resume } = useTextToSpeech();

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    speak(instructions[index]);
  };

  const handleNextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
      speak(instructions[currentStep + 1]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      speak(instructions[currentStep - 1]);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Cooking Instructions
      </h2>

      {/* Current Step Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Step {currentStep + 1} of {instructions.length}
        </h3>
        <p className="text-gray-700">{instructions[currentStep]}</p>
      </div>

      {/* Speech Controls */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => (isSpeaking ? pause() : resume())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={!isSpeaking && currentStep >= instructions.length}
        >
          {isSpeaking ? "Pause" : "Resume"}
        </button>
        <button
          onClick={stop}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          disabled={!isSpeaking}
        >
          Stop
        </button>
        <button
          onClick={handlePreviousStep}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={currentStep === 0}
        >
          Previous Step
        </button>
        <button
          onClick={handleNextStep}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={currentStep === instructions.length - 1}
        >
          Next Step
        </button>
      </div>

      {/* Full Instructions List */}
      <ol className="list-decimal list-inside space-y-2">
        {instructions.map((instruction, index) => (
          <li
            key={index}
            className={`text-gray-700 cursor-pointer p-2 rounded ${
              index === currentStep ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => handleStepClick(index)}
          >
            {instruction}
          </li>
        ))}
      </ol>
    </div>
  );
}
