# Global Event Engine

This repository currently provides a **pure event-envelope contract only**. It does not persist, publish, route, retry, or deliver events.

## API

`createEventEnvelope({ type, version, correlationId, payload })`

- Requires a namespaced versioned event type such as `billing.payment.confirmed.v1`.
- Generates a UUID and server-side timestamp.
- Requires a correlation ID.
- Accepts JSON-serializable object payloads up to 16 KB.
- Does not provide a durable event bus, idempotency store, retries, or dead-letter queue.

## Validation

`npm test`

Do not use this module as a message broker or financial event ledger. Durable delivery and idempotency must be implemented and tested before production integration.
