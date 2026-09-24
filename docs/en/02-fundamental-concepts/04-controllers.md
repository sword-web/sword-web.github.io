---
title: "Controllers"
description: "A controller is the entry point to your application: it receives requests or events and turns them into calls to your business logic."
outline: [2, 3]
---

# Controllers

A controller is the entry point to your application. It receives events or requests, internal or external, and turns them into calls to the business logic of your modules.

Depending on the communication mechanism, a controller can serve an HTTP request, listen for real-time events, answer remote gRPC calls, or process internal and external events.

## Declaration

A controller is a struct annotated with the `#[controller]` macro, which states the controller type and its routing data. The struct's methods are the entry points, and each one is marked with the attribute that corresponds to its transport:

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        Ok(JsonResponse::Ok().message("Users list"))
    }
}
```

The `kind` attribute selects the controller type (`Web`, `SocketIo`, `Grpc`, ...). The data that goes with it depends on that type: `path` for web controllers, `namespace` for Socket.IO, and `service` for gRPC.

## Registration

Controllers are registered from a module with `register_controllers`. Each module declares its own, and `Application::builder().with_module::<...>()` takes care of the rest.

```rust
impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

Internally, every controller implements `ControllerSpec`, which describes how to mount it on its transport.

## Controller types

Each transport documents the definition and details of its controllers in its practical guide:

- [Web controllers](/en/practical-guides/web/controllers)
- [Socket.IO controllers](/en/practical-guides/socketio/controllers)
- [gRPC controllers](/en/practical-guides/grpc/controllers)

Controllers for internal and external events are part of the application's event handling.
