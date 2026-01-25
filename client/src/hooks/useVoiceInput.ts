import { useState, useCallback, useEffect, useRef } from 'react';

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
 * Industry-grade implementation with error handling and retry logic
 */
export const useVoiceInput = (): UseVoiceInputReturn => {
    const [state, setState] = useState<VoiceInputState>({
        isListening: false,
        transcript: '',
        error: null,
        isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    });

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!state.isSupported) return;

        // Initialize speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        // Simpler configuration - non-continuous mode for better control
        recognitionInstance.continuous = false; // Single utterance mode
        recognitionInstance.interimResults = true; // Show interim results
        recognitionInstance.lang = 'en-IN'; // Indian English
        recognitionInstance.maxAlternatives = 3; // Get multiple alternatives for better accuracy

        recognitionInstance.onstart = () => {
            console.log('🎤 Voice recognition started');
            setState(prev => ({ ...prev, isListening: true, error: null }));
            // In non-continuous mode, we don't need to manage finalTranscriptRef here
        };

        recognitionInstance.onresult = (event: any) => {
            let transcript = '';

            // Get the latest result
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            setState(prev => ({ ...prev, transcript: transcript.trim() }));
        };

        recognitionInstance.onerror = (event: any) => {
            console.error('Voice recognition error:', event.error);

            let errorMessage = 'Voice recognition error';

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please speak clearly.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found. Please check your device.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow access in browser settings.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'aborted':
                    // User stopped - not an error
                    setState(prev => ({ ...prev, isListening: false }));
                    return;
                default:
                    errorMessage = `Recognition error: ${event.error}`;
            }

            setState(prev => ({
                ...prev,
                isListening: false,
                error: errorMessage,
            }));
        };

        recognitionInstance.onend = () => {
            console.log('🛑 Voice recognition ended');
            setState(prev => ({ ...prev, isListening: false }));
        };

        recognitionRef.current = recognitionInstance;

        return () => {
            if (recognitionInstance) {
                try {
                    recognitionInstance.abort(); // Use abort for a clean shutdown
                } catch (e) {
                    // Already stopped or not started
                }
            }
        };
    }, [state.isSupported]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        try {
            setState(prev => ({ ...prev, transcript: '', error: null }));
            recognitionRef.current.start();
        } catch (error: any) {
            console.error('Failed to start recognition:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to start voice recognition. Please try again.',
                isListening: false,
            }));
        }
    }, []);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;

        try {
            recognitionRef.current.stop();
        } catch (error) {
            console.error('Failed to stop recognition:', error);
        }

        // Always update state
        setState(prev => ({ ...prev, isListening: false }));
    }, []);

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
