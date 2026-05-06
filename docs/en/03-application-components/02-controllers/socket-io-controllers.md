---
title: "Socket.IO Controllers"
description: "Definition and supported events for Socket.IO controllers in Sword."
outline: [2, 3]

prev:
  text: Web Controllers
  link: /en/application-components/controllers/web-controllers
next:
  text: Dependency Injection
  link: /en/application-components/di/
---
# Socket.IO Controllers

In Sword, a Socket.IO controller is a `struct` annotated with `#[controller(kind = Controller::SocketIo, namespace = "...")]`, and its methods handle events declared with `#[on("...")]`.

## Define a controller

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }
}
```

## Supported events

### Special events

- `#[on("connection")]`
- `#[on("disconnection")]`
- `#[on("fallback")]`

### Custom events

- `#[on("message")]`
- `#[on("chat-message")]`
- `#[on("room:join")]`

## Register in a module

```rust
use sword::prelude::*;

pub struct ChatModule;

impl Module for ChatModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<ChatController>();
    }
}
```

## See also

- [Event handling](/en/practical-guides/socketio/event-handling)
- [ACKs](/en/practical-guides/socketio/acknowledgements)
- [Context and extensions](/en/practical-guides/socketio/context-and-extensions)
- [Interceptors with configuration](/en/application-components/interceptors/with-config)
