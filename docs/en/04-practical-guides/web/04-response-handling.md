---
title: "HTTP Response Handling"
description: "Choosing between JsonResponse, WebResult, and Axum-compatible responses in Sword web controllers."
outline: [2, 3]
---

# HTTP Response Handling

The recommended way to respond in a web endpoint is using `WebResult`. This ensures all responses have a consistent format and errors are handled uniformly.

## WebResult

It is an alias for:

```rust
Result<JsonResponse, JsonResponse>
```

This lets you return successful and error responses with the same JSON format.

## JsonResponse

The main struct for building JSON responses in Sword. It provides a set of static methods equivalent to the most common HTTP status codes, and lets you chain methods to add messages, data, or errors.

### Common constructors

- `JsonResponse::Ok()`
- `JsonResponse::Created()`
- `JsonResponse::BadRequest()`
- `JsonResponse::Unauthorized()`
- `JsonResponse::NotFound()`
- `JsonResponse::InternalServerError()`

### Default message

If you don't specify a message with `message(...)`, Sword automatically adds the canonical text of the HTTP code. This also happens with less common codes, such as those built with `JsonResponse::TooManyRequests()`:

::: code-group

```rust [Example]
JsonResponse::TooManyRequests()
```

```json [Response]
{
    "code": 429,
    "success": false,
    "message": "Too Many Requests",
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

### Payload construction

#### `message()` method

Adds a descriptive message to the response.

::: code-group

```rust [Example]
JsonResponse::Ok().message("Successful operation");
```

```json [Response]
{
    "code": 200,
    "success": true,
    "message": "Successful operation",
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

#### `data()` method

Attaches serializable information to the response.

::: code-group

```rust [Example]
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

```json [Response]
{
    "code": 200,
    "message": "OK",
    "success": true,
    "timestamp": "2024-06-01T12:00:00Z",
    "data": {
        "field1": "value",
        "field2": 42
    }
}
```

:::

#### `error()` and `errors()` methods

Let you attach errors to the response. `error()` is for a single error, while `errors()` is for a collection of errors or a validation structure. Both have essentially the same purpose; however, both are included for semantics and clarity in the intent of the response.

::: code-group

```rust [Example]
JsonResponse::BadRequest()
    .error("Invalid input data")
    .errors(vec!["Error 1", "Error 2"]);
```

```json [Response]
{
    "code": 400,
    "message": "Bad Request",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z",
    "error": "Invalid input data",
    "errors": ["Error 1", "Error 2"]
}
```

:::

### Automatic errors from `Request`

Many `Request` methods return a `RequestError`; if you use `?` in the controller method, the error will be automatically converted into a `JsonResponse` with the corresponding status code.

#### Example

::: code-group

```rust [Example]
#[derive(Deserialize)]
struct UserData {
    name: String,
    email: String,
}

#[post("/")]
async fn create_user(&self, req: Request) -> WebResult {
    let _ = req.body::<UserData>()?;
    Ok(JsonResponse::Created())
}
```

```json [Request Body]
{
    "name": "Alice"
}
```

```json [Response]
{
    "code": 400,
    "error": "Failed to deserialize request body to the required type.",
    "message": "Invalid request body",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

### Automatic response conversion with `WebResult<T>`

Route macros (`#[get]`, `#[post]`, etc.) detect the generic type `T` of `WebResult<T>` and wrap it automatically in a `JsonResponse`.

The status code is chosen according to the route's HTTP method: `POST` responds with `201 Created`, while the rest of the methods respond with `200 OK`.

#### GET example (200)

::: code-group

```rust [Example]
#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
}

// Assuming a `UserController` struct

#[get("/users/{id}")]
async fn get_user(&self, req: Request) -> WebResult<User> {
    let user = User { id: 1, name: "Alice".to_string() };
    Ok(user)
}
```

```json [Response]
{
    "code": 200,
    "message": "OK",
    "success": true,
    "timestamp": "2024-06-01T12:00:00Z",
    "data": {
        "id": 1,
        "name": "Alice"
    }
}
```

:::

In this case, the value of `Ok(...)` is automatically placed in `data`. If you don't want to return data, you can use `()` and the response will only carry the status code and its message.

#### POST example (201)

::: code-group

```rust [Example]
#[derive(Serialize)]
struct CreateUserResponse {
    id: u32,
}

#[post("/users")]
async fn create_user(&self) -> WebResult<CreateUserResponse> {
    Ok(CreateUserResponse { id: 1 })
}
```

```json [Response]
{
    "code": 201,
    "message": "Created",
    "success": true,
    "timestamp": "2024-06-01T12:00:00Z",
    "data": {
        "id": 1
    }
}
```

:::

## `File` — downloads and inline content

`JsonResponse` covers JSON responses, but sometimes you need to return files. For that, Sword exposes `File`, a builder that constructs download or inline display responses depending on the `ContentDisposition` you use. By default, `File` behaves as a download (`ContentDisposition::Attachment`) with a `Content-Type` of `application/octet-stream`.

A typical download endpoint looks like this:

```rust
use sword::prelude::*;

#[get("/reports/{name}")]
async fn download_report(&self) -> File {
    let data = std::fs::read("report.pdf").unwrap();

    File::new()
        .bytes(&data)
        .content_type("application/pdf")
        .filename("report.pdf")
        .attachment()
}
```

The `bytes()` method takes the file content, `content_type()` sets its `Content-Type`, and `filename()` the name used in the `Content-Disposition` header.

If instead of downloading you want the browser to display the file directly (for example, a PDF or an image), use `inline()`:

```rust
File::new()
    .bytes(&data)
    .content_type("image/png")
    .filename("logo.png")
    .inline()
```

You can also add custom headers with `header(...)`. And since `File` implements `IntoResponse`, you can return it directly or inside a `WebResult<File>`.

## `Redirect` — HTTP redirects

When an endpoint needs to redirect to another URL, Sword exposes `Redirect`. Each constructor covers one of the most common 3xx codes:

- `Redirect::permanent(url)` — `301 Moved Permanently`
- `Redirect::found(url)` — `302 Found`
- `Redirect::see_other(url)` — `303 See Other`
- `Redirect::temporary(url)` — `307 Temporary Redirect`
- `Redirect::permanent_redirect(url)` — `308 Permanent Redirect`
- `Redirect::status(code, url)` — a custom code

For example, after a successful login you can redirect with `see_other`, which forces a `GET` request to the new location:

```rust
use sword::prelude::*;

#[post("/login")]
async fn login(&self) -> Redirect {
    Redirect::see_other("/dashboard")
}
```

The redirect adds the `Location` header with the destination URL and the corresponding status code. You can add extra headers with `header(...)`:

```rust
Redirect::temporary("/maintenance")
    .header("X-Redirect-Reason", "maintenance")
```

Like `File`, `Redirect` implements `IntoResponse`, so it can also be returned inside a `WebResult<Redirect>`.
