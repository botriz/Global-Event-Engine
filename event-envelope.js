import crypto from "node:crypto";

const MAX_PAYLOAD_BYTES = 16 * 1024;
const EVENT_TYPE = /^[a-z][a-z0-9]*(?:\.[a-z0-9]+)+\.v[1-9][0-9]*$/;

export function createEventEnvelope({ type, version = 1, correlationId, payload } = {}) {
  if (typeof type !== "string" || !EVENT_TYPE.test(type)) {
    throw new TypeError("Event type must be a namespaced versioned identifier, for example billing.payment.confirmed.v1.");
  }
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new TypeError("Event version must be a positive integer.");
  }
  if (typeof correlationId !== "string" || correlationId.trim().length < 1 || correlationId.length > 128) {
    throw new TypeError("A correlationId between 1 and 128 characters is required.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("Event payload must be a plain object.");
  }
  let serialized;
  try { serialized = JSON.stringify(payload); }
  catch { throw new TypeError("Event payload must be JSON serializable."); }
  if (Buffer.byteLength(serialized, "utf8") > MAX_PAYLOAD_BYTES) {
    throw new RangeError("Event payload exceeds the 16 KB limit.");
  }
  return Object.freeze({
    id: crypto.randomUUID(),
    type,
    version,
    occurredAt: new Date().toISOString(),
    correlationId: correlationId.trim(),
    payload: JSON.parse(serialized)
  });
}

export const eventEnvelopeLimits = Object.freeze({ maxPayloadBytes: MAX_PAYLOAD_BYTES });
