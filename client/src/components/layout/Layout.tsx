import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {children}
                </div>
            </main>

            <BottomNav />
        </div>
    );
};
