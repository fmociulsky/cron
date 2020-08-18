const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASS
    }
  });

function enviarMailError(){
    var mailOptions = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'Error al obtener las ofertas',
        text: 'Por algun error no se pudieron obtener las ofertas. Hablar con Fer'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado a : ' + process.env.MAIL_TO);
        }
      });
}

module.exports = {enviarMailError}