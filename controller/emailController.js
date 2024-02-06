import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brian.kyounghoon.kim@gmail.com",
    pass: process.env.NODEMAILER_PW,
  },
});

const sendEmail = async (name, email) => {
  const mailOptions = {
    from: "brain@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    text: `Hey ${name}, That was easy!`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendEmail;
