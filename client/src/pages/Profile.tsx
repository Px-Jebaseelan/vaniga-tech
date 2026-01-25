```
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Store, Award, LogOut, CreditCard, Edit2, Save, X, QrCode } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CreditSpeedometer } from '../components/ui/CreditSpeedometer';
import { QRCodeModal } from '../components/ui/QRCodeModal';
import { LoanApplicationModal } from '../components/ui/LoanApplicationModal';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import { isValidUPIId } from '../utils/qrCodeUtils';

export const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const { t } = useTranslation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [editingUPI, setEditingUPI] = useState(false);
    const [upiId, setUpiId] = useState(user?.upiId || '');
    const [upiError, setUpiError] = useState('');
    const [saving, setSaving] = useState(false);

    if (!user) return null;

    const profileFields = [
        { icon: Store, label: t('businessName'), value: user.businessName },
        { icon: User, label: t('ownerName'), value: user.ownerName || t('notProvided') },
        { icon: Phone, label: t('phoneNumber'), value: user.phone },
        {
            icon: Award,
            label: t('loanEligibility'),
            value: user.loanEligible ? `${ t('eligible') } ✓` : t('notEligible'),
            color: user.loanEligible ? 'text-emerald-600' : 'text-slate-600',
        },
    ];

    const handleLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    const handleSaveUPI = async () => {
        // Validate UPI ID
        if (upiId && !isValidUPIId(upiId)) {
            setUpiError('Invalid UPI ID format (e.g., merchant@upi)');
            return;
        }

        try {
            setSaving(true);
            setUpiError('');

            // Update user profile with UPI ID
            const response = await authService.updateProfile({ upiId });

            if (response.success && response.data) {
                updateUser(response.data.user);
                setEditingUPI(false);
            }
        } catch (error: any) {
            setUpiError(error.message || 'Failed to update UPI ID');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setUpiId(user.upiId || '');
        setUpiError('');
        setEditingUPI(false);
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('profile')}</h1>
                    <p className="text-slate-600 mt-1">{t('manageYourAccount')}</p>
                </div>

                {/* Credit Score Card */}
                <Card className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('yourVanigaScore')}</h2>
                        <CreditSpeedometer score={user.vanigaScore} size="md" />

                        <div className="mt-8 p-4 bg-white rounded-xl">
                            <p className="text-sm text-slate-600 mb-2">{t('loanEligibilityStatus')}</p>
                            <div className={`inline - flex items - center gap - 2 px - 4 py - 2 rounded - full ${
    user.loanEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
} `}>
                                {user.loanEligible ? (
                                    <>
                                        <Award className="w-5 h-5" />
                                        <span className="font-semibold">{t('eligibleForLoans')}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold">{t('buildYourScore')}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Profile Information */}
                <Card>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">{t('accountInformation')}</h2>
                    <div className="space-y-4">
                        {profileFields.map((field, index) => (
                            <motion.div
                                key={field.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                            >
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <field.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500">{field.label}</p>
                                    <p className={`font - semibold ${ field.color || 'text-slate-900' } `}>
                                        {field.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* UPI Payment Settings */}
                <Card>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Settings</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-slate-700">UPI ID</p>
                                        {!editingUPI && (
                                            <button
                                                onClick={() => setEditingUPI(true)}
                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    {editingUPI ? (
                                        <div className="space-y-3">
                                            <Input
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="merchant@upi"
                                                error={upiError}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleSaveUPI}
                                                    loading={saving}
                                                    icon={<Save className="w-4 h-4" />}
                                                    size="sm"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={handleCancelEdit}
                                                    variant="outline"
                                                    icon={<X className="w-4 h-4" />}
                                                    size="sm"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-mono text-slate-900 mb-2">
                                                {user.upiId || 'Not set'}
                                            </p>
                                            {user.upiId && (
                                                <Button
                                                    onClick={() => setShowQRModal(true)}
                                                    variant="outline"
                                                    icon={<QrCode className="w-4 h-4" />}
                                                    size="sm"
                                                >
                                                    Show QR Code
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    {!editingUPI && !user.upiId && (
                                        <p className="text-sm text-slate-600 mt-2">
                                            Add your UPI ID to receive payments via QR code
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Account Actions */}
                <Card>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">{t('accountActions')}</h2>
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                            icon={<LogOut className="w-5 h-5" />}
                            onClick={() => setShowLogoutModal(true)}
                        >
                            {t('logout')}
                        </Button>
                    </div>
                </Card>

                {/* Account Info */}
                <div className="text-center text-sm text-slate-500">
                    <p>{t('memberSince')} {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        month: 'long',
                        year: 'numeric'
                    })}</p>
                </div>

            {/* Loan Application Modal */}
            {user && (
                <LoanApplicationModal
                    isOpen={showLoanModal}
                    onClose={() => setShowLoanModal(false)}
                    vanigaScore={user.vanigaScore}
                    loanEligible={user.loanEligible}
                    onSuccess={() => {
                        alert('Loan application submitted successfully!');
                    }}
                />
            )}
        </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setShowLogoutModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('confirmLogout')}</h2>
                                <p className="text-slate-600 mb-6">
                                    {t('logoutMessage')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                                    >
                                        {t('logout')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* QR Code Modal */}
            {user.upiId && (
                <QRCodeModal
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                    upiId={user.upiId}
                    amount={0}
                    merchantName={user.businessName}
                    transactionNote="Payment to merchant"
                />
            )}
        </>
    );
};
