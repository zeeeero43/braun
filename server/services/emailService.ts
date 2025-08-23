import nodemailer from 'nodemailer';
import type { ContactSubmission } from '../../shared/schema';

const EMAIL_CONFIG = {
  host: 'smtp.strato.de',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'info@walterbraun-umzuege.de',
    pass: 'Walterbraun123@'
  }
};

const RECIPIENT_EMAIL = 'info@walterbraun-umzuege.de';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth,
    });
  }

  async sendContactFormEmail(submission: ContactSubmission) {
    try {
      const mailOptions = {
        from: `"Walter Braun Umzüge" <${EMAIL_CONFIG.auth.user}>`,
        to: RECIPIENT_EMAIL,
        subject: `Neue Kontaktanfrage von ${submission.name}`,
        html: `
          <h2>Neue Kontaktanfrage von der Website</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif;">
            <h3 style="color: #2d5016; margin-bottom: 20px;">Kontaktdaten:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td>
                <td style="padding: 8px 0; color: #666;">${submission.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">E-Mail:</td>
                <td style="padding: 8px 0; color: #666;">
                  <a href="mailto:${submission.email}" style="color: #2d5016;">${submission.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">Telefon:</td>
                <td style="padding: 8px 0; color: #666;">
                  <a href="tel:${submission.phone}" style="color: #2d5016;">${submission.phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333; vertical-align: top;">Nachricht:</td>
                <td style="padding: 8px 0; color: #666;">${submission.message.replace(/\n/g, '<br>')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">Eingegangen am:</td>
                <td style="padding: 8px 0; color: #666;">${submission.createdAt ? new Date(submission.createdAt).toLocaleString('de-DE') : 'N/A'}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #2d5016; font-size: 14px;">
              <strong>Wichtig:</strong> Bitte antworten Sie schnellstmöglich auf diese Anfrage, 
              um eine hohe Kundenzufriedenheit zu gewährleisten.
            </p>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #999; font-size: 12px; margin: 0;">
            Diese E-Mail wurde automatisch von der Walter Braun Umzüge Website generiert.<br>
            Website: <a href="https://walterbraun-muenchen.de" style="color: #2d5016;">walterbraun-muenchen.de</a>
          </p>
        `,
        text: `
Neue Kontaktanfrage von der Website

Name: ${submission.name}
E-Mail: ${submission.email}
Telefon: ${submission.phone}
Nachricht: ${submission.message}
Eingegangen am: ${submission.createdAt ? new Date(submission.createdAt).toLocaleString('de-DE') : 'N/A'}

Bitte antworten Sie schnellstmöglich auf diese Anfrage.
        `.trim()
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Contact form email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send contact form email:', error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();