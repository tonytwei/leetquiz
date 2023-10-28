const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    // set header content type
    res.setHeader('Content-Type', 'text/html');

    res.write('<p>hello from server</p>');
    res.write('<p>hello from server 2</p>');
    res.end();
});

server.listen(3005, 'localhost', () => {
    console.log('listening for requests on port 3005');
});