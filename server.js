const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf'
};

// 301 Moved Permanently mapping from legacy .html files to new clean SEO URLs
const REDIRECTS_301 = {
  '/index.html': '/',
  '/about.html': '/about/',
  '/practice-areas.html': '/practice-areas/',
  '/locations.html': '/locations/',
  '/services.html': '/legal-services/',
  '/legal-blog.html': '/legal-blog/',
  '/contact.html': '/contact/',

  // Practice Areas
  '/criminal-law.html': '/practice-areas/criminal-law/',
  '/civil-litigation.html': '/practice-areas/civil-litigation/',
  '/civil-commercial-litigation.html': '/practice-areas/civil-litigation/',
  '/family-and-matrimonial-law.html': '/practice-areas/family-and-matrimonial-law/',
  '/property-and-real-estate-law.html': '/practice-areas/property-land-law/',
  '/corporate-and-commercial-law.html': '/practice-areas/corporate-and-commercial-law/',
  '/corporate-regulatory-legal-services.html': '/practice-areas/corporate-and-commercial-law/',
  '/taxation-law.html': '/practice-areas/taxation-law/',
  '/intellectual-property-rights.html': '/practice-areas/intellectual-property-rights/',
  '/labour-and-employment-law.html': '/practice-areas/labour-and-employment-law/',
  '/constitutional-and-writ-practice.html': '/practice-areas/constitutional-law/',
  '/cyber-law-and-technology.html': '/practice-areas/cyber-law/',

  // Locations
  '/hyderabad.html': '/locations/hyderabad/',
  '/kurnool.html': '/locations/kurnool/',
  '/vijayawada.html': '/locations/vijayawada/',
  '/anantapur.html': '/locations/ananthapur/',
  '/ananthapur.html': '/locations/ananthapur/',
  '/delhi.html': '/locations/delhi/',

  // Legal Services
  '/writ-petitions.html': '/legal-services/writ-petitions/',
  '/appeals-and-revisions.html': '/legal-services/appeals-and-revisions/',
  '/criminal-proceedings.html': '/legal-services/criminal-proceedings/',
  '/cheque-bounce-cases.html': '/legal-services/cheque-bounce-cases/',
  '/civil-and-commercial-litigation.html': '/legal-services/civil-and-commercial-litigation/',
  '/service-and-employment-matters.html': '/legal-services/service-and-employment-matters/',
  '/tribunal-and-corporate-representation.html': '/legal-services/tribunal-and-corporate-representation/',
  '/legal-drafting-and-opinion.html': '/legal-services/legal-drafting-and-opinion/',
  '/special-leave-petitions.html': '/legal-services/special-leave-petitions/',
  '/writ-petitions-article-32.html': '/legal-services/writ-petitions-article32/',
  '/appeals.html': '/legal-services/appeals/',
  '/transfer-and-review-petitions.html': '/legal-services/transfer-and-review-petitions/',
  '/advocates-on-record.html': '/legal-services/case-management-via-advocate-on-record/'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Check 301 redirects
  if (REDIRECTS_301[reqPath]) {
    res.writeHead(301, { 'Location': REDIRECTS_301[reqPath] });
    res.end();
    return;
  }

  // Normalize root
  if (reqPath === '' || reqPath === '/') {
    reqPath = '/index.html';
  }

  // Canonical trailing slash: if no extension and no trailing slash, check if directory exists
  if (!path.extname(reqPath) && !reqPath.endsWith('/')) {
    const candidateDir = path.join(__dirname, reqPath);
    if (fs.existsSync(candidateDir) && fs.statSync(candidateDir).isDirectory()) {
      res.writeHead(301, { 'Location': reqPath + '/' });
      res.end();
      return;
    }
  }

  // If path ends with slash, resolve to index.html inside that directory
  let filePath = path.join(__dirname, reqPath);
  if (reqPath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  // Security check: ensure filePath is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists, if not try appending index.html or .html
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
