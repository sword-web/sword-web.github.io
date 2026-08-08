---
title: "Interceptors in Web Controllers"
description: "How to apply interceptors to web controllers in Sword: traditional, with configuration, and local Tower layers."
outline: [2, 3]
---

# Interceptors in Web Controllers

Sword lets you apply interceptors to web controllers and routes. There are three mechanisms: traditional interceptors, interceptors with configuration, and Tower layers applied with the `#[interceptor(expr)]` attribute.

## Traditional interceptors

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

#### Difference between `Request` and `StreamRequest`

- Use `Request` when you want ergonomic access to the body, query, params, cookies, and extraction helpers.
- Use `StreamRequest` when you need to work with the body as a stream to avoid loading it entirely into memory.

#### Important Note on `StreamRequest`

Routes using `StreamRequest` cannot be combined with Sword interceptors defined at the controller level. In this case, apply the interceptor directly to the route or use expression-based Tower layers.

## Interceptors with configuration

### The `OnRequestWithConfig` Trait

Like `OnRequest`, this trait lets you define custom logic that runs before an HTTP request reaches the web controller, but it also accepts an extra `T` parameter that gives you an additional level of configuration.

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

Then, you can apply this interceptor to a specific controller or route:

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

#### How to Choose Between `OnRequestWithConfig` and `OnRequestStreamWithConfig`

- If the handler receives `Request`, implement `OnRequestWithConfig<T>`.
- If the handler receives `StreamRequest`, implement `OnRequestStreamWithConfig<T>`.

#### Important Note on `StreamRequest`

As in the traditional variant, routes using `StreamRequest` cannot be combined with Sword interceptors defined at the controller level. You must apply them directly to the route.

## Tower layers with `#[interceptor(expr)]`

In web controllers, `#[interceptor(...)]` also accepts expressions. This lets you apply a Tower layer directly to a controller or a specific route. The expression does not implement a Sword trait like `OnRequest`; instead, it is applied directly as a layer from the Tower/Axum ecosystem.

### Local layer on a route

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

### Local layer at the controller level

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

## Extensions

Extensions, as in Axum, let you store and share data throughout the lifecycle of an HTTP request. In Sword they are especially useful for sharing information between web interceptors and controllers.

### Inserting data from an interceptor

A web interceptor can insert values into `req.extensions` before delegating execution to the next step of the pipeline.

```rust
use sword::prelude::*;
use sword::web::*;
use uuid::Uuid;

#[derive(Interceptor)]
struct RequestIdInterceptor;

impl OnRequest for RequestIdInterceptor {
    async fn on_request(&self, mut req: Request) -> WebInterceptorResult {
        let request_id = Uuid::new_v4();

        req.extensions.insert::<Uuid>(request_id);

        req.next().await
    }
}
```

### Reading extensions from a controller

Then, a web controller can read that value from the same request:

```rust
use sword::prelude::*;
use sword::web::*;
use uuid::Uuid;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(RequestIdInterceptor)]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> JsonResponse {
        let request_id = req.extensions.get::<Uuid>().cloned();

        JsonResponse::Ok().data(serde_json::json!({
            "request_id": request_id,
        }))
    }
}
```

This pattern is useful for sharing:

- request ids
- authentication information
- flags computed by interceptors or layers
- traceability context

### Request mutability

If you need to insert or modify extensions inside an interceptor, you must receive the request as mutable:

```rust
async fn on_request(&self, mut req: Request) -> WebInterceptorResult
```

If you only need to read extensions inside the controller, the request does not need to be mutable.

### `Request` and `StreamRequest`

Both `Request` and `StreamRequest` expose extensions. This lets you reuse the same pattern in streaming routes too.
