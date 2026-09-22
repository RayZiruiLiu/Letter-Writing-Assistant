import { useState, useRef, useEffect, useCallback } from "react";

// Web Speech API interface declarations
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export function useVoiceInput(onSpeechResult?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize SpeechRecognition
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcriptPiece + " ";
          } else {
            currentInterim += transcriptPiece;
          }
        }

        setInterimTranscript(currentInterim);
        if (finalChunk.trim() && onSpeechResult) {
          onSpeechResult(finalChunk);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser.");
        } else if (event.error !== "no-speech") {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error("SpeechRecognition initialization failed:", err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [onSpeechResult]);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    if (!recognitionRef.current) {
      setErrorMessage("Speech recognition is not supported in this browser. You can type directly.");
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      console.warn("Speech start exception:", e);
      // Already running or busy
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Speech stop exception:", e);
      }
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    interimTranscript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
  };
}
