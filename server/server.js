const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    // set header content type
    res.setHeader('Content-Type', 'text/html');

    let path = 'client';
    switch (req.url) {
        case '/':
            path += '/public/index.html';
            res.statusCode = 200;
            break;
        case '/quiz':
            path += '/pages/quiz.html';
            res.statusCode = 200;
            break;
        default:
            // TODO: handle 404 error
            res.statusCode = 404;
            break;
    }
    
    // send an html file
    fs.readFile(path, (err, data) => {
        if (err) {
            // console.log(err);
            res.end();
        } else {
            res.end(data);
        }
    });
});

server.listen(3005, 'localhost', () => {
    console.log('listening for requests on port 3005');
});