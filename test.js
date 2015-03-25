var http = require('http');
http.createServer(function (req, res) {
  console.log(req.url);
  console.log(req.headers);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(7146, '127.0.0.1');
