// BACKUP: Standalone Contact API Server (falls Docker nicht funktioniert)
// Verwendung: node backup-working-contact-api.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('dist/public'));

// Email transporter
const transporter = nodemailer.createTransporter({
  host: 'smtp.strato.de',
  port: 465,
  secure: true,
  auth: {
    user: 'info@walterbraun-umzuege.de',
    pass: process.env.EMAIL_PASSWORD || 'your_email_password'
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'backup-contact-api'
  });
});

// Contact form API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    console.log('📧 Contact form submission:', { name, email, phone });
    
    // Send email
    const mailOptions = {
      from: 'info@walterbraun-umzuege.de',
      to: 'ceo@skyline-websites.de',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Gesendet am ${new Date().toLocaleString('de-DE')}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    
    res.json({ 
      success: true, 
      message: 'Kontaktanfrage erfolgreich gesendet',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Senden der Nachricht'
    });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backup Contact API Server läuft auf Port ${PORT}`);
  console.log(`🌐 Zugriff: http://localhost:${PORT}`);
  console.log(`📧 Contact API: POST /api/contact`);
});