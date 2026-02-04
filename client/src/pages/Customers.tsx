import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Phone, Mail, MapPin, IndianRupee, X, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { customerService, type Customer, type CustomerFormData } from '../services/customerService';

export const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState<CustomerFormData>({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    useEffect(() => {
        fetchCustomers();
    }, [searchQuery]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await customerService.getAll({ search: searchQuery, sortBy: 'name' });
            if (response.success && response.data) {
                setCustomers(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCustomer) {
                const response = await customerService.update(editingCustomer._id, formData);
                if (response.success) {
                    await fetchCustomers();
                    handleCloseModal();
                }
            } else {
                const response = await customerService.create(formData);
                if (response.success) {
                    await fetchCustomers();
                    handleCloseModal();
                }
            }
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            const response = await customerService.delete(id);
            if (response.success) {
                await fetchCustomers();
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleRefreshBalances = async (id: string) => {
        try {
            await customerService.refreshBalances(id);
            await fetchCustomers();
        } catch (error) {
            console.error('Error refreshing balances:', error);
        }
    };

    const handleOpenModal = (customer?: Customer) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name,
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || '',
                notes: customer.notes || '',
            });
        } else {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '', address: '', notes: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', email: '', address: '', notes: '' });
    };

    const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
                        <p className="text-slate-600 mt-1">Manage your customer relationships</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
                        Add Customer
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Customers</p>
                                <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-indigo-600" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Outstanding</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    ₹{totalOutstanding.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <IndianRupee className="w-8 h-8 text-amber-600" />
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Active Customers</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {customers.filter(c => c.outstandingBalance > 0).length}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-emerald-600" />
                        </div>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search customers by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </Card>

                {/* Customer List */}
                {customers.length === 0 ? (
                    <Card>
                        <div className="text-center py-16">
                            <Users className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Customers Yet</h3>
                            <p className="text-slate-600 mb-4">Start adding customers to track their transactions and balances.</p>
                            <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
                                Add Your First Customer
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.map((customer) => (
                            <motion.div
                                key={customer._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card hover>
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{customer.name}</h3>
                                                {customer.phone && (
                                                    <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{customer.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleRefreshBalances(customer._id)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Refresh balances"
                                                >
                                                    <RefreshCw className="w-4 h-4 text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(customer)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {customer.email && (
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}

                                        {customer.address && (
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{customer.address}</span>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-slate-500">Credit Given</p>
                                                <p className="font-semibold text-amber-600">
                                                    ₹{customer.totalCreditGiven.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Outstanding</p>
                                                <p className="font-semibold text-red-600">
                                                    ₹{customer.outstandingBalance.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Customer Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={handleCloseModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {editingCustomer ? 'Edit Customer' : 'Add Customer'}
                                    </h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="Customer Name *"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Input
                                        label="Address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="flex-1">
                                            {editingCustomer ? 'Update' : 'Create'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
