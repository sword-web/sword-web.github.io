# Defining Routes in Controllers

In Sword, routes are defined within the implementation block of a controller. To do this, you use the `#[routes]` macro above the `impl` block.

```rust
use sword::prelude::*;
use serde_json::Value;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/hello")]
    async fn hello(&self) -> HttpResponse {
        HttpResponse::Ok().message("Hello, world!")
    }
}
```

A controller can access the request context through the `req: Request` parameter:

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/hello/{name}")]
    async fn hello(&self, req: Request) -> HttpResult {
        let name: String = req.param("name")?;

        ... Process logic ...

        Ok(HttpResponse::Ok().message(format!("Hello, {}!", name)))
    }
}
```

To learn about all the features of `Request`, see the [Request Context](../context-requests.md) section.

## Supported HTTP Methods

Currently, Sword supports the most common HTTP methods:

- `#[get("...")]`
- `#[post("...")]`
- `#[put("...")]`
- `#[delete("...")]`
- `#[patch("...")]`

### Route Syntax

Routes can include parameters, which are defined by enclosing the parameter name in curly braces `{}`. For example, in the route `/users/{id}`, `{id}` is a parameter that can be extracted from the request context.

For more details on route syntax, you can [check the axum documentation](https://docs.rs/axum/latest/axum/routing/struct.Router.html#method.route).

## Using `async`

Sword is built on `axum`, which uses `tokio` as its async runtime. Therefore, all controller methods must be `async`, even if they don't perform any asynchronous operations within the method body.

## Using `&self`

As you may have noticed, controller methods receive `&self` as their first parameter. This allows controllers to inject dependencies through their fields. However, this topic will be covered in detail in the [Dependency Injection](../dependency-injection.md) section.
