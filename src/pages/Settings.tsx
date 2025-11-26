import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  CreditCard,
  Shield,
  Bell,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    company: 'Acme Inc',
    website: 'https://example.com',
  });

  const [notifications, setNotifications] = useState({
    email: {
      campaigns: true,
      messages: true,
      payments: true,
      marketing: false,
    },
    push: {
      campaigns: true,
      messages: true,
      payments: false,
    },
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data export will be emailed to you shortly.',
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: 'destructive',
      title: 'Action Required',
      description: 'Please contact support to delete your account.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback className="text-2xl">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="hero" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export or delete your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div>
                      <p className="font-medium">Export Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl">
                    <div>
                      <p className="font-medium text-destructive">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">Pro Plan</span>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">$49/month • Renews Dec 15, 2024</p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>

                  <h3 className="font-semibold mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your past invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: 'Nov 15, 2024', amount: '$49.00', status: 'Paid' },
                      { date: 'Oct 15, 2024', amount: '$49.00', status: 'Paid' },
                      { date: 'Sep 15, 2024', amount: '$49.00', status: 'Paid' },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-xl">
                        <div>
                          <p className="font-medium">{invoice.date}</p>
                          <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{invoice.status}</Badge>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password regularly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">
                          Use an app like Google Authenticator
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what emails you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    campaigns: 'Campaign updates and invitations',
                    messages: 'New messages from creators',
                    payments: 'Payment and billing notifications',
                    marketing: 'Tips, news, and product updates',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{label}</span>
                      </div>
                      <Switch
                        checked={notifications.email[key as keyof typeof notifications.email]}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            email: { ...notifications.email, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>Manage in-app notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    campaigns: 'Campaign activity',
                    messages: 'New messages',
                    payments: 'Payment updates',
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span>{label}</span>
                      </div>
                      <Switch
                        checked={notifications.push[key as keyof typeof notifications.push]}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            push: { ...notifications.push, [key]: checked },
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
