# Event Handling

Socket.IO controllers in Sword operate on events rather than HTTP routes. Each method in the controller is associated with an event using the `#[on("...")]` attribute.

## Most Common Events

The most frequent events are:

- `connection`
- `disconnection`
- Custom events such as `message`, `chat-message`, or `room:join`.

## Basic Example

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("New client connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, ctx: SocketContext) {
        println!("Disconnect reason: {:?}", ctx.disconnect_reason());
    }
}
```

## Reading the Event Name

In message handlers, you can check the name of the current event using `ctx.event()`:

```rust
if let Some(event) = ctx.event() {
    println!("Incoming event: {event}");
}
```

## Emit and Broadcast

From `ctx.socket`, you can interact with the current client or emit messages to other sockets:

```rust
ctx.socket.emit("message", &payload).ok();

ctx.socket.broadcast().emit("message", &payload).await.ok();
```
