import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  Cookie,
  ArrowLeft,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Legal() {
  const location = useLocation();
  
  const getDefaultTab = () => {
    if (location.pathname === '/privacy') return 'privacy';
    if (location.pathname === '/cookies') return 'cookies';
    if (location.pathname === '/gdpr') return 'gdpr';
    return 'terms';
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Legal</h1>
          <p className="text-muted-foreground mb-8">
            Our policies and terms to keep you informed
          </p>

          <Tabs defaultValue={getDefaultTab()}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Terms</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="cookies" className="flex items-center gap-2">
                <Cookie className="w-4 h-4" />
                <span className="hidden sm:inline">Cookies</span>
              </TabsTrigger>
              <TabsTrigger value="gdpr" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">GDPR</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using ViralForge, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>

                  <h3>2. Use License</h3>
                  <p>
                    Permission is granted to temporarily access ViralForge for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>

                  <h3>3. User Accounts</h3>
                  <p>
                    When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                  </p>

                  <h3>4. Platform Rules</h3>
                  <ul>
                    <li>Users must be at least 18 years old to use the platform</li>
                    <li>Content must not violate any applicable laws or regulations</li>
                    <li>Users are responsible for maintaining the confidentiality of their accounts</li>
                    <li>Commercial use must comply with our Acceptable Use Policy</li>
                  </ul>

                  <h3>5. Payment Terms</h3>
                  <p>
                    All payments processed through the platform are subject to our payment processing terms. Escrow services are provided for campaign transactions to protect both creators and brands.
                  </p>

                  <h3>6. Limitation of Liability</h3>
                  <p>
                    In no event shall ViralForge be liable for any damages arising out of the use or inability to use the platform.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <h3>Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                  </p>

                  <h3>How We Use Your Information</h3>
                  <ul>
                    <li>To provide, maintain, and improve our services</li>
                    <li>To process transactions and send related information</li>
                    <li>To send you technical notices and support messages</li>
                    <li>To respond to your comments and questions</li>
                  </ul>

                  <h3>Information Sharing</h3>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>

                  <h3>Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <h3>Your Rights</h3>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Export your data</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cookies">
              <Card>
                <CardHeader>
                  <CardTitle>Cookie Policy</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <h3>What Are Cookies</h3>
                  <p>
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide reporting information.
                  </p>

                  <h3>How We Use Cookies</h3>
                  <ul>
                    <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>

                  <h3>Managing Cookies</h3>
                  <p>
                    Most web browsers allow you to control cookies through their settings. However, limiting cookies may impact your experience on our website.
                  </p>

                  <h3>Third-Party Cookies</h3>
                  <p>
                    We may use third-party services that place cookies on your device. These cookies are governed by the respective privacy policies of these third parties.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gdpr">
              <Card>
                <CardHeader>
                  <CardTitle>GDPR Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <h3>Your Rights Under GDPR</h3>
                  <p>
                    If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR).
                  </p>

                  <h3>Data Subject Rights</h3>
                  <ul>
                    <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                    <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                    <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                  </ul>

                  <h3>Legal Basis for Processing</h3>
                  <p>
                    We process your personal data based on: consent, contractual necessity, legal obligations, and legitimate interests.
                  </p>

                  <h3>Data Protection Officer</h3>
                  <p>
                    For GDPR-related inquiries, contact our Data Protection Officer at privacy@viralforge.com.
                  </p>

                  <h3>International Transfers</h3>
                  <p>
                    When we transfer data outside the EEA, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
