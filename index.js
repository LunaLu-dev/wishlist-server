const http = require('http');
const url = require('url');
const fx = require('@m00nbyte/currency-converter');

async function getCurrency(amount, from_curr, to_curr) {
    try{
        return await fx(amount).from(from_curr).to(to_curr);
    }catch(e){
        console.warn("Currency Conversion Failed: ", e);
    }
}

const server = http.createServer(async (req, res) => {

    res.statusCode = 200;

    // Setting CORS headers to allow requests from your front-end
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    const query = url.parse(req.url, true).query;
    const {amount, from_curr, to_curr} = query;

    if(!amount || !from_curr || !to_curr){
        return res.end(
            JSON.stringify({
                error: "Missing Parameters"
            })
        )
    }

    try {
        let response_value;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        response_value = await getCurrency(amount, from_curr, to_curr);
        res.end(response_value.toString());
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

const PORT = 7000;
const HOST = '192.168.1.69'
server.listen(PORT, () => {
    console.log(`Server running on ${HOST} : ${PORT}`);
});