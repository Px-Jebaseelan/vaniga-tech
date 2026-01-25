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
    const finalTranscriptRef = useRef<string>('');
    const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const manualStopRef = useRef<boolean>(false); // Track manual stop

    useEffect(() => {
        if (!state.isSupported) return;

        // Initialize speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        // Configuration for better accuracy
        recognitionInstance.continuous = true; // Keep listening
        recognitionInstance.interimResults = true; // Show interim results
        recognitionInstance.lang = 'en-IN'; // Indian English
        recognitionInstance.maxAlternatives = 3; // Get multiple alternatives for better accuracy

        recognitionInstance.onstart = () => {
            console.log('🎤 Voice recognition started');
            setState(prev => ({ ...prev, isListening: true, error: null }));
            finalTranscriptRef.current = '';
            manualStopRef.current = false; // Reset manual stop flag
        };

        recognitionInstance.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            // Process all results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update final transcript
            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript;
            }

            // Show interim or final transcript
            const displayTranscript = (finalTranscriptRef.current + interimTranscript).trim();
            setState(prev => ({ ...prev, transcript: displayTranscript }));
        };

        recognitionInstance.onerror = (event: any) => {
            console.error('Voice recognition error:', event.error);

            let errorMessage = 'Voice recognition error';
            let shouldRetry = false;

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please speak clearly.';
                    shouldRetry = true;
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found. Please check your device.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow access in browser settings.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    shouldRetry = true;
                    break;
                case 'aborted':
                    // User stopped - not an error
                    return;
                default:
                    errorMessage = `Recognition error: ${event.error}`;
                    shouldRetry = true;
            }

            setState(prev => ({
                ...prev,
                isListening: false,
                error: errorMessage,
            }));

            // Auto-retry for transient errors (but not if manually stopped)
            if (shouldRetry && state.isListening && !manualStopRef.current) {
                restartTimeoutRef.current = setTimeout(() => {
                    try {
                        recognitionInstance.start();
                    } catch (e) {
                        console.log('Could not restart recognition');
                    }
                }, 1000);
            }
        };

        recognitionInstance.onend = () => {
            console.log('🛑 Voice recognition ended');
            setState(prev => ({ ...prev, isListening: false }));

            // Auto-restart if still supposed to be listening (and not manually stopped)
            if (state.isListening && !state.error && !manualStopRef.current) {
                restartTimeoutRef.current = setTimeout(() => {
                    try {
                        recognitionInstance.start();
                    } catch (e) {
                        console.log('Recognition already started');
                    }
                }, 100);
            }
        };

        recognitionRef.current = recognitionInstance;

        return () => {
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
            }
            if (recognitionInstance) {
                try {
                    recognitionInstance.stop();
                } catch (e) {
                    // Already stopped
                }
            }
        };
    }, [state.isSupported, state.isListening, state.error]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        // Reset manual stop flag
        manualStopRef.current = false;

        try {
            setState(prev => ({ ...prev, transcript: '', error: null, isListening: true }));
            finalTranscriptRef.current = '';
            recognitionRef.current.start();
        } catch (error: any) {
            // If already started, abort and restart
            if (error.message && error.message.includes('already started')) {
                console.log('Recognition already active, restarting...');
                try {
                    recognitionRef.current.abort(); // Use abort instead of stop
                    setTimeout(() => {
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            console.error('Failed to restart after abort:', e);
                        }
                    }, 100);
                } catch (abortError) {
                    console.error('Failed to abort:', abortError);
                }
            } else {
                console.error('Failed to start recognition:', error);
                setState(prev => ({
                    ...prev,
                    error: 'Failed to start voice recognition. Please try again.',
                    isListening: false,
                }));
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;

        // Set manual stop flag to prevent auto-restart
        manualStopRef.current = true;

        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }

        try {
            recognitionRef.current.stop();
            setState(prev => ({ ...prev, isListening: false }));
        } catch (error) {
            console.error('Failed to stop recognition:', error);
            // Force state update even if stop fails
            setState(prev => ({ ...prev, isListening: false }));
        }
    }, []);

    const resetTranscript = useCallback(() => {
        finalTranscriptRef.current = '';
        setState(prev => ({ ...prev, transcript: '', error: null }));
    }, []);

    return {
        ...state,
        startListening,
        stopListening,
        resetTranscript,
    };
};
