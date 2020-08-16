const cron = require("node-cron");
const express = require("express");
const request = require("request");
const parser = require("node-html-parser");
const {GoogleSpreadsheet} = require('google-spreadsheet');
const format = require('date-format');
const nodemailer = require('nodemailer')
const creds = require('./client_secret.json');
const {promisify} = require('util');
require('dotenv').config();
app = express();

var transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASS
    }
  });

cron.schedule('*/5 * * * * ', parsearHTML);

function parsearHTML() {
    const url = process.env.URL;
    console.log("Buscando en la url: " + url);
    request({uri: url}, 
        function(error, response, body) {
            const dt = new Date();
            dt.setHours( dt.getHours() - 3);
            const fecha = format("dd-MM-yyyy hh:mm:ss",dt);
            const root = parser.parse(body);
            const figures = root.querySelectorAll("figure");
            const rows = [];
            if(figures.length > 0){
                for (let index = 0; index < figures.length; index++) {
                    const spans = figures[index].querySelectorAll("span");
                    if(spans.length > 0){
                        const row = {
                            Fecha: fecha,
                            Desde: spans[0].text.replace('\n','').replace('\n','').trim(),
                            Hasta: spans[1].text.replace('\n','').replace('\n','').trim(),
                            Precio: spans[2].text.replace('\n','').replace('\n','').replace('$','').replace('.','').trim() 
                        }
                        rows.push(row);
                    }   
                }
                accessSpreadsheets(rows);
                console.log(fecha+ " - Se encontraron " + rows.length + " ofertas");
            }else{
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
            
    });
}

async function accessSpreadsheets(rows){
    const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    await sheet.addRows(rows);
}

const port = process.env.PORT || 5000
app.listen(port, () =>  {
    console.log('Servidor escuchando en el puerto ' + port)
});






