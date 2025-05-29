import { useState, useCallback } from 'react';

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const initializeSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      setSpeechSynthesis(synthesis);
      return synthesis;
    }
    return null;
  }, []);

  const speak = useCallback((text: string) => {
    const synthesis = speechSynthesis || initializeSpeech();
    if (!synthesis) return;

    // Stop any ongoing speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setCurrentUtterance(utterance);
    synthesis.speak(utterance);
  }, [speechSynthesis, initializeSpeech]);

  const stop = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechSynthesis]);

  const pause = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.pause();
      setIsSpeaking(false);
    }
  }, [speechSynthesis]);

  const resume = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.resume();
      setIsSpeaking(true);
    }
  }, [speechSynthesis]);

  return {
    isSpeaking,
    speak,
    stop,
    pause,
    resume,
  };
} 