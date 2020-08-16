const cron = require("node-cron");
const express = require("express");
const request = require("request");
const parser = require("node-html-parser");
const {GoogleSpreadsheet} = require('google-spreadsheet');
const format = require('date-format');
const creds = require('./client_secret.json');
const {promisify} = require('util');
app = express();

cron.schedule('*/5 * * * * ', parsearHTML);

function parsearHTML() {
    request({uri: "http://www.turismocity.com.ar"}, 
        function(error, response, body) {
            const fecha = format("dd-MM-yyyy hh:mm:ss",new Date());
            const root = parser.parse(body);
            const figures = root.querySelectorAll("figure");
            const rows = [];
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
            console.log(fecha+ " - " + rows.length);
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

app.listen(3000);






