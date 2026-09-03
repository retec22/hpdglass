import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

test("dashboard summary endpoint works without auth when local mode is active", async () => {
  delete process.env.JWT_SECRET;
  delete process.env.JWT_ISSUER;
  delete process.env.JWT_AUDIENCE;

  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/dashboard/summary`);
    const payload = await response.json();

    assert.equal(response.status, 200, `expected 200 but got ${response.status}`);
    assert.equal(payload.ok, true);
    assert.equal(Array.isArray(payload.summary.projects), true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
