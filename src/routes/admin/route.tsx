import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

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
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-display text-xl font-bold tracking-wider">Admin Panel</h1>
            <nav className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary [&.active]:font-bold"
              >
                Menu
              </Link>
              <Link
                to="/admin/gallery"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors [&.active]:text-primary [&.active]:font-bold"
              >
                Gallery
              </Link>
            </nav>
          </div>
          <button
            onClick={() => auth?.signOut()}
            className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
