import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  Cookie,
  ArrowLeft,
  Globe,
  Ban,
  AlertTriangle
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
    if (location.pathname === '/aup') return 'aup';
    if (location.pathname === '/dmca') return 'dmca';
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
            <TabsList className="grid w-full grid-cols-6 mb-6">
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
              <TabsTrigger value="aup" className="flex items-center gap-2">
                <Ban className="w-4 h-4" />
                <span className="hidden sm:inline">AUP</span>
              </TabsTrigger>
              <TabsTrigger value="dmca" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">DMCA</span>
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
                  <p className="text-sm text-muted-foreground">Last updated: December 2024 | Version 2.0</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using ViralForge ("Platform", "Service", "we", "us"), you agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service. These Terms constitute a legally binding agreement between you and ViralForge.
                  </p>

                  <h3>2. Definitions</h3>
                  <ul>
                    <li><strong>Platform:</strong> The ViralForge SaaS marketplace and all associated services</li>
                    <li><strong>Brand:</strong> A user who creates and funds campaigns to promote products or services</li>
                    <li><strong>Creator:</strong> A user who provides content creation and distribution services</li>
                    <li><strong>Campaign:</strong> A paid micro-viral marketing project initiated by a Brand</li>
                    <li><strong>Content:</strong> Any material created, uploaded, or distributed through the Platform</li>
                    <li><strong>Escrow:</strong> A secure payment holding mechanism for campaign transactions</li>
                  </ul>

                  <h3>3. Services</h3>
                  <p>
                    ViralForge provides a marketplace platform connecting Brands and Creators for paid micro-viral campaigns. Our services include:
                  </p>
                  <ul>
                    <li>Campaign creation and management tools</li>
                    <li>Creator discovery and matching</li>
                    <li>Payment processing and escrow services</li>
                    <li>Analytics and performance tracking</li>
                    <li>Dispute resolution support</li>
                  </ul>

                  <h3>4. User Accounts</h3>
                  <p>
                    To use the Platform, you must create an account and provide accurate, complete, and current information. You must:
                  </p>
                  <ul>
                    <li>Be at least 18 years old (or the age of majority in your jurisdiction)</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Not share your account with others</li>
                    <li>Be responsible for all activities under your account</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
                  </p>

                  <h3>5. Payment & Refund Policy</h3>
                  <p>
                    <strong>Payment Processing:</strong> All payments are processed through secure third-party payment processors (Stripe). Brands are charged upon campaign creation or milestone completion as specified in the campaign agreement.
                  </p>
                  <p>
                    <strong>Refunds:</strong> Refunds are available under the following circumstances:
                  </p>
                  <ul>
                    <li>Campaign cancellation by Brand before Creator acceptance (full refund minus 5% processing fee)</li>
                    <li>Creator fails to deliver agreed deliverables within specified timeframe (proportional refund)</li>
                    <li>Material breach of campaign agreement by Creator (full refund)</li>
                    <li>Platform error or technical failure (full refund)</li>
                  </ul>
                  <p>
                    Refund requests must be submitted within 30 days of campaign completion or cancellation. All refunds are subject to review and approval.
                  </p>

                  <h3>6. Escrow Rules</h3>
                  <p>
                    <strong>Escrow Protection:</strong> Campaign funds are held in escrow until:
                  </p>
                  <ul>
                    <li>All deliverables are completed and approved by Brand</li>
                    <li>All milestones are verified as complete</li>
                    <li>No active disputes exist</li>
                  </ul>
                  <p>
                    <strong>Release Conditions:</strong> Funds are automatically released 7 days after Brand approval unless a dispute is filed. In case of disputes, funds remain in escrow until resolution.
                  </p>
                  <p>
                    <strong>Platform Fee:</strong> A 5% platform fee is deducted from each successful transaction. This fee covers payment processing, escrow services, and platform maintenance.
                  </p>

                  <h3>7. Intellectual Property & Content Licensing</h3>
                  <p>
                    <strong>Creator Content License:</strong> By accepting a campaign, Creators grant Brands a limited, non-exclusive, worldwide license to use, reproduce, distribute, and display the created content for the specific campaign purposes and duration as specified in the campaign agreement.
                  </p>
                  <p>
                    <strong>License Scope:</strong> The license includes:
                  </p>
                  <ul>
                    <li>Use on specified social media platforms</li>
                    <li>Use in marketing materials related to the campaign</li>
                    <li>Duration as specified (typically 6-12 months, or perpetual for evergreen content)</li>
                    <li>Geographic scope as specified in campaign</li>
                  </ul>
                  <p>
                    <strong>Creator Rights:</strong> Creators retain ownership of their content and may use it in portfolios, unless otherwise specified. Brands may not use content beyond the licensed scope without additional agreement.
                  </p>
                  <p>
                    <strong>Platform License:</strong> Users grant ViralForge a license to display, store, and process content for platform functionality and marketing purposes.
                  </p>

                  <h3>8. Prohibited Content</h3>
                  <p>
                    The following content is strictly prohibited:
                  </p>
                  <ul>
                    <li>Illegal activities or content violating laws</li>
                    <li>Hate speech, discrimination, or harassment</li>
                    <li>Misleading or false advertising</li>
                    <li>Adult content, violence, or graphic material</li>
                    <li>Copyrighted material without authorization</li>
                    <li>Spam, phishing, or fraudulent content</li>
                    <li>Content promoting illegal substances or activities</li>
                  </ul>
                  <p>
                    Violations may result in immediate account termination and legal action.
                  </p>

                  <h3>9. Dispute Resolution</h3>
                  <p>
                    <strong>Internal Resolution:</strong> Disputes between Brands and Creators should first be resolved through direct communication. If unresolved, either party may file a dispute through the Platform.
                  </p>
                  <p>
                    <strong>Platform Mediation:</strong> ViralForge will review disputes and may mediate. Our decision is binding for platform purposes but does not prevent legal action.
                  </p>
                  <p>
                    <strong>Arbitration:</strong> For disputes exceeding $10,000, parties agree to binding arbitration under the rules of the American Arbitration Association, unless both parties agree otherwise.
                  </p>
                  <p>
                    <strong>Class Action Waiver:</strong> Users waive the right to participate in class action lawsuits against ViralForge.
                  </p>

                  <h3>10. Limitation of Liability</h3>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIRALFORGE SHALL NOT BE LIABLE FOR:
                  </p>
                  <ul>
                    <li>Indirect, incidental, special, or consequential damages</li>
                    <li>Loss of profits, revenue, data, or business opportunities</li>
                    <li>Content quality, campaign performance, or creator deliverables</li>
                    <li>Third-party actions or content</li>
                    <li>Platform downtime or technical issues</li>
                  </ul>
                  <p>
                    Our total liability shall not exceed the amount paid by you to ViralForge in the 12 months preceding the claim.
                  </p>

                  <h3>11. Indemnification</h3>
                  <p>
                    You agree to indemnify, defend, and hold harmless ViralForge, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                  </p>
                  <ul>
                    <li>Your use of the Platform</li>
                    <li>Your content or campaigns</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights</li>
                  </ul>

                  <h3>12. Termination</h3>
                  <p>
                    Either party may terminate this agreement at any time. We may suspend or terminate your account immediately if you:
                  </p>
                  <ul>
                    <li>Violate these Terms or our Acceptable Use Policy</li>
                    <li>Engage in fraudulent or illegal activity</li>
                    <li>Fail to pay fees when due</li>
                    <li>Create risk or legal exposure for ViralForge</li>
                  </ul>
                  <p>
                    Upon termination, your right to use the Platform ceases immediately. Outstanding obligations and escrow funds will be handled according to these Terms.
                  </p>

                  <h3>13. Jurisdiction & Governing Law</h3>
                  <p>
                    <strong>Default Jurisdiction:</strong> These Terms are governed by the laws of Delaware, United States, without regard to conflict of law principles.
                  </p>
                  <p>
                    <strong>EU Users:</strong> For users in the European Union, these Terms are governed by the laws of Ireland, and disputes shall be resolved in Irish courts.
                  </p>
                  <p>
                    <strong>User Selection:</strong> Users may select their preferred jurisdiction during account creation, subject to our approval and applicable law.
                  </p>
                  <p>
                    <strong>Venue:</strong> Any legal action must be brought in the appropriate courts of the governing jurisdiction.
                  </p>

                  <h3>14. Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these Terms at any time. Material changes will be notified via email or platform notification at least 30 days before taking effect. Continued use of the Platform after changes constitutes acceptance.
                  </p>

                  <h3>15. Contact</h3>
                  <p>
                    For questions about these Terms, contact us at: legal@viralforge.com
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: December 2024 | GDPR & CCPA Compliant</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2">Plain Language Summary</h4>
                    <p className="text-sm">
                      We collect your information to provide our marketplace services, process payments, and improve your experience. 
                      We share data with payment processors (Stripe) and analytics services. You can access, delete, or export your data at any time. 
                      We never sell your personal information. We protect your data with industry-standard security measures.
                    </p>
                  </div>

                  <h3>1. Information We Collect</h3>
                  
                  <h4>Personal Data</h4>
                  <ul>
                    <li><strong>Account Information:</strong> Name, email, password (hashed), phone number, profile picture</li>
                    <li><strong>Identity Verification:</strong> Government-issued ID (for verified accounts), business registration documents</li>
                    <li><strong>Profile Data:</strong> Bio, social media links, portfolio, skills, location</li>
                    <li><strong>Communication:</strong> Messages, support tickets, feedback</li>
                  </ul>

                  <h4>Payment Information</h4>
                  <ul>
                    <li>Payment method details (processed securely by Stripe, not stored by us)</li>
                    <li>Billing address and tax information</li>
                    <li>Transaction history and receipts</li>
                  </ul>

                  <h4>Analytics & Usage Data</h4>
                  <ul>
                    <li>IP address, browser type, device information</li>
                    <li>Pages visited, time spent, click patterns</li>
                    <li>Campaign performance metrics</li>
                    <li>Error logs and crash reports</li>
                  </ul>

                  <h4>Cookies & Tracking Technologies</h4>
                  <p>
                    We use cookies, web beacons, and similar technologies. See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for details.
                  </p>

                  <h3>2. Legal Bases for Processing (GDPR)</h3>
                  <p>We process your data based on:</p>
                  <ul>
                    <li><strong>Consent:</strong> When you opt-in to marketing communications or analytics cookies</li>
                    <li><strong>Contract:</strong> To fulfill our service agreement (processing payments, facilitating campaigns)</li>
                    <li><strong>Legal Obligation:</strong> To comply with tax, fraud prevention, and regulatory requirements</li>
                    <li><strong>Legitimate Interest:</strong> To improve services, prevent fraud, and ensure platform security</li>
                  </ul>

                  <h3>3. How We Use Your Information</h3>
                  <ul>
                    <li>Provide, maintain, and improve our marketplace services</li>
                    <li>Process transactions and facilitate payments</li>
                    <li>Match Brands with Creators and manage campaigns</li>
                    <li>Send transactional emails (notifications, receipts, updates)</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Detect and prevent fraud, abuse, and security threats</li>
                    <li>Comply with legal obligations and enforce our Terms</li>
                    <li>Analyze usage patterns to improve user experience</li>
                    <li>Send marketing communications (with your consent)</li>
                  </ul>

                  <h3>4. Third-Party Processors</h3>
                  <p>We share data with trusted service providers:</p>
                  <ul>
                    <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
                    <li><strong>Supabase/PostgreSQL:</strong> Database hosting and infrastructure</li>
                    <li><strong>Email Services:</strong> Transactional and marketing emails</li>
                    <li><strong>Analytics:</strong> Google Analytics (with consent), platform analytics</li>
                    <li><strong>Cloud Storage:</strong> Content and file storage (AWS, Cloudflare)</li>
                  </ul>
                  <p>
                    All processors are contractually obligated to protect your data and use it only for specified purposes.
                  </p>

                  <h3>5. Data Sharing & Sales</h3>
                  <p>
                    <strong>We do not sell your personal information.</strong> We only share data as described in this policy or with your explicit consent.
                  </p>
                  <p>We may disclose data if required by law, to protect rights, or in connection with business transfers (merger, acquisition).</p>

                  <h3>6. Your Rights (GDPR & CCPA)</h3>
                  
                  <h4>Right to Access</h4>
                  <p>Request a copy of your personal data. We'll provide it within 30 days in a machine-readable format.</p>

                  <h4>Right to Rectification</h4>
                  <p>Correct inaccurate or incomplete data through your account settings or by contacting us.</p>

                  <h4>Right to Erasure ("Right to be Forgotten")</h4>
                  <p>Request deletion of your data, subject to legal retention requirements. We'll delete data within 30 days unless we have a legal basis to retain it.</p>

                  <h4>Right to Data Portability</h4>
                  <p>Export your data in a structured, commonly used format (JSON, CSV).</p>

                  <h4>Right to Restrict Processing</h4>
                  <p>Request that we limit how we process your data in certain circumstances.</p>

                  <h4>Right to Object</h4>
                  <p>Object to processing based on legitimate interests or for direct marketing purposes.</p>

                  <h4>Right to Withdraw Consent</h4>
                  <p>Withdraw consent for data processing at any time (does not affect processing based on other legal bases).</p>

                  <h4>CCPA-Specific Rights (California Residents)</h4>
                  <ul>
                    <li>Know what personal information is collected and how it's used</li>
                    <li>Delete personal information (subject to exceptions)</li>
                    <li>Opt-out of the sale of personal information (we don't sell data)</li>
                    <li>Non-discrimination for exercising privacy rights</li>
                  </ul>

                  <h3>7. Data Retention Policy</h3>
                  <p>We retain data for:</p>
                  <ul>
                    <li><strong>Account Data:</strong> Until account deletion or 3 years of inactivity</li>
                    <li><strong>Transaction Records:</strong> 7 years (tax and legal requirements)</li>
                    <li><strong>Campaign Content:</strong> Until campaign completion + 2 years, or as specified in campaign agreement</li>
                    <li><strong>Support Communications:</strong> 3 years</li>
                    <li><strong>Analytics Data:</strong> 26 months (aggregated, anonymized data may be retained longer)</li>
                    <li><strong>Legal Holds:</strong> As required by law or ongoing disputes</li>
                  </ul>

                  <h3>8. Security Measures</h3>
                  <p>We implement technical and organizational measures:</p>
                  <ul>
                    <li>End-to-end encryption for sensitive data</li>
                    <li>Secure payment processing (PCI DSS compliant)</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Access controls and authentication (2FA available)</li>
                    <li>Data backup and disaster recovery procedures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p>
                    While we strive to protect your data, no system is 100% secure. Use strong passwords and enable 2FA.
                  </p>

                  <h3>9. Cross-Border Data Transfers</h3>
                  <p>
                    Your data may be processed in the United States, European Union, or other jurisdictions where our service providers operate.
                  </p>
                  <p>
                    <strong>EU Transfers:</strong> We use Standard Contractual Clauses (SCCs) approved by the European Commission for transfers outside the EEA.
                  </p>
                  <p>
                    <strong>Adequacy Decisions:</strong> We rely on adequacy decisions where applicable (e.g., EU-US Data Privacy Framework).
                  </p>

                  <h3>10. Children's Privacy</h3>
                  <p>
                    Our services are not intended for children under 13 (or 16 in the EU). We do not knowingly collect data from children. 
                    If we discover we've collected data from a child, we'll delete it immediately. Parents can contact us to request deletion.
                  </p>

                  <h3>11. Data Protection Officer</h3>
                  <p>
                    For GDPR-related inquiries, contact our Data Protection Officer:
                  </p>
                  <ul>
                    <li>Email: privacy@viralforge.com</li>
                    <li>Address: [Your Company Address]</li>
                  </ul>

                  <h3>12. Changes to This Policy</h3>
                  <p>
                    We may update this policy periodically. Material changes will be notified via email or platform notification at least 30 days before taking effect.
                  </p>

                  <h3>13. Contact Us</h3>
                  <p>
                    For privacy inquiries or to exercise your rights:
                  </p>
                  <ul>
                    <li>Email: privacy@viralforge.com</li>
                    <li>Support: support@viralforge.com</li>
                    <li>Data Subject Request Form: <a href="/privacy/request" className="text-primary hover:underline">Submit Request</a></li>
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

            <TabsContent value="aup">
              <Card>
                <CardHeader>
                  <CardTitle>Acceptable Use Policy</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    This Acceptable Use Policy ("AUP") governs your use of ViralForge and is incorporated into our Terms of Service. 
                    Violations may result in account suspension or termination.
                  </p>

                  <h3>1. Prohibited Activities</h3>
                  
                  <h4>Illegal Activities</h4>
                  <ul>
                    <li>Any activity that violates local, state, national, or international laws</li>
                    <li>Fraud, money laundering, or financial crimes</li>
                    <li>Infringement of intellectual property rights</li>
                    <li>Distribution of malware, viruses, or harmful code</li>
                    <li>Unauthorized access to systems or data</li>
                  </ul>

                  <h4>Prohibited Content</h4>
                  <ul>
                    <li>Hate speech, discrimination, or harassment based on race, religion, gender, etc.</li>
                    <li>Violence, threats, or incitement to violence</li>
                    <li>Adult content, pornography, or sexually explicit material</li>
                    <li>Misleading, false, or deceptive advertising</li>
                    <li>Spam, phishing, or fraudulent schemes</li>
                    <li>Content promoting illegal substances or activities</li>
                    <li>Copyrighted material without authorization</li>
                    <li>Personal information of others without consent</li>
                  </ul>

                  <h4>Platform Abuse</h4>
                  <ul>
                    <li>Creating multiple accounts to circumvent restrictions</li>
                    <li>Manipulating ratings, reviews, or metrics</li>
                    <li>Interfering with other users' campaigns or accounts</li>
                    <li>Scraping or automated data collection without permission</li>
                    <li>Reverse engineering or attempting to access source code</li>
                    <li>Overloading or disrupting platform infrastructure</li>
                  </ul>

                  <h4>Payment & Transaction Violations</h4>
                  <ul>
                    <li>Chargeback fraud or payment disputes in bad faith</li>
                    <li>Circumventing platform fees</li>
                    <li>Money laundering or structuring transactions to avoid reporting</li>
                    <li>Using stolen payment methods</li>
                    <li>Fake campaigns or deliverables</li>
                  </ul>

                  <h3>2. Content Standards</h3>
                  <p>All content must:</p>
                  <ul>
                    <li>Be original or properly licensed</li>
                    <li>Comply with platform advertising guidelines</li>
                    <li>Respect intellectual property rights</li>
                    <li>Not mislead or deceive users</li>
                    <li>Comply with platform disclosure requirements (e.g., #ad, #sponsored)</li>
                  </ul>

                  <h3>3. User Conduct</h3>
                  <p>Users must:</p>
                  <ul>
                    <li>Treat other users with respect and professionalism</li>
                    <li>Communicate honestly and transparently</li>
                    <li>Fulfill campaign obligations as agreed</li>
                    <li>Report violations or suspicious activity</li>
                    <li>Not impersonate others or misrepresent identity</li>
                  </ul>

                  <h3>4. Enforcement</h3>
                  <p>
                    Violations may result in:
                  </p>
                  <ul>
                    <li><strong>Warning:</strong> First-time minor violations</li>
                    <li><strong>Suspension:</strong> Temporary account restriction (7-30 days)</li>
                    <li><strong>Termination:</strong> Permanent account ban</li>
                    <li><strong>Legal Action:</strong> For serious violations or illegal activity</li>
                    <li><strong>Financial Penalties:</strong> For payment-related violations</li>
                  </ul>

                  <h3>5. Reporting Violations</h3>
                  <p>
                    Report violations to: abuse@viralforge.com or through the platform reporting feature.
                  </p>
                  <p>
                    Include: description of violation, evidence (screenshots, links), and your contact information.
                  </p>

                  <h3>6. Appeals</h3>
                  <p>
                    Users may appeal enforcement actions within 30 days by contacting support@viralforge.com with:
                  </p>
                  <ul>
                    <li>Account information</li>
                    <li>Reason for appeal</li>
                    <li>Supporting evidence</li>
                  </ul>

                  <h3>7. Updates</h3>
                  <p>
                    This AUP may be updated periodically. Continued use constitutes acceptance of changes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dmca">
              <Card>
                <CardHeader>
                  <CardTitle>DMCA Takedown Procedure</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    ViralForge respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). 
                    This page outlines our procedure for handling copyright infringement claims.
                  </p>

                  <h3>1. Filing a DMCA Takedown Notice</h3>
                  <p>
                    If you believe content on ViralForge infringes your copyright, send a takedown notice to our designated agent:
                  </p>
                  <div className="bg-muted p-4 rounded-lg my-4">
                    <p><strong>DMCA Agent:</strong></p>
                    <p>ViralForge Legal Department</p>
                    <p>Email: dmca@viralforge.com</p>
                    <p>Address: [Your Company Address]</p>
                  </div>

                  <h3>2. Required Information</h3>
                  <p>Your takedown notice must include:</p>
                  <ul>
                    <li><strong>Identification:</strong> Description of the copyrighted work claimed to be infringed</li>
                    <li><strong>Location:</strong> Specific URL(s) or location of infringing content</li>
                    <li><strong>Contact Information:</strong> Your name, address, phone, and email</li>
                    <li><strong>Good Faith Statement:</strong> Statement that you believe the use is not authorized</li>
                    <li><strong>Accuracy Statement:</strong> Statement that information is accurate and you're authorized to act</li>
                    <li><strong>Signature:</strong> Physical or electronic signature of copyright owner or agent</li>
                  </ul>

                  <h3>3. Takedown Form</h3>
                  <div className="border rounded-lg p-6 my-4">
                    <h4 className="font-semibold mb-4">DMCA Takedown Request Form</h4>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Copyright Owner Name *</label>
                        <input type="text" className="w-full p-2 border rounded" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Email *</label>
                        <input type="email" className="w-full p-2 border rounded" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Phone *</label>
                        <input type="tel" className="w-full p-2 border rounded" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Copyrighted Work Description *</label>
                        <textarea className="w-full p-2 border rounded" rows={3} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Infringing Content URL(s) *</label>
                        <textarea className="w-full p-2 border rounded" rows={3} placeholder="One URL per line" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Good Faith Statement *</label>
                        <textarea 
                          className="w-full p-2 border rounded" 
                          rows={2} 
                          defaultValue="I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law."
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Accuracy Statement *</label>
                        <textarea 
                          className="w-full p-2 border rounded" 
                          rows={2} 
                          defaultValue="I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or authorized to act on behalf of the copyright owner."
                          required 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" required />
                        <label className="text-sm">I understand that false claims may result in liability for damages</label>
                      </div>
                      <Button type="submit" className="w-full">Submit Takedown Request</Button>
                    </form>
                  </div>

                  <h3>4. Timeline Expectations</h3>
                  <ul>
                    <li><strong>Receipt:</strong> We acknowledge receipt within 2 business days</li>
                    <li><strong>Review:</strong> We review and process valid notices within 5-10 business days</li>
                    <li><strong>Removal:</strong> Infringing content is removed promptly upon verification</li>
                    <li><strong>Notification:</strong> Content owner and alleged infringer are notified</li>
                  </ul>

                  <h3>5. Counter-Notice Procedure</h3>
                  <p>
                    If you believe your content was removed in error, you may file a counter-notice:
                  </p>
                  <ul>
                    <li>Must be filed within 10 business days of takedown</li>
                    <li>Must include: identification of removed content, statement of good faith belief of error, consent to jurisdiction, and signature</li>
                    <li>Send to: dmca@viralforge.com</li>
                  </ul>
                  <p>
                    Upon receiving a valid counter-notice, we will:
                  </p>
                  <ul>
                    <li>Notify the original complainant</li>
                    <li>Restore content within 10-14 business days unless complainant files a court action</li>
                  </ul>

                  <h3>6. Repeat Infringer Policy</h3>
                  <p>
                    Users who repeatedly infringe copyrights may have their accounts terminated. 
                    We maintain records of takedown notices and may terminate accounts after 3 valid notices.
                  </p>

                  <h3>7. False Claims</h3>
                  <p>
                    <strong>Warning:</strong> Filing false DMCA notices may result in:
                  </p>
                  <ul>
                    <li>Liability for damages (including costs and attorney fees)</li>
                    <li>Account termination</li>
                    <li>Legal action</li>
                  </ul>
                  <p>
                    Only file takedown notices if you genuinely believe content infringes your copyright.
                  </p>

                  <h3>8. Admin Handling Flow</h3>
                  <ol>
                    <li>Receive and log takedown notice</li>
                    <li>Verify notice completeness and validity</li>
                    <li>Identify and locate infringing content</li>
                    <li>Remove or disable access to content</li>
                    <li>Notify content owner (if known) and alleged infringer</li>
                    <li>Document action in our records</li>
                    <li>Monitor for counter-notices</li>
                    <li>Process counter-notices if received</li>
                  </ol>

                  <h3>9. Contact</h3>
                  <p>
                    For DMCA-related inquiries: dmca@viralforge.com
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gdpr">
              <Card>
                <CardHeader>
                  <CardTitle>GDPR Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
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
