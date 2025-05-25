import { useState } from "react";
import { CookingInstructions } from "./components/CookingInstructions";
import "./App.css";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [instructions, setInstructions] = useState<string[]>([]);

  const toggleListening = () => {
    setIsListening(!isListening);
    // For now, we'll just add a sample instruction when toggling
    if (!isListening) {
      setInstructions((prev) => [...prev, "Sample cooking instruction"]);
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
            <div className="text-center">
              <button
                onClick={toggleListening}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isListening ? "Stop Listening" : "Start Listening"}
              </button>
              <p className="mt-4 text-lg text-gray-600">
                {isListening
                  ? "Listening for your cooking instructions..."
                  : "Click the button to start"}
              </p>
            </div>

            {instructions.length > 0 && (
              <CookingInstructions instructions={instructions} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
