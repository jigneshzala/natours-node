const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  /*  var transporter = nodemailer.createTransport({
     host: "smtp.mailtrap.io",
     port: 2525,
     auth: {
       user: "dbe5ecad69fd4b",
       pass: "344a7c0c576013"
     }
   }); */

  // 2) Define the email options
  const mailOptions = {
    from: 'Jigar kumar <hello@jigar.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;