import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Privacy() {
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
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-2">
                Last updated: December 2025
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
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
          </div>

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
