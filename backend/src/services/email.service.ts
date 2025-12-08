import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import env from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      logger.warn('Email service not configured - SMTP credentials missing');
    }
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email service not available, skipping email send');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM || 'noreply@viralforge.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      });

      logger.info(`Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      logger.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send campaign creation confirmation with AI optimization tip
   */
  async sendCampaignCreatedEmail(
    userEmail: string,
    userName: string,
    campaignTitle: string,
    campaignId: string,
    optimizationTip: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .tip-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Campaign Created Successfully!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your campaign <strong>"${campaignTitle}"</strong> has been created and is ready to go!</p>
              
              <div class="tip-box">
                <h3>💡 AI Optimization Tip</h3>
                <p>${optimizationTip}</p>
              </div>

              <p>Next steps:</p>
              <ul>
                <li>Review your campaign details</li>
                <li>Browse suggested creators</li>
                <li>Start connecting with influencers</li>
              </ul>

              <a href="${env.FRONTEND_URL}/campaigns/${campaignId}" class="button">View Campaign</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Campaign Created: ${campaignTitle}`,
      html,
    });
  }

  /**
   * Send reactivation email for inactive users
   */
  async sendReactivationEmail(
    userEmail: string,
    userName: string,
    recommendations: string[]
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .recommendation { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #f5576c; }
            .button { display: inline-block; padding: 12px 24px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 We Miss You!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>We noticed you haven't been active on ViralForge recently. Here are some personalized recommendations to get you back in the game:</p>
              
              ${recommendations
                .map(
                  (rec) => `
                <div class="recommendation">
                  <p>${rec}</p>
                </div>
              `
                )
                .join('')}

              <a href="${env.FRONTEND_URL}/dashboard" class="button">Return to Dashboard</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Come Back to ViralForge - We Have Recommendations for You!',
      html,
    });
  }

  /**
   * Send weekly summary email with analytics and suggestions
   */
  async sendWeeklySummaryEmail(
    userEmail: string,
    userName: string,
    userRole: string,
    analytics: {
      totalCampaigns?: number;
      activeCampaigns?: number;
      totalSpent?: number;
      totalEarnings?: number;
      activeContracts?: number;
      views?: number;
      engagements?: number;
    },
    suggestions: string[]
  ): Promise<boolean> {
    const isBrand = userRole === 'BRAND';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-box { background: white; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            .suggestion { background: #e8f5e9; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #4caf50; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your Weekly Summary</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Here's your weekly performance summary and personalized suggestions:</p>
              
              <div class="stats">
                ${isBrand ? `
                  <div class="stat-box">
                    <div class="stat-value">${analytics.totalCampaigns || 0}</div>
                    <div class="stat-label">Total Campaigns</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-value">${analytics.activeCampaigns || 0}</div>
                    <div class="stat-label">Active Campaigns</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-value">$${analytics.totalSpent?.toLocaleString() || 0}</div>
                    <div class="stat-label">Total Spent</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-value">${analytics.activeContracts || 0}</div>
                    <div class="stat-label">Active Contracts</div>
                  </div>
                ` : `
                  <div class="stat-box">
                    <div class="stat-value">$${analytics.totalEarnings?.toLocaleString() || 0}</div>
                    <div class="stat-label">Total Earnings</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-value">${analytics.activeContracts || 0}</div>
                    <div class="stat-label">Active Contracts</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-value">${analytics.views?.toLocaleString() || 0}</div>
                    <div class="stat-label">Total Views</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-value">${analytics.engagements?.toLocaleString() || 0}</div>
                    <div class="stat-label">Engagements</div>
                  </div>
                `}
              </div>

              <h3>💡 Personalized Suggestions</h3>
              ${suggestions
                .map(
                  (suggestion) => `
                <div class="suggestion">
                  <p>${suggestion}</p>
                </div>
              `
                )
                .join('')}

              <a href="${env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Your Weekly ViralForge Summary',
      html,
    });
  }

  /**
   * Convert HTML to plain text (simple version)
   */
  /**
   * Welcome email for new users
   */
  async sendWelcomeEmail(
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to your new creator superpower!</h1>
            </div>
            <div class="content">
              <p>Hey ${userName},</p>
              <p>Welcome to the platform built to help you grow faster.</p>
              <p>Inside, you'll find AI tools, growth services, and insights to scale your influence.</p>
              <p>Let's get started.</p>
              <a href="${env.FRONTEND_URL}/dashboard" class="button">Start Here →</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to your new creator superpower 🚀',
      html,
    });
  }

  /**
   * Tools introduction email
   */
  async sendToolsIntroductionEmail(
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛠️ The tools top creators are using today</h1>
            </div>
            <div class="content">
              <p>Hey ${userName},</p>
              <p>Here are the powerful tools that can transform your content creation:</p>
              <div class="feature">
                <h3>✨ AI Content Tools</h3>
                <p>Generate scripts, ideas, captions, thumbnails, and hashtags instantly.</p>
              </div>
              <div class="feature">
                <h3>📈 Growth Services</h3>
                <p>Access editing, shoutouts, brand kits, and trend research from verified vendors.</p>
              </div>
              <div class="feature">
                <h3>📊 Analytics Dashboard</h3>
                <p>Track performance, monitor progress, and get personalized recommendations.</p>
              </div>
              <a href="${env.FRONTEND_URL}/marketplace" class="button">Try the Tools</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'The tools top creators are using today',
      html,
    });
  }

  /**
   * Social proof email
   */
  async sendSocialProofEmail(
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .testimonial { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 See how creators are growing 5× faster</h1>
            </div>
            <div class="content">
              <p>Hey ${userName},</p>
              <p>Don't just take our word for it. Here's what creators are saying:</p>
              <div class="testimonial">
                <p><em>"I gained 20K new followers in 2 months using their growth bundles."</em></p>
                <p><strong>— María A., TikTok Creator</strong></p>
              </div>
              <div class="testimonial">
                <p><em>"Best platform for creators starting from zero."</em></p>
                <p><strong>— Aiden L., Small Business Owner</strong></p>
              </div>
              <p>Ready to join them?</p>
              <a href="${env.FRONTEND_URL}/auth?mode=signup" class="button">Start Your Growth</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'See how creators are growing 5× faster',
      html,
    });
  }

  /**
   * Abandoned checkout email
   */
  async sendAbandonedCheckoutEmail(
    userEmail: string,
    userName: string,
    checkoutUrl: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .discount { background: #e8f5e9; border: 2px solid #4caf50; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💭 Still thinking about it?</h1>
            </div>
            <div class="content">
              <p>Hey ${userName},</p>
              <p>You were one step away from leveling up your content.</p>
              <div class="discount">
                <h3>🎁 Special Offer: 10% Off</h3>
                <p>Complete your order now and save 10%!</p>
              </div>
              <a href="${checkoutUrl}" class="button">Complete Your Order</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Still thinking about it?',
      html,
    });
  }

  /**
   * Weekly newsletter template
   */
  async sendWeeklyNewsletter(
    userEmail: string,
    userName: string,
    trendingSounds: string[],
    viralHooks: string[],
    growthTip: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📈 Creator Trends You Need This Week</h1>
            </div>
            <div class="content">
              <p>Hey ${userName},</p>
              <div class="section">
                <h3>🎵 Trending Sounds</h3>
                <ul>
                  ${trendingSounds.map(sound => `<li>${sound}</li>`).join('')}
                </ul>
              </div>
              <div class="section">
                <h3>🔥 Viral Hooks</h3>
                <ul>
                  ${viralHooks.map(hook => `<li>${hook}</li>`).join('')}
                </ul>
              </div>
              <div class="section">
                <h3>💡 Growth Tip of the Week</h3>
                <p>${growthTip}</p>
              </div>
              <a href="${env.FRONTEND_URL}/marketplace" class="button">Try New Tools</a>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Creator Trends You Need This Week',
      html,
    });
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
}

export default new EmailService();


