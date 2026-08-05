const sendEmail = async (to, subject, text) => {
  console.log(`Email to ${to}: ${subject}\n${text}`);
};

module.exports = { sendEmail };
