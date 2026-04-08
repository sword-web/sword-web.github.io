---
title: Testing - Sword Framework
description: Learn how to test web controllers in Sword using axum-test and the application's current builder.
keywords: ["testing", "axum-test", "sword", "web testing", "rust"]
---

# Testing

Sword can be conveniently tested using tools from the Tokio ecosystem, depending on the type of application you are building. For web applications, `axum-test` is an excellent choice for testing controllers and HTTP routes.

## Testing Web Controllers with `axum-test`

First, add `axum-test` to your project:

```shell
cargo add axum-test --dev
```

## Complete Example

```rust
use axum_test::TestServer;
use serde_json::json;
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list_users(&self) -> JsonResponse {
        JsonResponse::Ok().data(json!({
            "users": [
                {"id": 1, "name": "Alice"},
                {"id": 2, "name": "Bob"}
            ]
        }))
    }
}

struct UsersModule;

impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}

#[tokio::test]
async fn test_list_users() {
    let app = Application::builder().with_module::<UsersModule>().build();

    let server = TestServer::new(app.router()).unwrap();
    let response = server.get("/users/").await;
    let json = response.json::<JsonResponseBody>();

    assert_eq!(response.status_code(), 200);
    assert!(json.data.is_some());

    let data = json.data.unwrap();

    assert_eq!(
        data,
        json!({
            "users": [
                {"id": 1, "name": "Alice"},
                {"id": 2, "name": "Bob"}
            ]
        })
    );
}
```

## What is being tested here?

In this example, a real application is constructed using `Application::builder()`, a module is registered, and the final router is exercised using `TestServer`.

This approach is useful for:

- Testing full HTTP routes.
- Verifying the response JSON payload.
- Validating interceptors, layers, and the framework's HTTP integration.
- Checking status codes and the standard response structure.

## `JsonResponseBody`

The `JsonResponseBody` struct represents Sword's standard JSON format for HTTP responses and is useful when you want to inspect `message`, `data`, `errors`, or other fields in your tests.
