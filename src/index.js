const http = require('http')
const httpProxy = require('http-proxy')
const url = require('url')
const uuidv1 = require('uuid/v1')
const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')

const wss = new WebSocket.Server({ port: 10801 })

function broadcastMessage(type, message) {
    wss.clients.forEach(function each(client) { 
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type,
                message
            }))
        }
    })
}

const proxy = httpProxy.createProxyServer({})

const HEADER_CORRELATION_NAME = 'X-Proxy-Correlation-Id'
let requests = {}

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    let correlationId = uuidv1()
    res.setHeader(HEADER_CORRELATION_NAME, correlationId)

    let body = []
    req.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        body.push(chunk)
    }).on('end', () => {
        requests[res.getHeader(HEADER_CORRELATION_NAME)] = {
            correlationId: correlationId,
            request: {
                parsedUrl: url.parse(req.url),
                protocol: req.protocol,
                method: req.method,
                url: req.url,
                httpVersion: req.httpVersion,
                headers: req.headers,
                body: Buffer.concat(body).toString()
            },
            response: undefined
        }
    })
})

proxy.on('proxyRes', function(proxyRes, req, res) {
    requests[res.getHeader(HEADER_CORRELATION_NAME)].response = {
        statusCode: proxyRes.statusCode,
        httpVersion: proxyRes.httpVersion,
        headers: proxyRes.headers
    }

    proxyRes.on('data', function(dataBuffer) {
        const body = dataBuffer.toString('utf8')
        
        requests[res.getHeader(HEADER_CORRELATION_NAME)].response['body'] = dataBuffer.toString('utf8')
        requests[res.getHeader(HEADER_CORRELATION_NAME)].response['bodyLength'] = body.length
    })

    proxyRes.on('end', function() {
        broadcastMessage('newRequest', requests[res.getHeader(HEADER_CORRELATION_NAME)])

        delete requests[res.getHeader(HEADER_CORRELATION_NAME)]
    })

})

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('HttpProxyDebuggerError: ' + err.message)
  broadcastMessage('error', { message: err.message, code: err.code } )
})

const server = http.createServer(function(req, res) {
    const parsedUrl = url.parse(req.url)
    if (parsedUrl.host === null) {
        // extract URL path
        let isIndex = (parsedUrl.pathname === "/")
        let pathname = path.resolve(__dirname, '..', 'client', 'build') + (isIndex ? "/index.html" : parsedUrl.pathname)

        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        
        // maps file extention to MIME typere
        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg'
        }

        fs.exists(pathname, function(exist) {
            if(!exist) {
                // if the file is not found, return 404
                res.statusCode = 404;
                res.end(`File ${parsedUrl.pathname} not found!`);
                return;
            }

            // if is a directory search for index file matching the extention
            if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

            // read file from file system
            fs.readFile(pathname, function(err, data) {
                if(err){
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    // if the file is found, set Content-type and send data
                    res.setHeader('Content-type', map[ext] || 'text/plain' );

                    if (isIndex) {
                        data = data.toString('utf8').replace(/\{\{REACT_APP_PROXY_WEBSOCKET_URL\}\}/g, process.env.REACT_APP_PROXY_WEBSOCKET_URL)
                    }

                    res.end(data);
                }
            });
        });
    } else {
        proxy.web(req, res, { target: `${parsedUrl.protocol}//${parsedUrl.host}` })
    }
})

server.listen(10800)