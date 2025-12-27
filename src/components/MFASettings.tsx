import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Key, Copy, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MFAStatus {
  enabled: boolean;
  backupCodesCount: number;
}

interface MFASetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export function MFASettings() {
  const { toast } = useToast();
  const [status, setStatus] = useState<MFAStatus>({ enabled: false, backupCodesCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [setupData, setSetupData] = useState<MFASetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [disableCode, setDisableCode] = useState('');

  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mfa/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to load MFA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupMFA = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mfa/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSetupData(data.data);
        setIsSetupOpen(true);
      } else {
        toast({
          title: 'Setup Failed',
          description: data.error?.message || 'Failed to setup MFA',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: 'Failed to setup MFA',
        variant: 'destructive',
      });
    }
  };

  const enableMFA = async () => {
    if (!verificationCode.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mfa/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ token: verificationCode }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'MFA Enabled',
          description: 'Two-factor authentication has been enabled successfully',
        });
        setIsSetupOpen(false);
        setVerificationCode('');
        setSetupData(null);
        loadMFAStatus();
      } else {
        toast({
          title: 'Verification Failed',
          description: data.error?.message || 'Invalid verification code',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Enable Failed',
        description: 'Failed to enable MFA',
        variant: 'destructive',
      });
    }
  };

  const disableMFA = async () => {
    if (!disableCode.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mfa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ token: disableCode }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'MFA Disabled',
          description: 'Two-factor authentication has been disabled',
        });
        setIsDisableOpen(false);
        setDisableCode('');
        loadMFAStatus();
      } else {
        toast({
          title: 'Disable Failed',
          description: data.error?.message || 'Invalid verification code',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Disable Failed',
        description: 'Failed to disable MFA',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    
    const content = `ViralForge MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${setupData.backupCodes.join('\n')}\n\nKeep these codes safe! Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'viralforge-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading MFA settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {status.enabled ? (
            <ShieldCheck className="w-6 h-6 text-green-600" />
          ) : (
            <Shield className="w-6 h-6 text-muted-foreground" />
          )}
          <div>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <Badge variant={status.enabled ? 'default' : 'secondary'} className="ml-auto">
            {status.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.enabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    MFA is enabled
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your account is protected with two-factor authentication
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup Codes</p>
                <p className="text-sm text-muted-foreground">
                  {status.backupCodesCount} backup codes remaining
                </p>
              </div>
              <Button variant="outline" size="sm">
                Generate New Codes
              </Button>
            </div>

            <Dialog open={isDisableOpen} onOpenChange={setIsDisableOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Disable MFA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Enter your authenticator code to disable MFA
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="disable-code">Verification Code</Label>
                    <Input
                      id="disable-code"
                      placeholder="000000"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={disableMFA} variant="destructive" className="flex-1">
                      Disable MFA
                    </Button>
                    <Button onClick={() => setIsDisableOpen(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    MFA is disabled
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Enable MFA to secure your account
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={setupMFA} className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}

        {/* Setup Dialog */}
        <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app
              </DialogDescription>
            </DialogHeader>
            
            {setupData && (
              <div className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center">
                  <img 
                    src={setupData.qrCodeUrl} 
                    alt="MFA QR Code" 
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>

                {/* Manual Entry */}
                <div>
                  <Label>Manual Entry Key</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      value={setupData.secret} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(setupData.secret)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                {/* Backup Codes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Backup Codes</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={downloadBackupCodes}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                    {setupData.backupCodes.map((code, index) => (
                      <code key={index} className="text-xs font-mono">
                        {code}
                      </code>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Save these codes! Each can only be used once.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={enableMFA} className="flex-1">
                    Enable MFA
                  </Button>
                  <Button 
                    onClick={() => setIsSetupOpen(false)} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
