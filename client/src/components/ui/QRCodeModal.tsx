import React, { useEffect, useState } from 'react';
import { X, Copy, CheckCircle, Download } from 'lucide-react';
import { generateUPIQRCode, generateUPILink } from '../../utils/qrCodeUtils';
import { Button } from './Button';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    upiId: string;
    amount: number;
    merchantName: string;
    transactionNote?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
    isOpen,
    onClose,
    upiId,
    amount,
    merchantName,
    transactionNote,
}) => {
    const [qrCodeImage, setQrCodeImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && upiId) {
            generateQRCode();
        }
    }, [isOpen, upiId, amount]);

    const generateQRCode = async () => {
        try {
            setLoading(true);
            const qrCode = await generateUPIQRCode(upiId, amount, merchantName, transactionNote);
            setQrCodeImage(qrCode);
        } catch (error) {
            console.error('Failed to generate QR code:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUPI = () => {
        const upiLink = generateUPILink(upiId, amount, merchantName, transactionNote);
        navigator.clipboard.writeText(upiLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.download = `payment-qr-${amount}.png`;
        link.href = qrCodeImage;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Scan to Pay
                    </h2>
                    <p className="text-gray-600">
                        Scan this QR code with any UPI app
                    </p>
                </div>

                {/* QR Code */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img
                                src={qrCodeImage}
                                alt="UPI Payment QR Code"
                                className="w-64 h-64 rounded-lg shadow-lg"
                            />
                            <div className="mt-4 text-center">
                                <p className="text-3xl font-bold text-indigo-600">
                                    ₹{amount.toLocaleString('en-IN')}
                                </p>
                                {transactionNote && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {transactionNote}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* UPI ID Display */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                    <div className="flex items-center justify-between">
                        <p className="font-mono text-sm text-gray-900">{upiId}</p>
                        <button
                            onClick={handleCopyUPI}
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {copied ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <Copy className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Supported Apps */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3 text-center">
                        Supported UPI Apps
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                G
                            </div>
                            <p className="text-xs text-gray-600 mt-1">GPay</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                P
                            </div>
                            <p className="text-xs text-gray-600 mt-1">PhonePe</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                P
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Paytm</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                B
                            </div>
                            <p className="text-xs text-gray-600 mt-1">BHIM</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={handleDownloadQR}
                        variant="outline"
                        icon={<Download className="w-4 h-4" />}
                        className="flex-1"
                        disabled={loading}
                    >
                        Download
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="primary"
                        className="flex-1"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};
