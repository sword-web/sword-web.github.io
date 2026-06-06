---
title: "HTTP Response Handling"
description: "Choosing between JsonResponse, WebResult, and Axum-compatible responses in Sword web controllers."
outline: [2, 3]

prev:
  text: Extending Request
  link: /en/practical-guides/web/request-handling/extending-request
---
# HTTP Response Handling

In Sword, the recommended way to respond from a web controller is using `JsonResponse` or `WebResult`.

## Common Return Types

::: code-group

```rust [JsonResponse]
use sword::prelude::*;
use sword::web::*;

#[get("/")]
async fn health(&self) -> JsonResponse {
    JsonResponse::Ok().message("Service available")
}
```

```rust [WebResult]
use sword::prelude::*;
use sword::web::*;

#[get("/{id}")]
async fn get_user(&self, req: Request) -> WebResult {
    let id = req.param::<u64>("id")?;

    Ok(JsonResponse::Ok().data(id))
}
```

:::

- `JsonResponse`
- `WebResult`

## `WebResult`

`WebResult` is an alias for:

```rust
Result<JsonResponse, JsonResponse>
```

This allows you to return both successful and error responses using the framework's standardized JSON format.

## `JsonResponse`

`JsonResponse` is the primary struct for building JSON responses in Sword.

### Common Constructors

- `JsonResponse::Ok()`
- `JsonResponse::Created()`
- `JsonResponse::BadRequest()`
- `JsonResponse::Unauthorized()`
- `JsonResponse::NotFound()`
- `JsonResponse::InternalServerError()`

### Minimal Example

```rust
use sword::prelude::*;
use sword::web::*;

async fn example() -> JsonResponse {
    JsonResponse::Ok().message("Successful operation")
}
```

## Payload Construction

::: details `message()`

Adds a descriptive message to the response.

```rust
let response = JsonResponse::Ok().message("Successful operation");
```

:::

::: details `data()`

Attaches any serializable value.

```rust
use serde::Serialize;

#[derive(Serialize)]
struct MyData {
    field1: String,
    field2: u32,
}

let response = JsonResponse::Ok().data(MyData {
    field1: "value".to_string(),
    field2: 42,
});
```

:::

::: details `error()`

Attaches a single error message.

```rust
let response = JsonResponse::BadRequest().error("Invalid input data");
```

:::

::: details `errors()`

Attaches a collection of errors or a validation structure.

```rust
let response = JsonResponse::BadRequest().errors(vec!["Error 1", "Error 2"]);
```

:::

## Controller Example

::: code-group

```rust [Simple Return]
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list_users(&self) -> JsonResponse {
        JsonResponse::Ok().message("Users list")
    }
}
```

```rust [With Error Propagation]
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

:::

## Automatic Errors from `Request`

Many `Request` methods return a `RequestError`, and Sword converts them into JSON responses when you use `WebResult`.

Common methods include:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`
- `req.body_validator::<T>()`

## Auto-wrap with `Result<T, E>`

Route macros (`#[get]`, `#[post]`, etc.) detect `Result<T, E>` and automatically wrap the success value in a `JsonResponse`:

| Type in `Ok(...)` | Behavior |
|---|---|
| `JsonResponse`, `File`, `Redirect` | Passed through directly (`.into_response()`) |
| `T: Serialize` | Wrapped as `JsonResponse::status(N).data(value)` |
| `()` | `JsonResponse::status(N)` without data |

Status codes: `201` for POST, `200` for all other methods.

```rust
#[post("/users")]
async fn create(&self) -> Result<User, JsonResponse> {
    Ok(User { id: 1, name: "Alice".into() })
    // → JsonResponse::status(201).data(User{...})
}

#[delete("/users/{id}")]
async fn delete(&self) -> Result<(), JsonResponse> {
    Ok(())
    // → JsonResponse::status(200)
}
```

## Can I return something else?

Yes. A controller can also return any type that implements `IntoResponse`, as Sword's web layer is built on top of Axum.

However, `JsonResponse` and `WebResult` remain the recommended choice if you want to maintain the framework's standard response format.

## See Also

- [Request Handling](/en/practical-guides/web/request-handling/explanation)
- [The `Request` struct](/en/practical-guides/web/request-handling/request-structure)
- [Error Handling](/en/practical-guides/web/request-handling/error-handling)
