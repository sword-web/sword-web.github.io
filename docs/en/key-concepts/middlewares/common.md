# Middlewares

A Sword middleware is a structure declared under the `#[middleware]` macro. Middlewares allow you to intercept and process HTTP requests and responses on specific controllers or routes.

## `OnRequest Trait`

The `OnRequest` trait allows you to define custom logic that executes before a request reaches the controller. This is useful for tasks like authentication, authorization, or request logging.

```rust
use sword::prelude::*;

#[middleware]
struct LoggerMiddleware;

impl OnRequest for LoggerMiddleware {
    async fn on_request(&self, req: Request, next: Next) -> MiddlewareResult {
        println!("Incoming request: {} {}", req.method(), req.uri());
        next!(req, next)
    }
}
```

Then, you can apply this middleware to a specific controller or route:

```rust

use sword::prelude::*;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/data")]
    #[uses(LoggerMiddleware)]
    async fn get_data(&self) -> HttpResponse {
        HttpResponse::Ok().message("Data response")
    }
}
```
