---
title: "Interceptors with Configuration"
description: "This type of interceptor behaves similarly to a traditional Interceptor but adds an extra parameter to its interception method signature."
outline: [2, 3]
---
# Interceptors with Configuration

This type of interceptor behaves similarly to a traditional `Interceptor` but adds an extra parameter to its interception method signature.

## Web Controllers - Interceptor

### The `OnRequestWithConfig` Trait

Like `OnRequest`, this trait allows you to define custom logic that runs before an HTTP request reaches the web controller, but it also receives an additional parameter of type `T` for an extra layer of configuration.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestLogger;

impl OnRequestWithConfig<&str> for RequestLogger {
    async fn on_request(&self, config: &str, req: Request) -> WebInterceptorResult {
        println!("Using '&str' config with value: '{config}'");
        req.next().await
    }
}
```

Next, you can apply this interceptor to a specific controller or route:

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[get("/data")]
    #[interceptor(RequestLogger, config = "some &str")]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok()
    }
}
```

### The `OnRequestStreamWithConfig` Trait

If the route receives a `StreamRequest`, the configured variant must be implemented with `OnRequestStreamWithConfig<T>`.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamConfigInterceptor;

impl OnRequestStreamWithConfig<&'static str> for StreamConfigInterceptor {
    async fn on_request(
        &self,
        config: &'static str,
        mut req: StreamRequest,
    ) -> WebInterceptorResult {
        req.extensions.insert(config.to_string());
        req.next().await
    }
}
```

Applied to a route with `StreamRequest`:

```rust
use axum::body::to_bytes;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/stream")]
struct StreamController;

impl StreamController {
    #[post("/echo-with-config")]
    #[interceptor(StreamConfigInterceptor, config = "stream-config")]
    async fn echo_with_config(&self, req: StreamRequest) -> WebResult {
        let tag = req.extensions.get::<String>().cloned().unwrap_or_default();
        let body_limit = req.body_limit();

        let body = to_bytes(req.into_body(), body_limit).await.map_err(|_| {
            JsonResponse::InternalServerError().message("Failed to read stream body")
        })?;

        Ok(JsonResponse::Ok().data(serde_json::json!({
            "len": body.len(),
            "tag": tag,
        })))
    }
}
```

### How to Choose Between `OnRequestWithConfig` and `OnRequestStreamWithConfig`

- If the handler receives `Request`, implement `OnRequestWithConfig<T>`.
- If the handler receives `StreamRequest`, implement `OnRequestStreamWithConfig<T>`.

### Important Note on `StreamRequest`

As with the traditional variant, routes with `StreamRequest` cannot be combined with Sword interceptors defined at the controller level. You must apply them directly to the route.

## Socket.IO Controllers - Interceptor

### The `OnConnectWithConfig` Trait

Like `OnConnect`, this trait allows you to define custom logic that runs before a client connects to a specific `namespace`, but it also receives an additional parameter of type `T` for an extra layer of configuration.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnectWithConfig<&str> for EventLogger {
    type Error = String;

    async fn on_connect(
        &self,
        config: &str,
        ctx: SocketContext,
    ) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());
        println!("Using '&str' config with value: {config}");

        Ok(())
    }
}
```

As you may have noticed, it is necessary to define an associated error type. This can have any structure or format you find appropriate, but it must implement the `Display` trait.

Next, you can apply this interceptor to a Socket.IO controller:

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger, config = "some &str")]
struct EventController;

impl EventController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("event")]
    async fn handle_message_event(&self, ctx: SocketContext) {
        let payload: Event = ctx.try_data().expect("Failed to parse event data");

        println!("Received 'event' from {}: {payload:?}", ctx.id());
    }
}
```

In this example, the interceptor runs before the `#[on("connection")]` event. Any interaction in other events associated with the controller will not pass through the applied interceptor.

## gRPC Controllers - Interceptor with Configuration

### The `OnRequestWithConfig` Trait

In gRPC, you can use `OnRequestWithConfig<T>` to inject configuration parameters into validation/interception.

```rust
use sword::grpc::*;
use sword::prelude::*;

#[derive(Interceptor)]
struct ApiKeyInterceptor;

#[sword::grpc::async_trait]
impl OnRequestWithConfig<&'static str> for ApiKeyInterceptor {
    async fn on_request(
        &self,
        expected_key: &'static str,
        req: Request<()>,
    ) -> GrpcInterceptorResult {
        let Some(value) = req.metadata().get("x-api-key") else {
            return Err(Status::unauthenticated("missing x-api-key"));
        };

        let Ok(value) = value.to_str() else {
            return Err(Status::unauthenticated("invalid x-api-key"));
        };

        if value != expected_key {
            return Err(Status::permission_denied("invalid x-api-key"));
        }

        Ok(req)
    }
}
```

Applying it to a gRPC controller:

```rust
#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(ApiKeyInterceptor, config = "dev-key")]
struct UsersController;
```
