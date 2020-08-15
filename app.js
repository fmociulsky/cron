const cron = require("node-cron");
const express = require("express");
const request = require("request");
const parser = require("node-html-parser");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require("fs");

app = express();

cron.schedule('*/10 * * * * *', parsearHTML);

function parsearHTML() {
    request({uri: "http://www.turismocity.com.ar"}, 
        function(error, response, body) {
            debugger
            const root = parser.parse(body);
            const figures = root.querySelectorAll("figure");
            for (let index = 0; index < figures.length; index++) {
                const spans = figures[index].querySelectorAll("span");
                if(spans.length > 0){
                    //console.log(spans[0].getAttribute("class").includes("segment"));
                    console.log(index + "-> " + spans[0].innerHTML + " - " + spans[1].innerHTML + " : " + spans[2].innerHTML);
                }   
            }
    });
}

app.listen(3000);