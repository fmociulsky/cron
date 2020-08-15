const cron = require("node-cron");
const express = require("express");
const request = require("request");
const parser = require("node-html-parser");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require("fs");

app = express();

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1lNBn7QkHY7h62rJCUd2nvHrnGefyUwcw5j6_hJczBnM');
 
// use service account creds
await doc.useServiceAccountAuth({
  client_email: "fermochu@gmail.com.ar",
  private_key: "806955644808-6096j7et64psje6qabcaeipj2s21clr0.apps.googleusercontent.com",
});
// OR load directly from json file if not in secure environment
await doc.useServiceAccountAuth(require('./creds-from-google.json'));
// OR use API key -- only for read-only access to public sheets
doc.useApiKey('gFfuLCrrOL1yPWZDOMyEejRu');
 
await doc.loadInfo(); // loads document properties and worksheets
console.log(doc.title);
await doc.updateProperties({ title: 'renamed doc' });
 
const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
console.log(sheet.title);
console.log(sheet.rowCount);

//cron.schedule('*/10 * * * * *', parsearHTML);

function parsearHTML() {
    request({uri: "http://www.turismocity.com.ar"}, 
        function(error, response, body) {
            debugger
            const root = parser.parse(body);
            const figures = root.querySelectorAll("figure");
            for (let index = 0; index < figures.length; index++) {
                const spans = figures[index].querySelectorAll("span");
                if(spans.length > 0){
                    console.log(spans[0].getAttribute("class").includes("segment"));
                    //console.log(index + "-> " + spans[0].innerHTML + " - " + spans[1].innerHTML + " : " + spans[2].innerHTML);
                }
                
            }
            figures.forEach(f=>{
                
            })
    });
}

app.listen(3000);