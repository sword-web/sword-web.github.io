---
title: "NATS Events"
description: "Publishing and consuming events over NATS in Sword: subjects, wildcards, queue groups and delivery guarantees."
outline: [2, 3]
aside: false
---

# NATS Events

NATS is an open-source, lightweight, high-performance messaging system designed for building modern distributed systems, in any cloud or user-defined edge environment.

Sword supports NATS as an event transport. One service can publish an event and another can listen to it without knowing each other, and both can be in different processes, even on different machines.

Before reading this page, it helps to know the [shared event model](/en/0.6/practical-guides/events/handling-events) in Sword.

## Connecting the application

Add the `events-nats` feature to the Sword dependency:

```toml
[dependencies]
sword = { version = "0.6.0", features = ["events", "events-nats"] }
```

Configure the server in the `[events.nats]` section:

| Key                        | Type     | Default                 | Description                                                |
| -------------------------- | -------- | ----------------------- | ---------------------------------------------------------- |
| `url`                      | `String` | `nats://127.0.0.1:4222` | NATS server address (must not be empty)                    |
| `handler_timeout_ms`       | `u64`    | inherits `[events]`     | Overrides the handler timeout for this transport           |
| `connection_timeout_ms`    | `u64`    | `5000`                  | Time allowed for a single connection attempt               |
| `retry_on_initial_connect` | `bool`   | `false`                 | Keeps retrying when the first connection at startup fails  |
| `max_reconnects`           | `usize`  | unlimited               | Attempts before giving up                                  |
| `subscription_capacity`    | `usize`  | `65536`                 | Messages buffered per subscription before they are dropped |

```toml
[events.nats]
url = "nats://127.0.0.1:4222"
```

When `[events.nats]` is present, NATS must be available at startup. If the server does not respond, the application does not start. Enabling the feature without that section registers the publisher but does not open a connection.

`retry_on_initial_connect` without `max_reconnects` retries forever. Set `max_reconnects` to bound startup.

## Authentication

`[events.nats.auth]` accepts one of two methods.

| Method            | Keys               |
| ----------------- | ------------------ |
| User and password | `user`, `password` |
| Token             | `token`            |

```toml
[events.nats.auth]
user = "app"
password = "${NATS_PASSWORD}"
```

```toml
[events.nats.auth]
token = "${NATS_TOKEN}"
```

The methods are mutually exclusive. A token together with a user and password is a startup error.

## TLS

A `tls://` URL encrypts the connection and verifies the server certificate. For a private CA, set `ca_file` to the CA file.

```toml
[events.nats]
url = "tls://nats.example.com:4222"

[events.nats.tls]
ca_file = "/etc/nats/ca.pem"
```

Mutual TLS adds a client certificate and key.

```toml
[events.nats.tls]
ca_file = "/etc/nats/ca.pem"
client_cert = "/etc/nats/client.pem"
client_key = "/etc/nats/client.key"
```

A `[events.nats.tls]` section requires TLS even when the URL uses `nats://`. The files are checked at startup.

## Subjects

The subject is the contract between services. Choosing `order.created` defines the address of the event. In Sword it is used under the name `key` to unify the publishing and subscription API across transports.

In NATS, subjects are commonly organized by dots, so a prefix groups a family of events:

```text
order.created
order.shipped
order.cancelled
```

If two subscriptions match the same message, each receives it separately. In other words, a handler on `order.created` and another on `order.*` process the same event twice.

## Publishing events

To publish events from a controller or any structure under the dependency container, inject `NatsEventPublisher` and call `publish` with the event:

:::code-group

```rust [orders/controllers/web.rs]
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;
use sword::web::*;

use crate::orders::{CreateOrderDto, OrderCreated};

#[controller(kind = Controller::Web, path = "/orders")]
pub struct OrdersController {
    publisher: Arc<NatsEventPublisher>,
}

impl OrdersController {
    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let body = req.body::<CreateOrderDto>()?;

        let event = OrderCreated {
            order_id: "order-1".to_string(),
            total: body.total,
        };

        self.publisher.publish(event).await.ok();

        Ok(JsonResponse::Created().message("order created"))
    }
}
```

```rust [orders/events.rs]
use serde::{Deserialize, Serialize};
use sword::events::*;

#[event(key = "order.created")]
#[derive(Debug, Serialize, Deserialize)]
pub struct OrderCreated {
    pub order_id: String,
    pub total: f64,
}
```

:::

A successful `publish` only confirms that the event left your process. By default, Sword uses the NATS pub/sub model, which does not acknowledge receipt or guarantee that anyone read it. When it fails, the error says why:

| Error          | When it appears                            | What to check                            |
| -------------- | ------------------------------------------ | ---------------------------------------- |
| `NotConnected` | Publishing before the application connects | Publish after startup                    |
| `Codec`        | The event cannot be serialized             | The fields and derives of `OrderCreated` |
| `Transport`    | The client cannot send the event           | The connection and the logs              |

:::info

You can inspect the error or ignore it by turning it into an `Option`, as in the previous example.

:::

## Consuming events

To handle NATS events, declare an event controller with `transport = EventTransport::Nats`, or on the handler if the controller is transport-agnostic.

```rust [billing/controllers/events.rs]
use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[controller(kind = Controller::Events, transport = EventTransport::Nats)]
pub struct BillingEventsHandler;

impl BillingEventsHandler {
    #[subscribe(key = "order.created", group = "billing-workers")]
    async fn on_order_created(&self, event: &OrderCreated) -> EventHandlerResult<()> {
        tracing::info!(
            order_id = %event.order_id,
            total = event.total,
            "billing received order.created"
        );

        Ok(())
    }
}
```

The subscription receives a reference to the concrete event type, in this case `&OrderCreated`. When using a [wildcard](#wildcards-and-dynamic-handlers), the handler receives `&dyn Event` and must use the `cast` method to access the fields of its type.

### Event decoding

By default, NATS delivers bytes to consumers. Sword is JSON-first, so event decoding uses this format as an intermediary to deserialize into the concrete type. If the payload does not match the type, the message is discarded.

## Wildcards and dynamic handlers

A wildcard lets a handler listen to a family of events without declaring each type. It is a NATS feature and Sword supports it in the subscription:

- **Single-token wildcard (`*`)**: matches a single token. For example, a subject `order.*` receives `order.created` and `order.shipped`, but not `order.item.created` because the latter has three tokens.

- **Full wildcard (`>`)**: matches any number of tokens. For example, a subject `order.>` receives `order.created`, `order.shipped` and `order.item.created`.

A handler subscribed to a subject with _wildcards_ can use a typed event. However, messages that do not match the type are discarded and information is lost. For this reason, using `&dyn Event` is ALWAYS recommended for this kind of handler.

```rust
use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[controller(kind = Controller::Events, transport = EventTransport::Nats)]
pub struct AuditEventsHandler;

impl AuditEventsHandler {
    #[subscribe(key = "order.*")]
    async fn on_order_event(&self, event: &dyn Event) -> EventHandlerResult<()> {
        tracing::info!(subject = %event.key(), "order event received");

        if let Some(order) = event.cast::<OrderCreated>() {
            tracing::info!(order_id = %order.order_id, "order created");
        }

        Ok(())
    }
}
```

## Scaling consumers

By default, every instance subscribed to a subject (key) receives the event. With three instances of the application, the handler runs three times. That works when each node needs to react on its own, for example to invalidate its local cache, but not when the work must happen only once, such as issuing an invoice.

NATS _queue groups_ share the work with load balancing. Several instances declare the same subject and the same `group`:

```rust
#[subscribe(key = "order.created", group = "billing-workers")]
```

Groups are independent. If `billing-workers` and `audit-workers` listen to the same subject, each group receives its own copy.

:::info
This mechanism is useful in environments where your application scales horizontally, such as container orchestrators.
:::
