---
title: "Traditional Interceptors"
description: "This is the most common type of interceptor."
outline: [2, 3]
---
# Traditional Interceptors

This is the most common type of interceptor. It is declared as a struct that derives the `Interceptor` trait. As mentioned in the dependency injection section, interceptors are `Components` under the hood; this means they can have dependencies without requiring a defined constructor.

## Web Controllers - Interceptor

### The `OnRequest` Trait

This trait allows you to define custom logic that runs before an HTTP request reaches the controller. This is useful for tasks like authentication, authorization, or request logging.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestLogger;

impl OnRequest for RequestLogger {
    async fn on_request(&self, req: Request) -> WebInterceptorResult {
        println!("Incoming request: {} {}", req.method(), req.uri());
        req.next().await
    }
}
```

Then, you can apply this interceptor to a specific controller or route:

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[get("/data")]
    #[interceptor(RequestLogger)]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok().message("Data response")
    }
}
```

### The `OnRequestStream` Trait

When the handler receives a `StreamRequest` instead of a `Request`, the web interceptor must implement `OnRequestStream`.

This case is useful when you don't want to buffer the entire body in memory and need to work with the raw request stream.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamTagInterceptor;

impl OnRequestStream for StreamTagInterceptor {
    async fn on_request(&self, mut req: StreamRequest) -> WebInterceptorResult {
        req.extensions.insert("stream-ok".to_string());
        req.next().await
    }
}
```

And you can apply it to a route that receives `StreamRequest`:

```rust
use axum::body::to_bytes;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/stream")]
struct StreamController;

impl StreamController {
    #[post("/echo")]
    #[interceptor(StreamTagInterceptor)]
    async fn echo(&self, req: StreamRequest) -> WebResult {
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

### Difference between `Request` and `StreamRequest`

- Use `Request` when you want ergonomic access to the body, query, params, cookies, and extraction helpers.
- Use `StreamRequest` when you need to work with the body as a stream to avoid loading it entirely into memory.

### Important Note on `StreamRequest`

Routes using `StreamRequest` cannot be combined with Sword interceptors defined at the controller level. In this case, apply the interceptor directly to the route or use expression-based Tower layers.

## Socket.IO Controllers - Interceptor

### The `OnConnect` Trait

This trait allows you to define custom logic that runs before a client connects to a specific `namespace`.

Unlike web controller interceptors, the `OnConnect` interceptor runs only during the initial handshake (the `#[on("connection")]` event). Subsequent events within the `namespace` will not trigger the interceptor.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnect for EventLogger {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());

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
#[interceptor(EventLogger)]
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

## gRPC Controllers - Interceptor

### The `OnRequest` Trait

In gRPC, `OnRequest` allows you to intercept a request before it reaches the service method.

```rust
use sword::grpc::*;
use sword::prelude::*;

#[derive(Interceptor)]
struct AuthInterceptor;

#[sword::grpc::async_trait]
impl OnRequest for AuthInterceptor {
    async fn on_request(&self, req: Request<()>) -> GrpcInterceptorResult {
        if req.metadata().get("authorization").is_none() {
            return Err(Status::unauthenticated("missing authorization metadata"));
        }

        Ok(req)
    }
}
```

Applying it to a gRPC controller:

```rust
#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(AuthInterceptor)]
struct UsersController;
```

In this variant, there is no `next()`: the interceptor validates/transforms incoming metadata and returns `Ok(req)` or an error `Status`.
