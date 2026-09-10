import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Utensils, Image, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Allow access to login page even if not authenticated
  if (!isAuthenticated && window.location.pathname !== '/login') {
    // We handle redirecting in a useEffect to avoid rendering issues
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-40 shadow-sm transition-all">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-10">
            <h1 className="font-display text-xl tracking-wide text-primary flex items-center gap-2">
              <span className="bg-primary/10 p-1.5 rounded-md">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </span>
              Admin
            </h1>
            <nav className="flex items-center gap-2">
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium px-4 py-2 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-semibold flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span className="hidden sm:inline">Menu</span>
              </Link>
              <Link
                to="/admin/gallery"
                className="text-sm font-medium px-4 py-2 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 [&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-semibold flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Gallery</span>
              </Link>
            </nav>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => auth?.signOut()}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
