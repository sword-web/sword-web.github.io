# Web Controller Definition

In Sword, a web controller is a struct that acts as a group of methods under a base path, where each method represents a specific HTTP endpoint. Controllers are declared with `#[controller(kind = Controller::Web, path = "...")]`.

These controllers are based on `axum` handlers but add an integration layer with the framework's module system, dependency injection, and interceptors.

## Defining a Web Controller

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        Ok(JsonResponse::Ok().message("Users list"))
    }
}
```

## Registering the Controller in a Module

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

## Accessing the Request

You can receive `req: Request` as a parameter to extract params, body, query, headers, cookies, and other HTTP request-related data.

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/{id}")]
    async fn get_by_id(&self, req: Request) -> WebResult {
        let id = req.param::<u64>("id")?;

        Ok(JsonResponse::Ok().data(id))
    }
}
```

For more details on extraction, check the [Request Handling](/en/practical-guides/web/request-handling/explanation) section.

## Supported HTTP Methods

Sword supports the standard HTTP methods provided by `axum`:

- GET: `#[get("...")]`
- POST: `#[post("...")]`
- PUT: `#[put("...")]`
- DELETE: `#[delete("...")]`
- PATCH: `#[patch("...")]`
- HEAD: `#[head("...")]`
- OPTIONS: `#[options("...")]`
- CONNECT: `#[connect("...")]`
- TRACE: `#[trace("...")]`

All methods receive the route in the same way, for example: `#[get("/")]`, `#[post("/api/users")]`, etc.

## About `&self`

Handlers receive `&self` because the controller can have dependencies injected into its fields.

This flow is explained in [Dependency Injection](/en/application-components/di/).

## Return Type

Sword aims to simplify and standardize HTTP responses into a common JSON format, so the recommended return type is `JsonResponse` or `WebResult`, which is an alias for `Result<JsonResponse, JsonResponse>`.

However, controller methods can also return any type that implements `IntoResponse`, as Sword's web layer is built on top of `axum`.
