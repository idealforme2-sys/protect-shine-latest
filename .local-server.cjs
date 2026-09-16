const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

http
  .createServer((req, res) => {
    const url = decodeURI(req.url.split("?")[0]);
    const cleanUrl = url.replace(/\/+$/, "") || "/";
    const legacyRedirects = {
      "/commercial-truck-detailing.html": "/commercial-truck-detailing",
      "/first-responder-detailing.html": "/first-responder-detailing"
    };
    if (legacyRedirects[cleanUrl]) {
      res.writeHead(301, { Location: legacyRedirects[cleanUrl] });
      res.end();
      return;
    }
    const routeFiles = {
      "/": "index.html",
      "/commercial-truck-detailing": "commercial-truck-detailing/index.html",
      "/first-responder-detailing": "first-responder-detailing/index.html"
    };
    const requestedPath = routeFiles[cleanUrl] || routeFiles[url] || (url.endsWith("/") ? path.join(url, "index.html") : url);
    let file = path.join(root, requestedPath);

    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.stat(file, (err, stat) => {
      if (err) {
        // Check if it's a directory with index.html
        const dirIndex = path.join(root, url, "index.html");
        if (fs.existsSync(dirIndex)) {
          file = dirIndex;
          stat = fs.statSync(file);
        } else {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
      } else if (stat.isDirectory()) {
        const dirIndex = path.join(file, "index.html");
        if (fs.existsSync(dirIndex)) {
          file = dirIndex;
          stat = fs.statSync(file);
        } else {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
      }

      const ext = path.extname(file).toLowerCase();
      const headers = {
        "Content-Type": types[ext] || "application/octet-stream",
        "Accept-Ranges": "bytes",
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=300",
      };

      const range = req.headers.range;
      if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        let start = match && match[1] ? parseInt(match[1], 10) : 0;
        let end = match && match[2] ? parseInt(match[2], 10) : stat.size - 1;
        if (Number.isNaN(start) || start < 0) start = 0;
        if (Number.isNaN(end) || end >= stat.size) end = stat.size - 1;
        if (start > end) {
          res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
          res.end();
          return;
        }
        headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
        headers["Content-Length"] = end - start + 1;
        res.writeHead(206, headers);
        fs.createReadStream(file, { start, end }).pipe(res);
      } else {
        headers["Content-Length"] = stat.size;
        res.writeHead(200, headers);
        fs.createReadStream(file).pipe(res);
      }
    });
  })
  .listen(8001, "127.0.0.1");
