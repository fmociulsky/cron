const creds = require('./client_secret.json');
const {GoogleSpreadsheet} = require('google-spreadsheet');

async function guardarGenRows(rows){
    const parserHtml = require('./parserHtml');
    const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
    await doc.loadInfo();
    const sheet = doc.sheetsById['0']; // or use doc.sheetsById[id]
    const rowsObj = [];
    rows.forEach(row => {
      rowsObj.push(row.rowObj);
    });
    await sheet.addRows(rowsObj);
    await parserHtml.parsearPromos(rows);
}

async function guardarMultiRows(rows){
    const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
    await doc.loadInfo();
    const sheet = doc.sheetsById['655294633']; // or use doc.sheetsById[id]
    const rowsObj = [];
    rows.forEach(row => {
      rowsObj.push(row.rowObj);
    });
    await sheet.addRows(rowsObj);
    rows.forEach(row => {
      const parserHtml = require('./parserHtml');
      const urlPromo = process.env.URL + row.a.rawAttrs.replace('href="','').replace('"','')
      //parserHtml.getPromoGraph(urlPromo, row.rowObj, true, false);
    });
}

async function guardarDetalleGenRow(rows, i){
  console.log("Guardo Detalle Simple " + i);
  console.log(i + " Lineas --------- ");
  //console.log(rows);
  //TODO cambiar a que guarde en un archivo localmente
  try{
    const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
    await doc.loadInfo();
    const sheet = doc.sheetsById['1660537107']; // or use doc.sheetsById[id]
    await sheet.addRows(rows);
  }catch(err){
    console.log("!!!!!!!! ERROR !!!!!!!!!!");
  }
  
}

async function guardarDetalleMultiRow(rows){
  console.log("Guardo Detalle Multi");
  const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
  await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  await doc.loadInfo();
  const sheet = doc.sheetsById['287363753']; // or use doc.sheetsById[id]
  await sheet.addRows(rows);
}

module.exports = {guardarGenRows, guardarMultiRows, guardarDetalleGenRow, guardarDetalleMultiRow}