---
title: "Handling Events"
description: "How Sword publishes and consumes events: event definitions, event controllers and the available transports."
outline: [2, 3]
aside: false
---

# Handling Events

Events let one part of the application notify other parts or other applications without calling them directly. The publisher hands an event to a transport, and the transport delivers it to every handler subscribed to that event's key.

Sword supports two transports:

- In-memory via `tokio::sync::mpsc`
- NATS via `async_nats`

Both share the same event definition, the same controller model and the same publishing API. They differ in where the event is stored and in the delivery guarantees each transport offers.

This page covers the shared model and how to choose a transport.

## How an event flows

An event is a struct with a key that identifies it. Publishing it sends the value through the selected transport. If there are handlers subscribed to that key, they are invoked with the event value.

<EventFlowDiagram />

A handler is an asynchronous method that belongs to a controller and receives and processes an event. The key is the routing contract.

## Enabling events

Events are split into the core API and one feature per transport:

| Feature         | Enables                                                  |
| --------------- | -------------------------------------------------------- |
| `events`        | Event definitions, controllers and the publishing traits |
| `events-memory` | The in-memory transport.                                 |
| `events-nats`   | The NATS transport.                                      |

To enable events, add the dependency with the required features, for example:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["events", "events-memory"] }
```

An application can use both transports, but each handler can only use one. The `events` feature is mandatory, and at least one of the other two is required.

## Defining an event

An event is a struct annotated with an attribute macro, for example:

```rust
use serde::{Deserialize, Serialize};
use sword::events::*;

#[event(key = "order.created")]
#[derive(Debug, Serialize, Deserialize)]
pub struct OrderCreated {
    pub order_id: String,
    pub total: u64,
}
```

The macro implements `Event` for the struct and registers it, so the type can be published and decoded. Around the attribute:

- Serialization is mandatory. The event is encoded with `serde_json`, so the type must implement `Serialize` and `Deserialize`.

- The key must be unique in the application. Registering two events with the same key fails when the application starts.

- The key must be non-empty and cannot contain the following list of characters:

  `#`, `>`, `<`, `*`, `!`, `?`, `=`, `~`, `&`, `|`, `^`, `$`, `@`, `%`, `` ` ``, `\`, `/`, `{`, `}`, `[`, `]`, `(`, `)`, `,`.

The macro implements the `Event` trait, which exposes the event key and its encoding:

<ApiSection title="API Reference: Trait 'Event'" :collapsed="true">

#### Get the key

```rust
fn key(&self) -> &'static str
```

**Returns**

- The key the event was registered with.

**When to use it**

- To route or identify an event received as `&dyn Event`.

---

#### Serialize the event

```rust
fn to_vec(&self) -> Result<Vec<u8>, EventCodecError>
```

**Returns**

- `Ok(Vec<u8>)` with the event as JSON.
- `Err(EventCodecError::Json)` if serialization fails.

**When to use it**

- To inspect or forward the raw payload of an event.

---

#### Recover the concrete type

```rust
pub fn cast<T: Event>(&self) -> Option<&T>
```

**Returns**

- `Some(&T)` if the event is of type `T`.
- `None` if it is another type.

**When to use it**

- Inside a handler that receives `&dyn Event`. Explained in [NATS wildcards](/en/practical-guides/events/nats/#wildcards-and-dynamic-handlers).

</ApiSection>

## Publishing events

The publisher is injected like any other provider in the application. The concrete type depends on the transport:

- In memory: `MemoryEventPublisher`
- In NATS: `NatsEventPublisher`.

```rust
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[injectable]
pub struct OrderService {
    publisher: Arc<MemoryEventPublisher>,
}

impl OrderService {
    pub async fn create_order(&self, order: OrderCreated) -> Result<(), EventPublishError> {
        self.publisher.publish(order).await
    }
}
```

Swap `MemoryEventPublisher` for `NatsEventPublisher` if you publish over NATS. Both implement the same trait:

<ApiSection title="API Reference: Trait 'EventPublish'" :collapsed="true">

#### Publish an event

```rust
fn publish(
    &self,
    event: impl Event + 'static,
) -> impl Future<Output = Result<(), EventPublishError>> + Send
```

**Parameters**

- `event`: the event to publish. It must implement `Event`.

**Returns**

- `Ok(())` when the transport accepts the event.
- `Err(EventPublishError)` according to the table below.

**When to use it**

- From controllers, services or interceptors that need to emit an event.

**Publication errors**

| Error          | When it appears                                                   |
| -------------- | ----------------------------------------------------------------- |
| `Closed`       | The in-memory channel stopped receiving (normally after shutdown) |
| `NotConnected` | Publishing before NATS connects                                   |
| `Codec`        | The event cannot be serialized                                    |
| `Transport`    | The client cannot send the event                                  |

</ApiSection>

## Declaring event controllers

Declare handlers in a controller whose `kind` attribute is `Controller::Events`.

The `source` attribute selects which transport consumes its subscriptions:

```rust
use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[controller(kind = Controller::Events, source = EventSource::Memory)]
pub struct OrderEventsHandler;

impl OrderEventsHandler {
    #[subscribe(key = "order.created")]
    async fn on_created(&self, event: &OrderCreated) -> EventHandlerResult<()> {
        tracing::info!(order_id = %event.order_id, "order created");

        Ok(())
    }
}
```

Each method annotated with `#[subscribe(key = "...")]` becomes a handler for an event with the given key.

The `source` attribute can be declared on the controller or on individual handlers, but not both. The rules are:

- Declared on the controller, every `#[subscribe]` in that controller uses that transport.

- Declared on a handler with `#[subscribe(key = "...", source = ...)]`, only that handler uses it, and the controller must not declare one.

- Declared on neither, compilation fails.

The value must be `EventSource::Memory` or `EventSource::Nats`, and the matching feature must be enabled.

## Choosing a transport

| Behavior               | In-memory                         | NATS                                  |
| ---------------------- | --------------------------------- | ------------------------------------- |
| Scope                  | The current process               | Every process connected to the server |
| Serialization          | None, the same value is delivered | JSON payload                          |
| Delivery               | At-most-once                      | At-most-once (core NATS)              |
| Retries                | Configurable, with a delay        | None                                  |
| Ordering               | Not guaranteed                    | Not guaranteed                        |
| Wildcard subscriptions | No, keys match exactly            | Yes, `*` and `>`                      |
| Queue groups           | No                                | Yes, load balanced across instances   |
| Persistence            | No                                | No (JetStream planned)                |
| Startup dependency     | None                              | The NATS server must be reachable     |

Use in-memory events to decouple parts of one process, since it needs no infrastructure, delivers the value without serializing it and lets you retry a failing handler. Use NATS when the producer and the consumer are different processes, or when several instances must share the work.
