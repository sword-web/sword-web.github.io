# Extensions

Extensions, like in axum, are a way to store and share data throughout the lifecycle of an HTTP request. They allow middlewares and controllers to share information.

## Using Extensions

```rust
use sword::prelude::*;
use uuid::Uuid;

#[middleware]
struct LoggerMiddleware;

impl OnRequest for LoggerMiddleware {
    async fn on_request(&self, mut req: Request, next: Next) -> MiddlewareResult {
        let request_id = Uuid::new_v4();

        println!("Incoming request: {} {}", req.method(), req.uri());

        req.extensions.insert::<Uuid>(request_id);

        next!(req, next)
    }
}
```

Then in a controller, you can access the extension:

```rust
use sword::prelude::*;
use uuid::Uuid;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> HttpResult {
        let request_id = req.extensions.get::<Uuid>().cloned().unwrap_or_default();
        Ok(HttpResponse::Ok().message(format!("Request ID: {request_id}")))
    }
}
```

## Mutability in Extensions

When you want to insert or modify extension data, you must declare the `Request` as mutable in the middleware or controller method signature.

