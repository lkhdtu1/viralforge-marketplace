import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Cookies() {
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
                <Cookie className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Cookie Policy</h1>
              <p className="text-muted-foreground mt-2">
                Last updated: December 2025
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
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
