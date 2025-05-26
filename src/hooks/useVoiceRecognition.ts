import { useState, useEffect, useCallback } from 'react';

interface UseVoiceRecognitionProps {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecognition({ onResult, onError }: UseVoiceRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (onResult) {
          onResult(transcript);
        }
      };

      recognition.onerror = (event) => {
        if (onError) {
          onError(event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      if (onError) {
        onError('Speech recognition is not supported in this browser.');
      }
    }
  }, [onResult, onError]);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    isListening,
    startListening,
    stopListening,
    isSupported: !!recognition
  };
} 