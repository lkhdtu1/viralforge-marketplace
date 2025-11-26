import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Mock auth state - in real app would come from auth context
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
};

interface LayoutProps {
  isAuthenticated?: boolean;
}

export function Layout({ isAuthenticated = false }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/messages') ||
                          location.pathname.startsWith('/settings') ||
                          location.pathname.startsWith('/campaigns');

  // Auth pages have their own layout
  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={isAuthenticated ? mockUser : undefined} />
      <main className={isDashboardPage ? 'flex-1 pt-16' : 'flex-1'}>
        <Outlet />
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  );
}
