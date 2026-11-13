---
title: "In-Memory Events"
description: "Publishing and consuming in-memory events in Sword: channel capacity, retries and delivery semantics."
outline: [2, 3]
aside: false
---

# In-Memory Events

The in-memory transport delivers events inside the current process. There is no broker, no serialization and no network. The publisher puts the event in a channel and the event engine dispatches it to the handlers registered for its key.

The shared event model and the event definition are covered in [Handling Events](/en/0.6/practical-guides/events/handling-events). Controllers and their registration are covered in [Controllers](/en/0.6/fundamental-concepts/controllers). This page covers what is specific to memory.

## Enabling the transport

Add the `events-memory` feature to the Sword dependency:

```toml
[dependencies]
sword = { version = "0.6.0", features = ["events", "events-memory"] }
```

## Configuration

Configure the transport in the `[events.memory]` section. Every key is optional. An absent section uses the defaults:

| Key                            | Type    | Default             | Description                                             |
| ------------------------------ | ------- | ------------------- | ------------------------------------------------------- |
| `buffer_size`                  | `usize` | `1024`              | Channel capacity, in events (must be greater than zero) |
| `num_of_event_retry`           | `u8`    | `3`                 | Extra attempts after the first handler failure          |
| `delay_between_event_retry_ms` | `u64`   | `1000`              | Wait between attempts, in milliseconds                  |
| `handler_timeout_ms`           | `u64`   | inherits `[events]` | Overrides the handler timeout for this transport        |

```toml
[events.memory]
buffer_size = 1024
num_of_event_retry = 3
delay_between_event_retry_ms = 1000
```

## Publishing events

The engine registers `MemoryEventPublisher` as a provider. Inject it into the controller and publish with `publish`:

:::code-group

```rust [orders/controllers/web.rs]
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;
use sword::web::*;

use crate::orders::{CreateOrderDto, OrderCreated};

#[controller(kind = Controller::Web, path = "/orders")]
pub struct OrdersController {
    publisher: Arc<MemoryEventPublisher>,
}

impl OrdersController {
    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let body = req.body::<CreateOrderDto>()?;

        let event = OrderCreated {
            order_id: "order-1".to_string(),
            total: body.total,
        };

        self.publisher.publish(event).await.map_err(|error| {
            tracing::error!(%error, "failed to publish order.created");
            JsonResponse::InternalServerError().message("failed to publish event")
        })?;

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

A successful `publish` only confirms that the event is in the channel, not that it was handled.

The channel has a fixed capacity and is shared by all events. When it is full, `publish` waits for space instead of dropping the event.

The only transport-specific error is `EventPublishError::Closed`, which appears when the engine stops receiving.

For the `publish` signature and the remaining errors, see [Handling Events](/en/0.6/practical-guides/events/handling-events).

## Subscribing to events

Select the transport with the `transport` attribute of the `controller` macro. If the controller handles events from several transports, each handler can declare its own `transport` in the `subscribe` macro.

```rust
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;
use crate::store::EventStore;

#[controller(kind = Controller::Events, transport = EventTransport::Memory)]
pub struct OrderEventsHandler {
    store: Arc<EventStore>,
}

impl OrderEventsHandler {
    #[subscribe(key = "order.created")]
    async fn on_created(&self, event: &OrderCreated) -> EventHandlerResult<()> {
        self.store.record(&event.order_id);

        Ok(())
    }
}
```

:::info
Unlike **NATS**, this transport has no _wildcards_. Handlers must subscribe to the literal key of the event they want to handle. See [NATS wildcards](/en/0.6/practical-guides/events/nats/#wildcards-and-dynamic-handlers).
:::

## Failure behavior

| Situation                | Result                                        |
| ------------------------ | --------------------------------------------- |
| `buffer_size = 0`        | Startup error, the application does not start |
| Handler returns an error | Retried if configured                         |
