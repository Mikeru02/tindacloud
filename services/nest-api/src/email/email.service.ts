import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(EmailService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPassword = this.configService.get('SMTP_PASSWORD');

    if (!smtpUser || !smtpPassword) {
      this.logger.warn('SMTP credentials not configured. Email sending will be disabled.');
      this.logger.warn('Set SMTP_USER and SMTP_PASSWORD environment variables to enable email sending.');
      this.isConfigured = false;
    } else {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get('SMTP_PORT') || '587'),
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });
      this.isConfigured = true;
    }
  }

  async sendInvitationEmail(email: string, token: string, merchantName: string, role: string) {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn('Email service not configured. Skipping email send.');
      this.logger.warn(`Invitation link: ${this.getInvitationLink(token)}`);
      return;
    }

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const invitationLink = `${frontendUrl}/invite/${token}`;

    const mailOptions = {
      from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
      to: email,
      subject: `You're invited to join ${merchantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Staff Invitation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #22c55e;
              font-size: 24px;
              font-weight: bold;
            }
            .title {
              color: #1a1a1a;
              font-size: 28px;
              margin: 20px 0;
            }
            .content {
              color: #666;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: #22c55e;
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: #16a34a;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 12px;
              text-align: center;
            }
            .link {
              color: #22c55e;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">TindaCloud</div>
            </div>
            
            <h1 class="title">You're Invited!</h1>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>You have been invited to join <strong>${merchantName}</strong> as a <strong>${role}</strong>.</p>
              
              <p>Click the button below to accept the invitation and create your account:</p>
              
              <div style="text-align: center;">
                <a href="${invitationLink}" class="button">Accept Invitation</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p class="link">${invitationLink}</p>
              
              <p style="margin-top: 30px; font-size: 14px; color: #999;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} TindaCloud. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Invitation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Error sending invitation email to ${email}:`, error);
      throw error;
    }
  }

  private getInvitationLink(token: string): string {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    return `${frontendUrl}/invite/${token}`;
  }

  async verifyConnection() {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn('Email service not configured. Skipping connection verification.');
      return false;
    }

    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('SMTP connection verification failed:', error);
      return false;
    }
  }

  isEmailConfigured(): boolean {
    return this.isConfigured;
  }
}
