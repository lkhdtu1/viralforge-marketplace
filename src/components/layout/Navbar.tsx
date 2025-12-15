import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { 
  Menu, 
  X, 
  Zap,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Search,
  Plus
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { usersApi, messagesApi } from '@/lib/api';

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: {
    name?: string;
    displayName?: string;
    email: string;
    avatar?: string;
  };
}

interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

const navLinks: NavLink[] = [
  { href: '/services', label: 'Services' },
  { href: '/discover', label: 'Discover' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

const getAuthNavLinks = (userRole?: string): NavLink[] => {
  const dashboardHref = userRole === 'creator' ? '/creator-dashboard' : '/brand-dashboard';
  
  const baseLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: dashboardHref, label: 'Dashboard', icon: LayoutDashboard },
    { href: '/discover', label: 'Discover', icon: Zap },
    { href: '/about', label: 'About' },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ];
  
  // Add role-specific links
  if (userRole === 'creator') {
    baseLinks.splice(2, 0, { href: '/services/manage', label: 'My Services', icon: Briefcase });
  } else if (userRole === 'brand') {
    baseLinks.splice(2, 0, { href: '/campaigns/new', label: 'Create Campaign', icon: Plus });
  }
  
  return baseLinks;
};

export function Navbar({ isAuthenticated = false, user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { logout, user: authUser } = useAuth();
  const currentUser = user || authUser;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Get role-based navigation links
  const roleBasedNavLinks = getAuthNavLinks(currentUser?.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await usersApi.search(searchQuery);
        // Ensure results is an array
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Load unread messages count for notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadUnreadCount = async () => {
      try {
        const unreadMessages = await messagesApi.getInbox();
        setUnreadCount(Array.isArray(unreadMessages) ? unreadMessages.length : 0);
      } catch (error) {
        // Silently fail - notifications are not critical
        console.error('Failed to load unread count:', error);
      }
    };

    loadUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const isLandingPage = location.pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isLandingPage
          ? 'glass border-b'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">ViralForge</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {(isAuthenticated ? roleBasedNavLinks : navLinks).map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  'text-muted-foreground hover:text-foreground',
                  location.pathname === link.href && 'text-foreground bg-accent'
                )}
              >
                {'icon' in link && <link.icon className="w-4 h-4 mr-2" />}
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* User Search */}
          {isAuthenticated && (
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Search users">
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command>
                  <CommandInput 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {isSearching ? (
                      <div className="py-6 text-center text-sm">Searching...</div>
                    ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
                      <CommandEmpty>No users found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {searchResults.map((result: any) => (
                          <CommandItem
                            key={result.id}
                            className="flex items-center gap-3 p-2 cursor-pointer"
                            onSelect={() => {
                              navigate(`/creators/${result.id}`);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={result.avatar} />
                              <AvatarFallback>
                                {result.displayName?.charAt(0) || result.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.displayName || result.email || 'User'}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {result.role?.toLowerCase() || 'User'}
                              </p>
                            </div>
                            {result.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/messages?userId=${result.id}`);
                                  setSearchOpen(false);
                                  setSearchQuery('');
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              {result.role === 'creator' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/creators/${result.id}`);
                                    setSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                >
                                  <User className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Bookings Icon - Dynamic based on user role */}
          {isAuthenticated && (
            <Link to={currentUser?.role === 'creator' ? '/services/manage' : '/bookings'}>
              <Button variant="ghost" size="icon-sm" className="relative" aria-label={currentUser?.role === 'creator' ? 'My Services' : 'My Bookings'}>
                <Briefcase className="h-4 w-4" />
                {currentUser?.role !== 'creator' && itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link to="/messages">
                <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar || user?.avatar} alt={currentUser?.displayName || user?.displayName || currentUser?.name || user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {(currentUser?.displayName || user?.displayName || currentUser?.name || user?.name)?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser?.displayName || currentUser?.name || user?.displayName || user?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email || user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:block">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {(isAuthenticated ? roleBasedNavLinks : navLinks).map((link) => (
                <Link key={link.href} to={link.href} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      location.pathname === link.href && 'bg-accent'
                    )}
                  >
                    {'icon' in link && <link.icon className="w-4 h-4 mr-2" />}
                    {link.label}
                  </Button>
                </Link>
              ))}
              {!isAuthenticated && (
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
