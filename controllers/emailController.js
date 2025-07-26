import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 

export const sendComplaintEmail = async (req, res) => {
  const { name, email, complaintType, assignedTo } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS,     
      },
       tls: {
    rejectUnauthorized: false  
  }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Smart Nagar Nigam Complaint Submitted',
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Welcome to <strong>Smart Nagar Nigam Complaint Portal</strong>.</p>
        <p>Your complaint regarding <strong>${complaintType}</strong> has been successfully submitted.</p>
        <p>We have assigned <strong>${assignedTo}</strong> to handle your issue.</p>
        <p>Our team will contact you shortly.</p>
        <br/>
        <p>Thanks & Regards,<br/>Smart Nagar Nigam Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};
