---
title: "Data Validation"
description: "Sword allows you to validate incoming data in Socket.IO events using the validator crate, similar to how validation works in web controllers."
outline: [2, 3]
---
# Data Validation

Sword allows you to validate incoming data in Socket.IO events using the `validator` crate, similar to how validation works in web controllers.

For the full reference of `try_data` and `try_validated_data`, see [Event handling and SocketContext reference](/en/practical-guides/socketio/event-handling).

## Enabling `validation-validator`

To use validation in `SocketContext`, you must enable the `validation-validator` feature.

```toml
[dependencies]
validator = { features = ["derive"] }
sword = { version = "x.y.z", features = ["validation-validator"] }
serde = { features = ["derive"] }
```

## Validatable DTO

```rust
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
struct IncomingMessageDto {
    #[validate(length(min = 1, max = 200))]
    pub content: String,
}
```

## Using `try_validated_data`

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("message")]
    async fn handle_message(&self, socket: SocketContext) {
        let Ok(data) = socket.try_validated_data::<IncomingMessageDto>() else {
            eprintln!("Failed to validate message data");
            return;
        };

        socket.emit("message", &data.content).ok();
    }
}
```

## Difference with `try_data`

- `try_data::<T>()` only deserializes the payload.
- `try_validated_data::<T>()` deserializes and then runs the `Validate` trait.

If validation fails, the method returns an error, and you can decide how to handle it within the handler.
