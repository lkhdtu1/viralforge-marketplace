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

