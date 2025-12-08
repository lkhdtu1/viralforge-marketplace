import { useState, useEffect } from 'react';
import { X, Settings, Cookie, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieInfo {
  name: string;
  purpose: string;
  ttl: string;
  vendor: string;
  category: 'necessary' | 'analytics' | 'marketing';
}

const COOKIE_INFO: CookieInfo[] = [
  {
    name: 'session_id',
    purpose: 'Maintains user session and authentication state',
    ttl: 'Session',
    vendor: 'ViralForge',
    category: 'necessary',
  },
  {
    name: 'cookie_consent',
    purpose: 'Stores your cookie preferences',
    ttl: '1 year',
    vendor: 'ViralForge',
    category: 'necessary',
  },
  {
    name: '_ga',
    purpose: 'Google Analytics - tracks website usage and performance',
    ttl: '2 years',
    vendor: 'Google',
    category: 'analytics',
  },
  {
    name: '_gid',
    purpose: 'Google Analytics - distinguishes unique users',
    ttl: '24 hours',
    vendor: 'Google',
    category: 'analytics',
  },
  {
    name: '_fbp',
    purpose: 'Facebook Pixel - tracks conversions and ad performance',
    ttl: '3 months',
    vendor: 'Meta',
    category: 'marketing',
  },
];

const COOKIE_CONSENT_KEY = 'viralforge_cookie_consent';
const COOKIE_CONSENT_VERSION = '1.0';

export function CookieConsent() {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const consent = JSON.parse(savedConsent);
        if (consent.version === COOKIE_CONSENT_VERSION) {
          setPreferences(consent.preferences);
        } else {
          // Version mismatch, show banner again
          setTimeout(() => setShowBanner(true), 1000);
        }
      } catch {
        // Invalid consent data, show banner
        setTimeout(() => setShowBanner(true), 1000);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consent = {
      version: COOKIE_CONSENT_VERSION,
      preferences: prefs,
      timestamp: new Date().toISOString(),
      userId: user?.id || null,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    
    // Set cookie for server-side access
    document.cookie = `${COOKIE_CONSENT_KEY}=${JSON.stringify(consent)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

    // Send to backend if user is authenticated
    if (user) {
      // TODO: Send to backend API endpoint
      // fetch('/api/v1/cookie-consent', { method: 'POST', body: JSON.stringify(consent) })
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    setShowBanner(false);
  };

  const getCategoryCookies = (category: 'necessary' | 'analytics' | 'marketing') => {
    return COOKIE_INFO.filter((cookie) => cookie.category === category);
  };

  if (!showBanner && !showSettings) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t shadow-lg animate-in slide-in-from-bottom">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">We use cookies</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.
                </p>
                <div className="mt-2">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleOpenSettings}
                    className="text-primary p-0 h-auto"
                  >
                    Manage preferences
                  </Button>
                  {' • '}
                  <a
                    href="/cookies"
                    className="text-primary text-sm hover:underline"
                  >
                    Learn more
                  </a>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                >
                  Reject All
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Necessary Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Necessary Cookies
                      <span className="text-xs font-normal text-muted-foreground">(Always Active)</span>
                    </CardTitle>
                    <CardDescription>
                      These cookies are essential for the website to function properly. They cannot be disabled.
                    </CardDescription>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getCategoryCookies('necessary').map((cookie) => (
                    <div key={cookie.name} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{cookie.name}</span>
                        <span className="text-xs text-muted-foreground">{cookie.vendor}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{cookie.purpose}</p>
                      <p className="text-xs text-muted-foreground">TTL: {cookie.ttl}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Analytics Cookies</CardTitle>
                    <CardDescription>
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </CardDescription>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, analytics: checked })
                    }
                  />
                </div>
              </CardHeader>
              {preferences.analytics && (
                <CardContent>
                  <div className="space-y-2">
                    {getCategoryCookies('analytics').map((cookie) => (
                      <div key={cookie.name} className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{cookie.name}</span>
                          <span className="text-xs text-muted-foreground">{cookie.vendor}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{cookie.purpose}</p>
                        <p className="text-xs text-muted-foreground">TTL: {cookie.ttl}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Marketing Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Marketing Cookies</CardTitle>
                    <CardDescription>
                      These cookies are used to deliver personalized advertisements and track campaign performance.
                    </CardDescription>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, marketing: checked })
                    }
                  />
                </div>
              </CardHeader>
              {preferences.marketing && (
                <CardContent>
                  <div className="space-y-2">
                    {getCategoryCookies('marketing').map((cookie) => (
                      <div key={cookie.name} className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{cookie.name}</span>
                          <span className="text-xs text-muted-foreground">{cookie.vendor}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{cookie.purpose}</p>
                        <p className="text-xs text-muted-foreground">TTL: {cookie.ttl}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePreferences}>
                <Check className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook to check if a cookie category is enabled
export function useCookieConsent() {
  const getConsent = (): CookiePreferences | null => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) return null;
    
    try {
      const consent = JSON.parse(savedConsent);
      return consent.preferences;
    } catch {
      return null;
    }
  };

  const hasConsent = (category: 'analytics' | 'marketing'): boolean => {
    const prefs = getConsent();
    if (!prefs) return false;
    return prefs[category] === true;
  };

  return { getConsent, hasConsent };
}



