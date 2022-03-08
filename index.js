const axios = require('axios');
const cheerio = require('cheerio');
var http = require("http");
var Rabbit = require("rabbit-node");
const bayDinUrl = 'https://www.mintheinkha.com/weekly_baydin';
var url = require('url');

const server = http.createServer(async (req, res) => {
    //get param
    var queryData = url.parse(req.url, true).query;
    var day = queryData.day;
    if(!day){
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }

    // parse a haw data
    let data = {
        no: 9,
        title: "Not Found",
        result: "There is no result!"
    };
    axios.get(bayDinUrl)
    .then(response => {
        let html = response.data;
        const $ = cheerio.load(html);
        $('div.features div.row').each((i, elem) => {
            var no = parseInt(day) + 7 ;
            if(i === no){
                var result = $(elem).find('div.day_desc p').text().replace(/(\r\n|\n|\r)/gm, "");
                data = {
                    no: i,
		            title: getTitle(i),  
                   // title : Rabbit.zg2uni($(elem).find('div.day_title').text()),
                    result : Rabbit.zg2uni(result) + "\nမှတ်ချက်။ ။အပတ်စဉ် တနင်္ဂနွေမှ စနေနေ့ထိ ဟောစာတမ်းဖြစ်ပါတယ်။"
                }
            }
        });
    })
    .catch(error => {
        console.log(error)
    })
    
    setInterval(() => {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        res.write(JSON.stringify(data));
        //end the response
        res.end();
    }, 2000)
});

function getTitle(no){
    switch(no){
        case 0: return "တနင်္ဂနွေနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 1: return "တနင်္လာနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 2: return "အင်္ဂါနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 3: return "ဗုဒ္ဓဟူးနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 4: return "ကြာသပတေးနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 5: return "သောကြာနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 6: return "စနေနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 7: return "တနင်္ဂနွေနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 8: return "တနင်္လာနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 9: return "အင်္ဂါနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 10: return "ဗုဒ္ဓဟူးနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 11: return "ကြာသပတေးနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 12: return "သောကြာနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
        case 13: return "စနေနေ့ သားသမီးများ အတွက် တစ်ပတ်စာ ဟောစာတမ်း";
    }
}

server.listen(8585, () => {
    console.log(`server started on port: ${8585}`);
});
