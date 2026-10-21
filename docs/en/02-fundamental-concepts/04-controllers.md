---
title: "Controllers"
description: "A controller is the entry point to your application: it receives requests or events and turns them into calls to your business logic."
outline: [2, 3]
---

# Controllers

A controller is the entry point to your application. It receives events or requests, internal or external, and turns them into calls to the business logic of your modules.

Depending on the communication mechanism, a controller can serve an HTTP request, listen for real-time messages, answer remote gRPC calls, or process internal and external events.

<ControllersDiagram />

## Declaration

A controller is a struct annotated with the `#[controller]` macro that implements the `ControllerSpec` trait.

```rust
use std::sync::Arc;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController {
    logger: Arc<Logger>,
    service: Arc<UsersService>,
}
```

### Macro attributes

**Controller type**

The `kind` attribute selects the controller type, defined by:

```rust
enum Controller {
    Web,
    SocketIo,
    Grpc,
    Events,
    Jobs,
}
```

**Attributes for each controller type**

Each controller type defines its own attributes, documented in its practical guide:

- [Web controllers](/en/practical-guides/web/controllers)
- [Socket.IO controllers](/en/practical-guides/socketio/controllers)
- [gRPC controllers](/en/practical-guides/grpc/controllers)
- [Scheduled job controllers](/en/practical-guides/jobs/controllers)

## Registration

Controllers are registered from a module. A module is the unit that groups your application's domains, and you can register one or more controllers in it:

```rust
impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

Internally, every controller implements `ControllerSpec`, which describes how to mount it on its transport.
