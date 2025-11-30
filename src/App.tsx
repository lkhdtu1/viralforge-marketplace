import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/layout/Layout";

// Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Products from "./pages/Products";
import PricingPlans from "./pages/PricingPlans";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Marketplace from "./pages/Marketplace";
import CreatorProfile from "./pages/CreatorProfile";
import CampaignBuilder from "./pages/CampaignBuilder";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Legal from "./pages/Legal";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="viralforge-theme">
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/pricing" element={<PricingPlans />} />
                <Route path="/pricing/:planType" element={<PricingPlans />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/creators/:id" element={<CreatorProfile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/terms" element={<Legal />} />
                <Route path="/privacy" element={<Legal />} />
                <Route path="/cookies" element={<Legal />} />
              </Route>

              {/* Auth routes */}
              <Route path="/auth" element={<Auth />} />

              {/* Protected routes (with auth simulation) */}
              <Route element={<Layout isAuthenticated />}>
                <Route path="/dashboard" element={<RoleBasedRoute />} />
                <Route path="/campaigns/new" element={<CampaignBuilder />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
