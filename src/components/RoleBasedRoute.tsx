import { Navigate } from 'react-router-dom';
import BrandDashboard from '@/pages/BrandDashboard';
import CreatorDashboard from '@/pages/CreatorDashboard';

export default function RoleBasedRoute() {
  const userRole = localStorage.getItem('userRole') || 'brand';
  
  return userRole === 'creator' ? <CreatorDashboard /> : <BrandDashboard />;
}
