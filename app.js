const cron = require("node-cron");
const express = require("express");
const request = require("request");
const format = require('date-format');
const {promisify} = require('util');
const parser = require("node-html-parser");
const parserHtml = require('./parserHtml');
const googleSheetsUtils = require('./googleSheetsUtils');
const mailUtils = require('./mailUtils');
require('events').EventEmitter.defaultMaxListeners = 25
require('dotenv').config();
app = express();


//parsearHTML();
//cron.schedule('*/5 * * * * ', parsearHTML);
parserHtml.pruebaPuppeter('https://www.turismocity.com.ar/vuelos-baratos-dos-tramos-SAO-ROM,LIS-BUE');

function parsearHTML() {
    const url = process.env.URL;
    console.log("Buscando en la url: " + url);
    request({uri: url}, 
        function(error, response, body) {
            const rowsGen = [];
            const rowsGenDetailPromo = [];
            const rowsMulti = [];
            const rowsMultiDetailPromo = [];
            const dt = new Date();
            dt.setHours( dt.getHours() - 3);
            const fecha = format("dd-MM-yyyy hh:mm:ss",dt);
            const h2s = parserHtml.obtenerH2Promos(body);
            console.log(fecha+ " - Se encontraron " + h2s.length + " ofertas");
            if(h2s.length > 0){
              for (let index = 0; index < h2s.length; index++){
                const h2 = h2s[index];
                const a = h2.querySelector('a');
                const isMulti = a.firstChild.rawText != ' ';
                const isOneWay = a.rawAttrs.includes('oneway');
                const spans = h2.querySelectorAll("span");
                if(spans.length > 0){
                  if(isMulti && !isOneWay){
                    const rowObj = parserHtml.getMultiRow(spans, fecha);
                    rowsMulti.push(rowObj);
                    //getDetallesPromoRow(a, rowObj, true, false);
                  }else{
                    const rowObj = parserHtml.getGenRow(spans, fecha, isOneWay);
                    rowsGen.push(rowObj);
                    //getDetallesPromoRow(a, rowObj, false, isOneWay);
                  }
                } 
              }
              googleSheetsUtils.guardarGenRows(rowsGen);
              googleSheetsUtils.guardarMultiRows(rowsMulti);
            }else{
              mailUtils.enviarMailError();
            }
    });
}

async function getDetallesPromoRow(a, row, isMulti, isOneWay){
  const urlPromo = process.env.URL + a.rawAttrs.replace('href="','').replace('"','')
  await parserHtml.getPromoGraph(urlPromo, row, isMulti, isOneWay);
}



const port = process.env.PORT || 5000
app.listen(port, () =>  {
    console.log('Servidor escuchando en el puerto ' + port)
});




