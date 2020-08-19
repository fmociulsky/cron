const parser = require("node-html-parser");
const puppeteer = require('puppeteer');
const googleSheetsUtils = require('./googleSheetsUtils');

function obtenerH2Promos(body){
    const root = parser.parse(body);
    const promos = root.querySelector("#flightBestpricesGrid");
    const row = promos.querySelector(".row");
    return row.querySelectorAll(".tc-img-destino");
}


function getGenRow(spans, fecha, isOneWay){
    const rowObj = {
        Fecha: fecha,
        Desde: spans[1].text.replace('\n','').replace('\n','').replace('Desde ', '').trim(),
        Hasta: spans[0].text.replace('\n','').replace('\n','').trim(),
        Precio: spans[2].text.replace('\n','').replace('\n','').replace('$','').replace('.','').trim(),
        IdaSola: isOneWay ? "SI" : "NO"
    }
    return rowObj;
}

function getMultiRow(spans, fecha){
    const desde = spans[0].text.replace('\n','').replace('\n','').trim().split(" - ");
    const hasta = spans[1].text.replace('\n','').replace('\n','').trim().split(" - ");
    const rowObj = {
        Fecha: fecha,
        IdaDesde: desde[0],
        IdaHasta: desde[1],
        VueltaDesde: hasta[0],
        VueltaHasta: hasta[1],
        Precio: spans[2].text.replace('\n','').replace('\n','').replace('$','').replace('.','').trim() 
    }

    return rowObj;
}

async function getPromoGraph(urlPromo, row, isMulti, isOneWay) {
    try {
      const parser = require("node-html-parser");
      const browser = await puppeteer.launch();
      const [page] = await browser.pages();
      const rowsGen = [];
      const rowsMulti = [];
      await page.goto(urlPromo, { waitUntil: 'networkidle0' });
      const data = await page.evaluate(() => document.querySelector('#priceBarChart').outerHTML);
      const ps = parser.parse(data).querySelectorAll("p");
      const spans = parser.parse(data).querySelectorAll("span");
      for (let i = 0; i < ps.length; i++) {
        const precio = ps[i].text.replace('Desde $ ','').replace('.','');
        const mes = spans[i].getAttribute("title");
        const rowAux = {
            
        }
        rowAux.Mes = mes;
        rowAux.Precio = precio;
        
        if(isMulti){
            const rowAux = {
                Fecha: row.Fecha,
                IdaDesde: row.IdaDesde,
                IdaHasta: row.IdaHasta,
                VueltaDesde: row.VueltaDesde,
                VueltaHasta: row.VueltaHasta,
                Precio: precio,
                Mes: mes
            }
            rowsMulti.push(rowAux);
          }else{
            const rowAux = {
                Fecha: row.Fecha,
                Desde: row.Desde,
                Hasta: row.Hasta,
                IdaSola: row.IdaSola,
                Precio: precio,
                Mes: mes
            }
            rowsGen.push(rowAux);
          }
      }
      await googleSheetsUtils.guardarDetalleMultiRow(rowsMulti);
      await googleSheetsUtils.guardarDetalleGenRow(rowsGen);
      await browser.close();
    } catch (err) {
      console.error(err);
    }
  }

module.exports = {obtenerH2Promos, getGenRow, getMultiRow, getPromoGraph}