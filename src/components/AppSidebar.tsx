import { Link, useLocation } from 'react-router-dom';
import { Package, Key, Monitor, LayoutDashboard, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/licenses', label: 'Licenses', icon: Key },
  { to: '/activations', label: 'Activations', icon: Monitor },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight flex items-center gap-2">
          <Key className="h-5 w-5 text-sidebar-primary" />
          LicenseHub
        </h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to || 
            (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
        v1.0 — Prototype
      </div>
    </aside>
  );
}
