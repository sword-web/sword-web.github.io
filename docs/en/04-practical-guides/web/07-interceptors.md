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

## Tower layers with `#[interceptor(expr)]`

In web controllers, you can apply a Tower layer directly to a controller or a specific route, as long as it is an expression that implements `tower::Layer` or a compatible derivative.

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

## Local layer at the controller level

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

Extensions let you store and share data throughout the lifecycle of an HTTP request. They are especially useful for an interceptor to leave information that the handler will consume later.

An interceptor can insert values into `req.extensions` before delegating execution to the next step of the pipeline:

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestIdInterceptor;

impl OnRequest for RequestIdInterceptor {
    async fn on_request(&self, mut req: Request) -> WebInterceptorResult {
        req.extensions.insert("request-123".to_string());

        req.next().await
    }
}
```

Then, the handler reads that value by type from the same request:

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(RequestIdInterceptor)]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> JsonResponse {
        let request_id = req.extensions.get::<String>().cloned();

        JsonResponse::Ok().data(serde_json::json!({
            "request_id": request_id,
        }))
    }
}
```

This pattern is useful for sharing request ids, authentication information, flags computed by interceptors, or traceability context.

To insert or modify extensions, the interceptor must receive the request as mutable (`mut req`). If you only need to read extensions inside the handler, the request does not need to be mutable.
