import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GDPR() {
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
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">GDPR Compliance</h1>
              <p className="text-muted-foreground mt-2">
                Last updated: December 2025
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
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
