const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(cors());
app.use(express.json());

// Set up the Brevo (Sendinblue) Transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

app.post('/send-audit', (req, res) => {
  const data = req.body;

  const mailOptions = {
    from: 'mateasanidze808@gmail.com',
    to: '1surveyfeedback@gmail.com', 
    subject: `Audit Result: ${data.name}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Audit Submission</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Company Size:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.company_size} staff</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Traditional Spend:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${data.traditional_spend_raw}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Estimated Savings:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #28a745; font-weight: bold;">$${data.value_range_estimate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Service Type:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.service_type}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>Status:</strong></td>
            <td style="padding: 10px;"><span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${data.status}</span></td>
          </tr>
        </table>
        
        <p style="font-size: 12px; color: #999; margin-top: 20px;">Sent automatically from your Website Audit Tool.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending email");
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));