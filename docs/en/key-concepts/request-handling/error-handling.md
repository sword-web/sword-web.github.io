---
title: Error Handling in Requests - Sword Framework
description: Handle errors in Sword request processing. Learn about automatic error conversion, custom error responses, and Result types.
keywords: ["error handling", "request errors", "error responses", "sword framework", "http errors", "result type"]
---

# Error Handling in `Request`

As you may have noticed, some methods of the `Request` structure return a `Result`. This is because these methods can fail for various reasons.

For example, when using `Request::body<T>()`, the deserialization process to type `T` can fail if the request body doesn't match the expected structure.

In these cases, the returned `Result` will contain an error that describes the cause of the failure. You can handle these errors however you prefer, but Sword includes automatic conversion of errors to standardized HTTP responses.

## Automatic Error Conversion

As mentioned in the controllers section, they can return two types:

- `HttpResponse`
- `HttpResult`

The error type returned by a `Request` method can be automatically converted into an appropriate HTTP response if the controller returns an `HttpResult` and you use the `?` operator to propagate the error.

## Example

```rust
use serde::{Serialize, Deserialize};
use sword::prelude::*;

#[controller("/")]
pub struct MyController;

#[derive(Serialize, Deserialize)]
struct MyData {
    pub field1: String,
    pub field2: i32,
}

#[routes]
impl MyController {
    #[post("/")]
    pub async fn post_data(&self, req: Request) -> HttpResult {
        let data = req.body::<MyData>()?;

        ... Do something with data ...
        
        Ok(HttpResponse::ok().data(data))
    }
}
```

If we send something like:

```json
{
    "field1": "example",
    "field2": "not_an_integer"
}
```

We'll get the following:

```json
{
  "code": 400,
  "error": "Failed to parse request body to the required type.",
  "message": "Invalid request body",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

## Customizing Errors

If you want to override this behavior, you can avoid using the `?` operator and handle the error manually using `match`, `map_err`, or any other method you prefer.

## Limitations

Since deserialization relies on the `serde` crate, errors can't be as specific as to indicate exactly which field failed during deserialization. Instead, a generic error message is provided indicating that deserialization failed.

If you need more detailed error handling, consider deserializing the body manually and handling errors according to your needs.
