import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BrandDashboard from '@/pages/BrandDashboard';
import CreatorDashboard from '@/pages/CreatorDashboard';

export default function RoleBasedRoute() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return user.role === 'creator' ? <CreatorDashboard /> : <BrandDashboard />;
}
