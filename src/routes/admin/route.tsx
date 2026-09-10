import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
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

  return <Outlet />;
}
