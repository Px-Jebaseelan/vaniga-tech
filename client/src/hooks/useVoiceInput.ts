import { useState, useCallback, useEffect } from 'react';

interface VoiceInputState {
    isListening: boolean;
    transcript: string;
    error: string | null;
    isSupported: boolean;
}

interface UseVoiceInputReturn extends VoiceInputState {
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

/**
 * Custom hook for voice input using Web Speech API
 */
export const useVoiceInput = (): UseVoiceInputReturn => {
    const [state, setState] = useState<VoiceInputState>({
        isListening: false,
        transcript: '',
        error: null,
        isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    });

    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (!state.isSupported) return;

        // Initialize speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-IN'; // Indian English
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onstart = () => {
            setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognitionInstance.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');

            setState(prev => ({ ...prev, transcript }));
        };

        recognitionInstance.onerror = (event: any) => {
            let errorMessage = 'Voice recognition error';

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found. Please check your device.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage = `Error: ${event.error}`;
            }

            setState(prev => ({
                ...prev,
                isListening: false,
                error: errorMessage,
            }));
        };

        recognitionInstance.onend = () => {
            setState(prev => ({ ...prev, isListening: false }));
        };

        setRecognition(recognitionInstance);

        return () => {
            if (recognitionInstance) {
                recognitionInstance.stop();
            }
        };
    }, [state.isSupported]);

    const startListening = useCallback(() => {
        if (!recognition) return;

        try {
            setState(prev => ({ ...prev, transcript: '', error: null }));
            recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to start voice recognition',
            }));
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (!recognition) return;

        try {
            recognition.stop();
        } catch (error) {
            console.error('Failed to stop recognition:', error);
        }
    }, [recognition]);

    const resetTranscript = useCallback(() => {
        setState(prev => ({ ...prev, transcript: '', error: null }));
    }, []);

    return {
        ...state,
        startListening,
        stopListening,
        resetTranscript,
    };
};
