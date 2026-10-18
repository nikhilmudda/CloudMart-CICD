
const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

let server;
let BASE_URL;

test.before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));

  BASE_URL = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});

test('Health endpoint returns HTTP 200', async () => {
  const response = await fetch(`${BASE_URL}/api/health`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.status, 'healthy');
  assert.equal(body.service, 'cloudmart');
});

test('Products endpoint returns a non-empty product list', async () => {
  const response = await fetch(`${BASE_URL}/api/products`);
  assert.equal(response.status, 200);

  const products = await response.json();
  assert.ok(Array.isArray(products));
  assert.ok(products.length > 0);
});

test('Products contain required fields', async () => {
  const response = await fetch(`${BASE_URL}/api/products`);
  const products = await response.json();

  for (const product of products) {
    assert.ok(product.id);
    assert.ok(product.name);
    assert.equal(typeof product.price, 'number');
    assert.ok(product.category);
  }
});

test('Readiness endpoint returns ready status', async () => {
  const response = await fetch(`${BASE_URL}/api/ready`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.status, 'ready');
});

test('Unknown API endpoint returns JSON 404', async () => {
  const response = await fetch(`${BASE_URL}/api/unknown-endpoint`);
  assert.equal(response.status, 404);

  const body = await response.json();
  assert.equal(body.error, 'API endpoint not found');
});

test('Unknown page returns HTTP 404', async () => {
  const response = await fetch(`${BASE_URL}/this-route-does-not-exist`);
  assert.equal(response.status, 404);
});
