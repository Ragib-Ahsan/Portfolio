const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

const SHEET_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAUDdC_oNwk0RRaRVrmJwpchCK3n29T88beUE3aD-of2K2RRRlgWBuVEGEdHsqjPgVX6JEvZPuwp8Q/pub';

function fetchSheet(url, response, redirectCount) {
  if (!redirectCount) redirectCount = 0;
  if (redirectCount > 5) {
    response.writeHead(502, { 'Content-Type': 'text/plain' });
    response.end('Too many redirects');
    return;
  }
  var mod = url.indexOf('https://') === 0 ? https : http;
  mod.get(url, function(sheetRes) {
    if (sheetRes.statusCode >= 300 && sheetRes.statusCode < 400 && sheetRes.headers.location) {
      fetchSheet(sheetRes.headers.location, response, redirectCount + 1);
      return;
    }
    var data = '';
    sheetRes.on('data', function(chunk) { data += chunk; });
    sheetRes.on('end', function() {
      response.writeHead(sheetRes.statusCode, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      response.end(data);
    });
  }).on('error', function(err) {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('Proxy error: ' + err.message);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  let urlPath = parsed.pathname;

  // ── Google Sheet proxy ───────────────────────────────────────
  if (urlPath === '/api/sheet') {
    const gid = parsed.query.gid;
    if (!gid) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing gid parameter');
      return;
    }
    var sheetUrl = SHEET_BASE + '?gid=' + encodeURIComponent(gid) + '&single=true&output=csv';
    fetchSheet(sheetUrl, res);
    return;
  }

  // ── Static file serving ──────────────────────────────────────
  urlPath = decodeURIComponent(urlPath);

  if (urlPath === '/favicon.ico') {
    urlPath = '/favicon.svg';
  }

  let filePath = path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, function() {
  console.log('EXECUTIVE.OS running at http://localhost:' + PORT);
});
