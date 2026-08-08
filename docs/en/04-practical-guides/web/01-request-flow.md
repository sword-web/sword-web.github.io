---
title: "The HTTP Request Flow"
description: "In Sword, unlike Axum, individual extractors are not used in the signature of web controller methods."
outline: [2, 3]
---

# HTTP Request Handling and Extraction

In Sword, unlike Axum, individual extractors are not used in the signature of the controller's methods. Instead, a struct centralizes the request information and exposes a unified API for accessing the body, query, params, headers, cookies, and more.

## The `Request` struct

This struct acts as a central access extractor for the HTTP request, similar to how it is handled in other frameworks.

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

Focused extractors have advantages, especially when you only want to retrieve the strictly necessary data for each handler. However, they also introduce some drawbacks in larger applications:

- They force you to repeat extractors across many methods.
- The order of the parameters can depend on ownership rules.
- Combining many extractors can affect readability.
- Extending behavior can require more boilerplate (custom extractors).

Sword tries to simplify that experience by grouping access through `Request`.

## Extending `Request`

Since `Request` is the central access point for the request, you can also extend it with your own traits to add application-specific helpers.

**Adding custom methods**

Assuming `User` and `SessionClaims` structs defined in your application, you can create a `RequestExt` trait to provide convenient methods to access this information from the request.

```rust
use sword::prelude::*;
use sword::web::*;

pub trait RequestExt {
    fn user(&self) -> Option<&User>;
    fn claims(&self) -> Option<&SessionClaims>;
}

impl RequestExt for Request {
    fn user(&self) -> Option<&User> {
        self.extensions.get::<User>()
    }

    fn claims(&self) -> Option<&SessionClaims> {
        self.extensions.get::<SessionClaims>()
    }
}
```

With this `trait`, you can easily access information stored in the request extensions. However, you could add additional logic, such as validations or transformations, to improve the functionality of the base `Request`.
