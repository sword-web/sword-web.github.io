---
title: Testing - Sword Framework
description: Test your Sword applications effectively. Learn about unit testing, integration testing, and testing strategies for Rust web applications.
keywords: ["testing", "unit tests", "integration tests", "sword framework", "test strategies", "rust testing"]
---

# Testing

Since Sword is built on top of `axum`, you can leverage the testing tools provided by the `axum` ecosystem to test your Sword applications.

## `axum_test`

The [`axum_test`](https://docs.rs/axum-test/latest/axum_test/) crate offers utilities for testing `axum` applications, and therefore, Sword applications.

However, remember that Sword provides a standardized HTTP response system, so you'll need to adapt `axum` responses to Sword responses in your tests.

### Example

First, make sure to add `axum_test` as a dependency:

```toml
[dependencies]
axum-test = "17.3.0"
```

Then, you can write tests for your Sword controllers as follows:

```rust
use serde_json::json;
use sword::prelude::*;

#[controller("/users")]
pub struct UsersController {}

#[routes]
impl UsersController {
    #[get("/")]
    async fn list_users(&self) -> HttpResponse {
        let data = json!({
            "users": [
                {"id": 1, "name": "Alice"},
                {"id": 2, "name": "Bob"}
            ]
        });

        HttpResponse::Ok().data(data)
    }
}
```

Now, you can write a test for the `/users` endpoint:

```rust
#[tokio::test]
async fn test_list_users() {
    use axum_test::TestServer;

    let app = Application::builder()
        .with_controller::<UsersController>()
        .build();

    let server = TestServer::new(app.router()).unwrap();
    let response = server.get("/users").await;
    let json = response.json::<ResponseBody>();

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

The `ResponseBody` structure corresponds to the standard HTTP response structure in Sword.
