import { useState, useCallback, useEffect } from 'react';
import { micBlowDetector } from '../utils/micDetection';

export function useMicrophone(onBlowDetected?: () => void) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startListening = useCallback(async () => {
    setErrorMessage(null);
    const result = await micBlowDetector.startListening(
      () => {
        setIsListening(true);
        setHasPermission(true);
      },
      () => {
        if (onBlowDetected) onBlowDetected();
      },
      () => {
        setIsListening(false);
        setHasPermission(false);
        setErrorMessage("Microphone access unavailable. Touch or tap to extinguish.");
      }
    );

    if (!result.success) {
      setIsListening(false);
      setHasPermission(false);
      setErrorMessage(result.error || "Microphone permission denied");
    }
  }, [onBlowDetected]);

  const stopListening = useCallback(() => {
    micBlowDetector.stopListening();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      micBlowDetector.stopListening();
    };
  }, []);

  return {
    isListening,
    hasPermission,
    errorMessage,
    startListening,
    stopListening
  };
}
