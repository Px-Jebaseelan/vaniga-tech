import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Store, Award, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreditSpeedometer } from '../components/ui/CreditSpeedometer';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    if (!user) return null;

    const profileFields = [
        { icon: Store, label: t('businessName'), value: user.businessName },
        { icon: User, label: t('ownerName'), value: user.ownerName || t('notProvided') },
        { icon: Phone, label: t('phoneNumber'), value: user.phone },
        {
            icon: Award,
            label: t('loanEligibility'),
            value: user.loanEligible ? `${t('eligible')} ✓` : t('notEligible'),
            color: user.loanEligible ? 'text-emerald-600' : 'text-slate-600',
        },
    ];

    const handleLogout = () => {
        setShowLogoutModal(false);
        logout();
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
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${user.loanEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                }`}>
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
                                    <p className={`font-semibold ${field.color || 'text-slate-900'}`}>
                                        {field.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
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
        </>
    );
};
