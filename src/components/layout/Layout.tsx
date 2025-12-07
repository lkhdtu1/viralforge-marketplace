import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Chatbot } from '@/components/Chatbot';
import { CookieConsent } from '@/components/CookieConsent';
import { AIGrowthCoach } from '@/components/AIGrowthCoach';
import { useAuth } from '@/contexts/AuthContext';

export function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const isAuthPage = location.pathname.startsWith('/auth');
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/messages') ||
                          location.pathname.startsWith('/settings') ||
                          location.pathname.startsWith('/campaigns');

  // Auth pages have their own layout
  if (isAuthPage) {
    return <Outlet />;
  }

  // Protect dashboard routes
  if (isDashboardPage && !isLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user || undefined} />
      <main className={isDashboardPage ? 'flex-1 pt-16' : 'flex-1'}>
        <Outlet />
      </main>
      {!isDashboardPage && <Footer />}
      <Chatbot />
      <CookieConsent />
      {isAuthenticated && <AIGrowthCoach />}
    </div>
  );
}
