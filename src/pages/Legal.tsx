import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Cookie, Globe, Ban, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Legal() {
  const location = useLocation();
  
  const getPageContent = () => {
    switch (location.pathname) {
      case '/privacy':
        return {
          icon: Shield,
          title: 'Privacy Policy',
          lastUpdated: 'December 2024',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account information (name, email, password)</li>
                    <li>Profile information (bio, social links, portfolio)</li>
                    <li>Payment information (processed securely through Stripe)</li>
                    <li>Communication data (messages, support tickets)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use the information we collect to provide, maintain, and improve our services:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Communicate about products, services, and events</li>
                    <li>Monitor and analyze trends and usage</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.</p>
                  <p>We may share your information in the following situations:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With your consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and safety</li>
                    <li>In connection with a business transfer</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you have questions about this Privacy Policy, please contact us at privacy@viralforge.com</p>
                </div>
              </section>
            </div>
          )
        };

      case '/cookies':
        return {
          icon: Cookie,
          title: 'Cookie Policy',
          lastUpdated: 'December 2024',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Essential Cookies</h3>
                    <p>These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Analytics Cookies</h3>
                    <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Functional Cookies</h3>
                    <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact your user experience.</p>
                  <p>Most browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.</p>
                </div>
              </section>
            </div>
          )
        };

      case '/gdpr':
        return {
          icon: Globe,
          title: 'GDPR Compliance',
          lastUpdated: 'December 2024',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Your Rights Under GDPR</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you are a resident of the European Union, you have certain rights regarding your personal data:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Right to Access:</strong> You can request copies of your personal data</li>
                    <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data</li>
                    <li><strong>Right to Erasure:</strong> You can request deletion of your personal data</li>
                    <li><strong>Right to Restrict Processing:</strong> You can request limitation of data processing</li>
                    <li><strong>Right to Data Portability:</strong> You can request transfer of your data</li>
                    <li><strong>Right to Object:</strong> You can object to processing of your personal data</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Legal Basis for Processing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We process your personal data based on the following legal grounds:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Consent: When you have given clear consent</li>
                    <li>Contract: When processing is necessary for a contract</li>
                    <li>Legal Obligation: When we must comply with the law</li>
                    <li>Legitimate Interest: When we have a legitimate business interest</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Data Protection Officer</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>For any GDPR-related inquiries, please contact our Data Protection Officer at dpo@viralforge.com</p>
                </div>
              </section>
            </div>
          )
        };

      case '/terms':
        return {
          icon: FileText,
          title: 'Terms of Service',
          lastUpdated: 'December 2024',
          content: (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>By accessing and using ViralForge, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Use License</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Permission is granted to temporarily use ViralForge for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for commercial purposes or public display</li>
                    <li>Attempt to reverse engineer any software</li>
                    <li>Remove any copyright or proprietary notations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your account credentials.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You may not use our service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.</p>
                </div>
              </section>
            </div>
          )
        };

      default:
        return {
          icon: FileText,
          title: 'Legal Documents',
          lastUpdated: 'December 2024',
          content: (
            <div className="space-y-8">
              <p className="text-muted-foreground">Please select a legal document to view.</p>
            </div>
          )
        };
    }
  };

  const pageContent = getPageContent();
  const IconComponent = pageContent.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">{pageContent.title}</h1>
              <p className="text-muted-foreground mt-2">
                Last updated: {pageContent.lastUpdated}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {pageContent.content}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-12 border-t">
            <p className="text-sm text-muted-foreground">
              Questions about this policy? Contact us at{' '}
              <a href="mailto:legal@viralforge.com" className="text-primary hover:underline">
                legal@viralforge.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
