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
            if(i === parseInt(day)){
                var result = $(elem).find('div.day_desc p').text().replace(/(\r\n|\n|\r)/gm, "");
                data = {
                    no: i,  
                    title : Rabbit.zg2uni($(elem).find('div.day_title').text()),
                    result : Rabbit.zg2uni(result)
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

server.listen(8085, () => {
    console.log(`server started on port: ${8085}`);
});
