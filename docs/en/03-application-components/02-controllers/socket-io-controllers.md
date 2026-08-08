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

In Sword, a Socket.IO controller is a struct that defines a namespace and a set of events that can be handled by specific methods.

These controllers let you handle real-time client connections, process messages, and emit events to connected clients. They are based on the `socketioxide` crate.

## Define a controller

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, socket: SocketContext) {
        println!("Client connected: {}", socket.id());

        let query: Option<MyQuery> = socket.query().unwrap();
        println!("Query params: {:?}", query);
    }

    #[on("message")]
    async fn on_message(&self, socket: SocketContext) {
        let Ok(message) = socket.try_data::<String>() else {
            return;
        };

        socket.emit("message", &message).ok();
    }
}
```

## Supported events

### Special events

- `#[on("connection")]`: Runs when a client connects to the controller's namespace.
- `#[on("disconnection")]`: Runs when a client disconnects from the controller's namespace.
- `#[on("fallback")]`: Runs when an event has no handler defined in the controller.

### Custom events

You can define custom events using the `#[on("event_name")]` attribute, where `event_name` is the name of the event you want to handle.

## See also

- [Event handling](/en/practical-guides/socketio/event-handling)
- [ACKs](/en/practical-guides/socketio/acknowledgements)
- [Context and extensions](/en/practical-guides/socketio/context-and-extensions)
- [Interceptors in Socket.IO Controllers](/en/practical-guides/socketio/interceptors)
