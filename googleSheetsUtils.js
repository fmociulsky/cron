const creds = require('./client_secret.json');
const {GoogleSpreadsheet} = require('google-spreadsheet');

async function guardarGenRows(rows){
    const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
    await doc.loadInfo();
    const sheet = doc.sheetsById['0']; // or use doc.sheetsById[id]
    await sheet.addRows(rows);
}

async function guardarMultiRows(rows){
    const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
      });
    await doc.loadInfo();
    const sheet = doc.sheetsById['655294633']; // or use doc.sheetsById[id]
    await sheet.addRows(rows);
}

async function guardarDetalleGenRow(rows){
  console.log("Guardo Detalle Simple");
  const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
  await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  await doc.loadInfo();
  const sheet = doc.sheetsById['1660537107']; // or use doc.sheetsById[id]
  await sheet.addRows(rows);
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