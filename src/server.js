import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateReleaseSummary, isValidTestResult } from './public/release-logic.js';

const PORT = Number(process.env.PORT ?? 3000);
const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));

function initialRelease() {
  return {
    version: '2.4.0',
    tests: { passed: 8, failed: 1, skipped: 1 },
    criticalBugs: 1,
    lastRun: 'Not run in this session'
  };
}

let release = initialRelease();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function serveStatic(pathname, response) {
  const requestedFile = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = resolve(publicDirectory, requestedFile);
  const publicRoot = `${resolve(publicDirectory)}${sep}`;

  if (!filePath.startsWith(publicRoot)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Forbidden');
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    response.end(file);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

export const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  try {
    if (request.method === 'GET' && url.pathname === '/health') {
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === 'GET' && url.pathname === '/api/release') {
      return sendJson(response, 200, calculateReleaseSummary(release));
    }

    if (request.method === 'POST' && url.pathname === '/api/test-results') {
      const body = await readJson(request);
      if (!isValidTestResult(body)) {
        return sendJson(response, 400, {
          error: 'passed, failed, and skipped must be non-negative integers'
        });
      }

      release.tests = body;
      release.lastRun = new Date().toISOString();
      return sendJson(response, 200, calculateReleaseSummary(release));
    }

    if (request.method === 'POST' && url.pathname === '/api/test-runs/smoke') {
      release.tests = { passed: 12, failed: 0, skipped: 0 };
      release.lastRun = new Date().toISOString();
      return sendJson(response, 200, calculateReleaseSummary(release));
    }

    if (request.method === 'POST' && url.pathname === '/api/bugs/resolve-critical') {
      release.criticalBugs = 0;
      return sendJson(response, 200, calculateReleaseSummary(release));
    }

    if (request.method === 'POST' && url.pathname === '/api/reset') {
      release = initialRelease();
      return sendJson(response, 200, calculateReleaseSummary(release));
    }

    return serveStatic(url.pathname, response);
  } catch (error) {
    return sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error'
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Release Readiness Dashboard: http://127.0.0.1:${PORT}`);
  });
}
