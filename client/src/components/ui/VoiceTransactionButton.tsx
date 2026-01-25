import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { parseVoiceInput, isValidParsedTransaction, getVoiceExamples, type ParsedTransaction } from '../../utils/voiceParser';
import { Button } from './Button';

interface VoiceTransactionButtonProps {
    onTransactionParsed: (data: {
        type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED' | 'EXPENSE';
        customerName?: string;
        amount: number;
    }) => void;
}

export const VoiceTransactionButton: React.FC<VoiceTransactionButtonProps> = ({
    onTransactionParsed,
}) => {
    const { isListening, transcript, error, isSupported, startListening, stopListening, resetTranscript } = useVoiceInput();
    const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (transcript) {
            const parsed = parseVoiceInput(transcript);
            setParsedData(parsed);
        }
    }, [transcript]);

    const handleStartListening = () => {
        setParsedData(null);
        setShowModal(true);
        startListening();
    };

    const handleStopListening = () => {
        stopListening();
    };

    const handleConfirm = () => {
        if (parsedData && isValidParsedTransaction(parsedData)) {
            onTransactionParsed({
                type: parsedData.type!,
                customerName: parsedData.customerName || undefined,
                amount: parsedData.amount!,
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setShowModal(false);
        stopListening();
        resetTranscript();
        setParsedData(null);
    };

    if (!isSupported) {
        return null; // Don't show button if not supported
    }

    return (
        <>
            <Button
                onClick={handleStartListening}
                variant="outline"
                icon={<Mic className="w-4 h-4" />}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
                Voice Input
            </Button>

            {/* Voice Input Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <XCircle className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Voice Transaction
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Speak clearly to add a transaction
                            </p>
                        </div>

                        {/* Microphone Animation */}
                        <div className="flex justify-center mb-6">
                            <div className={`relative ${isListening ? 'animate-pulse' : ''}`}>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isListening
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                                    }`}>
                                    {isListening ? (
                                        <Mic className="w-12 h-12 text-white" />
                                    ) : (
                                        <MicOff className="w-12 h-12 text-white" />
                                    )}
                                </div>
                                {isListening && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20" />
                                        <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="text-center mb-4">
                            {isListening ? (
                                <p className="text-purple-600 font-medium animate-pulse">
                                    Listening...
                                </p>
                            ) : (
                                <p className="text-gray-500">
                                    Click "Start" to begin
                                </p>
                            )}
                        </div>

                        {/* Transcript */}
                        {transcript && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-600 mb-1">You said:</p>
                                <p className="text-gray-900 font-medium">{transcript}</p>
                            </div>
                        )}

                        {/* Parsed Data */}
                        {parsedData && (
                            <div className={`rounded-lg p-4 mb-4 ${isValidParsedTransaction(parsedData)
                                    ? 'bg-green-50 border-2 border-green-200'
                                    : 'bg-orange-50 border-2 border-orange-200'
                                }`}>
                                <div className="flex items-center gap-2 mb-3">
                                    {isValidParsedTransaction(parsedData) ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <p className="font-semibold text-green-900">Understood!</p>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 text-orange-600" />
                                            <p className="font-semibold text-orange-900">Partial Match</p>
                                        </>
                                    )}
                                    <span className="ml-auto text-sm text-gray-600">
                                        {parsedData.confidence}% confidence
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type:</span>
                                        <span className={`font-semibold ${parsedData.type ? 'text-gray-900' : 'text-red-600'}`}>
                                            {parsedData.type || 'Not detected'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className={`font-semibold ${parsedData.amount ? 'text-gray-900' : 'text-red-600'}`}>
                                            {parsedData.amount ? `₹${parsedData.amount.toLocaleString('en-IN')}` : 'Not detected'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Customer:</span>
                                        <span className="font-semibold text-gray-900">
                                            {parsedData.customerName || 'Optional'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-900 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Examples */}
                        {!transcript && !isListening && (
                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <p className="text-sm font-medium text-blue-900 mb-2">Try saying:</p>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    {getVoiceExamples().slice(0, 3).map((example, index) => (
                                        <li key={index}>• {example}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {isListening ? (
                                <Button
                                    onClick={handleStopListening}
                                    variant="outline"
                                    icon={<MicOff className="w-4 h-4" />}
                                    className="flex-1"
                                >
                                    Stop
                                </Button>
                            ) : (
                                <Button
                                    onClick={startListening}
                                    variant="outline"
                                    icon={<Mic className="w-4 h-4" />}
                                    className="flex-1"
                                >
                                    Start
                                </Button>
                            )}
                            <Button
                                onClick={handleConfirm}
                                variant="primary"
                                disabled={!parsedData || !isValidParsedTransaction(parsedData)}
                                className="flex-1"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
