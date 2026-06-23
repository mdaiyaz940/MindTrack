const sendEmail = async (options) => {
  // For development, just log the email
  console.log('Email would be sent:');
  console.log('To:', options.email);
  console.log('Subject:', options.subject);
  console.log('Message:', options.message);
  
  // In production, you would use a service like SendGrid, Mailgun, etc.
  // Example with nodemailer:
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message
  });
  */
};

module.exports = sendEmail;