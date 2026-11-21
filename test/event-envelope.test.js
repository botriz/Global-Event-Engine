import test from "node:test";
import assert from "node:assert/strict";
import { createEventEnvelope } from "../event-envelope.js";

test("creates a versioned event envelope with generated identity and timestamp", () => {
  const event = createEventEnvelope({
    type: "billing.payment.confirmed.v1",
    correlationId: "request-123",
    payload: { orderId: "SUR-ABCDEF1234" }
  });
  assert.match(event.id, /^[0-9a-f-]{36}$/i);
  assert.equal(event.version, 1);
  assert.equal(event.type, "billing.payment.confirmed.v1");
  assert.equal(event.correlationId, "request-123");
  assert.ok(Number.isFinite(Date.parse(event.occurredAt)));
  assert.equal(Object.isFrozen(event), true);
});

test("rejects invalid event types and versions", () => {
  assert.throws(() => createEventEnvelope({ type: "payment", correlationId: "x", payload: {} }), /versioned identifier/);
  assert.throws(() => createEventEnvelope({ type: "payment.v1", version: 0, correlationId: "x", payload: {} }), /positive integer/);
});

test("rejects invalid and oversized payloads", () => {
  assert.throws(() => createEventEnvelope({ type: "test.event.v1", correlationId: "x", payload: [] }), /plain object/);
  assert.throws(() => createEventEnvelope({ type: "test.event.v1", correlationId: "x", payload: { data: "x".repeat(17000) } }), /16 KB/);
});
