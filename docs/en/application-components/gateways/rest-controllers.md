# Rest Controllers

A rest controller is commonly known as a function that handles an HTTP request and returns an HTTP response. In Sword, we handle controllers as `structs`, and their methods are what actually handle the HTTP requests.

You'll notice this is a different approach from other Rust web frameworks, where controllers are functions. This object-oriented approach allows you to group related functionality within the same controller, making it easier to organize and maintain your code.

## Creating a Controller

To define a controller, you need to create a `struct` and mark it using the `#[controller]` macro.

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

// ... assuming main function and other imports ...

Application::builder()
    .with_controller::<ApiController>()
    .build()
```

### `#[controller]` Macro Attributes

#### `path`

The `path` attribute defines the route prefix for all routes within the controller. In the example above, all routes defined in `ApiController` will have the `/api` prefix.

### `version`

The `version` attribute allows you to define a version for the controller, which will be included in the route. For example:

```rust
#[controller("/api", version = "v1")]
struct ApiController;
```

This is equivalent to defining the controller with the `/api/v1` prefix. However, it provides additional semantic meaning, indicating that this controller belongs to version 1 of your API.

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

A controller can access the request through the `req: Request` parameter:

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

To learn about all the features of `Request`, see the [Request Handling](../request-handling/explanation.md) section.

## Supported HTTP Methods

Currently, Sword supports the most common HTTP methods:

- `#[get("...")]`
- `#[post("...")]`
- `#[put("...")]`
- `#[delete("...")]`
- `#[patch("...")]`

### Route Syntax

Routes can include parameters, which are defined by enclosing the parameter name in curly braces `{}`. For example, in the route `/users/{id}`, `{id}` is a parameter that can be extracted from the request path.

For more details on route syntax, you can [check the axum documentation](https://docs.rs/axum/latest/axum/routing/struct.Router.html#method.route).

## Using `async`

Sword is built on `axum`, which uses `tokio` as its async runtime. Therefore, all controller methods must be `async`, even if they don't perform any asynchronous operations within the method body.

## Using `&self`

As you may have noticed, controller methods receive `&self` as their first parameter. This allows controllers to inject dependencies through their fields. However, this topic will be covered in detail in the [Dependency Injection](../dependency-injection.md) section.
