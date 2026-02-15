import { Link, Outlet, useLocation } from 'react-router-dom';

/**
 * AppShell Component
 * Premium Layout with Top Navigation.
 */
export default function AppShell() {
    const location = useLocation();

    const navItems = [
        { label: 'Builder', path: '/builder' },
        { label: 'Preview', path: '/preview' },
        { label: 'Proof', path: '/proof' },
    ];

    return (
        <div className="flex h-screen bg-background overflow-hidden flex-col">
            {/* 1. Header (Top Navigation) */}
            <header className="h-64 border-b border-black/5 bg-white flex items-center justify-between px-40 flex-shrink-0">
                <Link to="/" className="flex items-center space-x-12">
                    <h2 className="text-18 text-primary font-serif italic">AI Resume Builder</h2>
                </Link>

                <nav className="flex items-center space-x-32">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-black/40 hover:text-black/60'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center space-x-24">
                    <div className="flex items-center space-x-8 px-12 py-4 bg-primary/5 border border-primary/10 rounded-full">
                        <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Premium</span>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}
