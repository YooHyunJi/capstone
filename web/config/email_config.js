// 이메일 접속 정보

var nodemailer = require('nodemailer');
require('dotenv').config();

const config = {
    mailer: {
        user: 'airosk.official@gmail.com',
        password: process.env.EMAIL_SECRET
    }
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: config.mailer.user,  
      pass: config.mailer.password   
    }
  });

module.exports = transporter;