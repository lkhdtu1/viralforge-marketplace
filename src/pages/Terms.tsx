import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
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
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground mt-2">
                Last updated: December 2025
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
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
