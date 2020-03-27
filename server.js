const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('dotenv').config({ path: path.resolve(__dirname + '/.env') });

app.post('/sendemail', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!(name && email && phone && subject && message)) {
    res.status(500).json({ error: 'required all fields' });
  }

  const transporter = nodemailer.createTransport({
    service: process.env.AUTH_USER_SERVICE,
    port: process.env.AUTH_USER_PORT,
    secure: false,
    auth: {
      user: process.env.AUTH_USER_EMAIL,
      pass: process.env.AUTH_USER_PWD
    }
  });

  const mailOptions = {
    from: process.env.AUTH_USER_EMAIL,
    to: process.env.TO_EMAIL,
    subject: `${subject}`,
    html: `<h1>Contact details</h1>
            <h2> name: ${name} </h2><br>
            <h2> email:${email} </h2><br>
            <h2> phone number:${phone}</h2><br>
            <p> message:${message} </p><br>`
  };

  transporter.sendMail(mailOptions, (error, inf) => {
    if (error) res.status(500).json({ error: error });
    res.status(200).json({ ok: inf });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
