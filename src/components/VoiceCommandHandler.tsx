import { useState, useEffect } from "react";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

interface VoiceCommandHandlerProps {
  onCommand: (command: string) => void;
}

export function VoiceCommandHandler({ onCommand }: VoiceCommandHandlerProps) {
  const [error, setError] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState<string>("");

  const { isListening, startListening, stopListening, isSupported } =
    useVoiceRecognition({
      onResult: (text) => {
        setLastCommand(text);
        processCommand(text);
      },
      onError: (error) => {
        setError(error);
      },
    });

  const processCommand = (text: string) => {
    const command = text.toLowerCase().trim();

    // Basic command processing
    if (command.includes("next step")) {
      onCommand("next");
    } else if (
      command.includes("previous step") ||
      command.includes("go back")
    ) {
      onCommand("previous");
    } else if (command.includes("repeat")) {
      onCommand("repeat");
    } else if (command.includes("timer")) {
      const minutes = command.match(/\d+/);
      if (minutes) {
        onCommand(`timer ${minutes[0]}`);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-red-600">
        Voice recognition is not supported in your browser.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
            isListening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
      </div>

      {error && <div className="text-red-600 text-center">Error: {error}</div>}

      {lastCommand && (
        <div className="text-gray-600 text-center">
          Last command: {lastCommand}
        </div>
      )}
    </div>
  );
}
