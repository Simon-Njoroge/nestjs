import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, 
      auth: {
        user: this.configService.get<string>('SMTP_USERNAME'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email transport verification failed:', error);
      } else {
        console.log('Email service is ready.');
      }
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    const fromName = this.configService.get<string>('EMAIL_FROM');
    const fromAddress = this.configService.get<string>('SMTP_FROM_NAME');

    await this.transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${to} with subject "${subject}"`);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL');

    const html = `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for joining our platform.</p>
      <p><a href="${appUrl}/login">Login here</a></p>
    `;

    await this.sendEmail(email, 'Welcome to Our Platform', html);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL');
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await this.sendEmail(email, 'Password Reset Request', html);
  }
}
