#!/usr/bin/node
// "Static HTTP file-server w/o external modules, e.g. `express` or `http-server`" as found:
// https://stackoverflow.com/a/29046869
// referencing the original post:
// https://adrianmejia.com/blog/2016/08/24/building-a-node-js-static-file-server-files-over-http-using-es6/

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 8001;

// maps file extention to MIME typere
const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

http.createServer(function (req, res) {
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    let ext = path.parse(pathname).ext;

    fs.exists(pathname, function (exist) {
        if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }
        // if is a directory search for index file matching the extention
        if (fs.statSync(pathname).isDirectory()) {
            if (ext === '') ext = '.html';
            pathname += '/HTML/gui' + ext;
        }

        // read file from file system
        fs.readFile(pathname, function(err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', map[ext] || 'text/plain' );
                res.end(data);
            }
        });
    });
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);