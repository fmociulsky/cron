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
    if(spans[0].text.includes("+")){
      titulo1 = spans[0].text.replace('\n','').replace('\n','').trim().split(" + ");
      titulo2 = spans[1].text.replace('\n','').replace('\n','').replace('Desde ', '').trim();
      const rowObj = {
        Fecha: fecha,
        IdaDesde: titulo2,
        IdaHasta: titulo1[0],
        VueltaDesde: titulo1[1],
        VueltaHasta: titulo2,
        Precio: spans[2].text.replace('\n','').replace('\n','').replace('$','').replace('.','').trim(),
        Multitramo: 'SI' 
      }
      return rowObj;
    }else{
      const desde = spans[0].text.replace('\n','').replace('\n','').trim().split(" - ");
      const hasta = spans[1].text.replace('\n','').replace('\n','').trim().split(" - ");
      const rowObj = {
          Fecha: fecha,
          IdaDesde: desde[0],
          IdaHasta: desde[1],
          VueltaDesde: hasta[0],
          VueltaHasta: hasta[1],
          Precio: spans[2].text.replace('\n','').replace('\n','').replace('$','').replace('.','').trim(),
          Multitramo: 'NO' 
      }
      return rowObj;
    }
}


async function getPromoGraph(browser, page, urlPromo, row, isMulti, isOneWay, i) {
    try {
      const parser = require("node-html-parser");
      const rowsGen = [];
      const rowsMulti = [];
      await page.goto(urlPromo, { waitUntil: 'networkidle0' });
      const data = await page.evaluate(() => document.querySelector('#priceBarChart').outerHTML);
      const ps = parser.parse(data).querySelectorAll("p");
      const spans = parser.parse(data).querySelectorAll("span");
      console.log("------- " + i + " Span encontrados: " + spans.length);
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
      googleSheetsUtils.guardarDetalleMultiRow(rowsMulti);
      googleSheetsUtils.guardarDetalleGenRow(rowsGen, i);
    } catch (err) {
      console.error(err);
    }
  }

  async function parsearPromos(rows){
    let i = 1;

    rows.forEach(async row => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      const parserHtml = require('./parserHtml');
      const urlPromo = process.env.URL + row.a.rawAttrs.replace('href="','').replace('"','')
      console.log(i + " - " + urlPromo);
      getPromoGraph(browser, page, urlPromo, row.rowObj, false, row.rowObj.isOneWay == 'SI', i);
      i++;
    });
  }

module.exports = {obtenerH2Promos, getGenRow, getMultiRow, getPromoGraph, parsearPromos}