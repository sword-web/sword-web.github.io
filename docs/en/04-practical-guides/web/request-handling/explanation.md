# HTTP Request Handling and Extraction

In Sword, unlike Axum, individual extractors are not used in the signature of web controller methods. Instead, a `Request` struct is used, which centralizes the request information and exposes a unified API for accessing the body, query, params, headers, cookies, and extensions.

## The `Request` Object

`Request` acts as a central access point for the HTTP request, similar to the `req` object found in other web frameworks.

### Example

```rust
use serde_json::Value;
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[post("/data")]
    async fn data(&self, req: Request) -> WebResult {
        let body = req.body::<Value>()?;

        Ok(JsonResponse::Ok().data(body))
    }
}
```

## Why not use extractors directly?

Axum's extractors have advantages, especially when you want to retrieve only the strictly necessary data for each handler. However, they also introduce some drawbacks in larger applications:

- They force you to repeat extractors across many methods.
- The order of parameters can be less obvious.
- Combining many extractors can affect readability.
- Extending behavior can require more boilerplate.

Sword aims to simplify this experience by grouping request access within the `Request` object.

## Relationship with Axum

Internally, Sword continues to rely on Axum. The goal is not to replace its HTTP model but to offer a more uniform API for web controllers within the framework's style.

## Extending `Request`

Since `Request` is the central access point for the request, you can also extend it with your own traits to add application-specific helpers.

This approach is explained in [Extending Request](/en/practical-guides/web/request-handling/extending-request).
