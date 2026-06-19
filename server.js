const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let requestPath = (req.url || '/').split('?')[0];
  if (requestPath === '/') requestPath = '/index.html';
  const filePath = path.join(ROOT, requestPath);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('WorkSight Dashboard running at http://localhost:' + PORT);
});
