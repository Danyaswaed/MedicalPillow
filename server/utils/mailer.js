const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReply = async (to, subject, message) => {
  return transporter.sendMail({
    from: `"Cervica Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Cervica</h2>

        <p>${message}</p>

        <hr>

        <small>
          Thank you for contacting Cervica.
        </small>
      </div>
    `,
  });
};

module.exports = {
  sendReply,
};
