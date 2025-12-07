import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/layout/Layout";

// Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Products from "./pages/Products";
import DigitalMarketingPlan from "./pages/DigitalMarketingPlan";
import PricingPlans from "./pages/PricingPlans";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import Discover from "./pages/Discover";
import CreatorProfile from "./pages/CreatorProfile";
import CampaignBuilder from "./pages/CampaignBuilder";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import CampaignAnalytics from "./pages/CampaignAnalytics";
import RoleBasedRoute from "./components/RoleBasedRoute";
import CreatorListings from "./pages/CreatorListings";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Legal from "./pages/Legal";
import Bookings from "./pages/Bookings";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
// New pages
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Guides from "./pages/Guides";
import Community from "./pages/Community";
import Partners from "./pages/Partners";
import API from "./pages/API";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="viralforge-theme">
      <AuthProvider>
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
                  <Route path="/services" element={<Products />} />
                  <Route path="/services" element={<Products />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/marketing-plan" element={<DigitalMarketingPlan />} />
                  <Route path="/pricing" element={<PricingPlans />} />
                  <Route path="/pricing/:planType" element={<PricingPlans />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/creators/:id" element={<CreatorProfile />} />
                  <Route path="/bookings" element={<Bookings />} />
                  {/* Legal */}
                  <Route path="/terms" element={<Legal />} />
                  <Route path="/privacy" element={<Legal />} />
                  <Route path="/cookies" element={<Legal />} />
                  <Route path="/gdpr" element={<Legal />} />
                  <Route path="/aup" element={<Legal />} />
                  <Route path="/dmca" element={<Legal />} />
                  {/* Company */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />
                  {/* Resources */}
                  <Route path="/help" element={<Help />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/partners" element={<Partners />} />
                  {/* Product */}
                  <Route path="/api" element={<API />} />
                </Route>

                {/* Auth routes */}
                <Route path="/auth" element={<Auth />} />

                {/* Protected routes */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<RoleBasedRoute />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/new" element={<CampaignBuilder />} />
                  <Route path="/campaigns/:id" element={<CampaignDetails />} />
                  <Route path="/campaigns/:id/analytics" element={<CampaignAnalytics />} />
                  <Route path="/creator/listings" element={<CreatorListings />} />
                  <Route path="/services/manage" element={<CreatorListings />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
