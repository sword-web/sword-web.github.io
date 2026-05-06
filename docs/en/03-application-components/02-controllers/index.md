---
title: "Controllers"
description: "In Sword, a controller is an entry point to your application."
outline: [2, 3]

prev:
  text: Modules
  link: /en/application-components/modules
next:
  text: Web Controllers
  link: /en/application-components/controllers/web-controllers
---
# Controllers

In Sword, a controller is an entry point to your application.

In practice, a `controller` receives external events or requests and transforms them into calls to your modules' internal logic.

Some examples:

- A web controller that receives an HTTP request.
- A Socket.IO controller that listens for real-time events.

## How are they registered?

Controllers are registered within a module using `register_controllers`.

```rust
impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

This is the standard flow: each module declares its controllers, and `Application::builder().with_module::<...>()` takes care of the rest.

## Available Controller Types

- Web Controllers
- Socket.IO Controllers
- gRPC Controllers
