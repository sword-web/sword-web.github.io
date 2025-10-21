# Middlewares with Configuration or Parameters

As you've seen, you can declare simple middlewares that don't require additional configuration. However, in many cases, you may want a middleware to accept parameters or configuration to customize its behavior.

For example, an authentication middleware might need a secret key or a set of allowed roles to function correctly. Or a logging middleware might accept a log level or output format.

## Declaring a Middleware with Configuration

You can declare a middleware with configuration using the `#[middleware]` macro and defining a struct. However, unlike the implementation with `OnRequest`, in this case, you'll need to implement the `OnRequestWithConfig<T>` trait, where `T` is the type of configuration you want to pass to the middleware.

```rust
use sword::prelude::*;

enum LogLevel {
    Info,
    Warn,
}

#[middleware]
struct LoggerMiddleware;

impl OnRequestWithConfig<LogLevel> for LoggerMiddleware {
    async fn on_request_with_config(
        &self,
        config: LogLevel,
        req: Request,
        next: Next,
    ) -> MiddlewareResult {
        let message = format!("Incoming request: {} {}", req.method(), req.uri());

        match config {
            LogLevel::Info => println!("[INFO] {message}"),
            LogLevel::Warn => println!("[WARN] {message}"),
        }

        next!(req, next)
    }
}
```

Then, you can apply this middleware to a specific controller or route:

```rust
#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/info")]
    #[uses(LoggerMiddleware, config = LogLevel::Info)]
    async fn get_info_log(&self) -> HttpResponse {
        HttpResponse::Ok().message("Data response")
    }

    #[get("/warn")]
    #[uses(LoggerMiddleware, config = LogLevel::Warn)]
    async fn get_warn_log(&self) -> HttpResponse {
        HttpResponse::Ok().message("Data response")
    }
}
```
