---
title: Request Handling - Sword Framework
description: Learn HTTP request handling in Sword using the unified Request object. Understand extractors, parameters, and request processing.
keywords: ["request handling", "http request", "request object", "extractors", "sword framework", "request processing"]
---

# HTTP Request Handling and Extraction

In Sword, unlike axum, individual extractors aren't used in controller method parameters. Instead, a `Request` structure is used that provides an API similar to other popular web frameworks.

## General `Request` Object

This consists of an object that contains request information, along with methods to access different parts of it. For example, in Express.js, the `req` object.

### Example

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[post("/data")]
    async fn data(&self, req: Request) -> HttpResult {
        let body = req.body::<Value>()?;
        let user = req.extensions.get::<User>()?;

        // ... Do something ...

        Ok(HttpResponse::Ok().json(vec![]))
    }
}
```

## Why Not Use Extractors Directly?

Using extractors directly in method parameters has advantages, mainly in terms of simplicity—with extractors, you literally extract only the data you need. However, this also has disadvantages.

### Example

```rust
async fn axum_controller_example(
    Extension(user): Extension<User>,
    State(state): State<AppState>,
    Json(body): Json<Value>, 
) -> Json<Vec<Value>> {

    // ... Do something ...

    Json(vec![])
}
```

The example above shows an axum handler that uses three different extractors: Extension, State, and Json. However, this can lead to formatting issues and repetitive code if multiple methods need the same extractors, for example, state.

The Dependency Injection section explains how Sword handles this problem.

Another issue is that the order of parameters matters, which can be confusing for developers.

Finally, creating custom extractors can be more complex and require more boilerplate code.

By using `Request`, you can extend its functionality through traits and add custom methods to handle specific cases in your application, which can simplify code and improve maintainability.
