# Layers with `tower`

Sword integrates with the Tower ecosystem. This means you can apply any compatible `tower::Layer` wherever the framework allows.

In practice, the use of Tower in Sword is divided into two levels:

- Global layers applied to the entire application using `Application::builder().with_layer(...)`.
- Local layers in web controllers via `#[interceptor(expr)]`.

## Full Application

### Web Applications

If you register a layer using `with_layer(...)`, it is applied to the application's final router.

```rust
use sword::prelude::*;
use sword_layers::cors::{CorsConfig, CorsLayer};

struct AppModule;

impl Module for AppModule {}

#[sword::main]
async fn main() {
    let cors = CorsLayer::new(&CorsConfig::default());

    let app = Application::builder()
        .with_module::<AppModule>()
        .with_layer(cors)
        .build();

    app.run().await;
}
```

This approach is best suited for cross-cutting concerns such as:

- CORS
- Cookies
- Compression
- Security headers
- Request ID
- Timeouts

### Web Applications with Socket.IO

When your application mounts both web and Socket.IO controllers on the same web runtime, global layers registered with `with_layer(...)` also affect the HTTP part associated with Socket.IO.

For example, a global CORS layer can influence:

- Standard HTTP routes.
- The initial Socket.IO handshake.
- The HTTP request associated with the `polling` or `websocket` transport.

This doesn't turn the layer into a local connection interceptor, but it does mean it becomes part of the general HTTP pipeline on which Socket.IO is mounted.

## Web Controllers

In web controllers, `#[interceptor(...)]` also accepts expressions. This allows applying a Tower layer directly to a controller or a specific route.

### Local Layer on a Route

```rust
use sword::prelude::*;
use tower_http::cors::CorsLayer;

#[controller(kind = Controller::Web, path = "/test")]
struct TestController;

impl TestController {
    #[get("/")]
    #[interceptor(CorsLayer::permissive())]
    async fn hello(&self) -> JsonResponse {
        JsonResponse::Ok().message("Hello from Sword")
    }
}
```

### Local Layer at the Controller Level

```rust
use std::time::Duration;
use sword::prelude::*;
use tower_http::timeout::TimeoutLayer;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(TimeoutLayer::new(Duration::from_secs(2)))]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok().message("Data response")
    }
}
```

In this case, the expression does not implement a Sword trait like `OnRequest`, but instead is applied directly as a layer from the Tower/Axum ecosystem.

## Socket.IO Controllers

In Socket.IO controllers, it's important to distinguish between two things:

- **Global layers**: These do apply because Socket.IO is mounted on the application's web runtime.
- **Local layers via `#[interceptor(expr)]`**: These should not be documented as having equivalent support to web controllers.

If you need specific connection logic in Socket.IO, the correct way to document and use it is still through:

- `OnConnect`
- `OnConnectWithConfig`

That is, in Socket.IO:

- Use global layers for cross-cutting HTTP concerns.
- Use Sword interceptors for namespace-specific connection logic.

## `sword-layers`

In addition to general support for Tower, Sword features the companion crate `sword-layers`, which groups reusable and configurable layers designed for the framework.

Among the most common are:

- `CorsLayer`
- `CompressionLayer`
- `CookieManagerLayer`
- `Helmet`
- `TimeoutLayer`
- `RequestIdLayer`
- `ServeDir`

These layers are used just like any other Tower layer, typically with `with_layer(...)` at the global level.

## When to use what

- Use `with_layer(...)` when you want to apply a global layer to the entire application.
- Use `#[interceptor(expr)]` when you want to apply a local Tower layer to a specific web controller or route.
- Use Sword interceptors when you need to work directly with `Request`, `StreamRequest`, or `SocketContext`.
