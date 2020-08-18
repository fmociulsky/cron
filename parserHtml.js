const parser = require("node-html-parser");

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

module.exports = {obtenerH2Promos, getGenRow, getMultiRow}