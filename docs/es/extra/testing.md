---
title: Pruebas - Framework Sword
description: Prueba tus aplicaciones Sword de manera efectiva. Aprende sobre pruebas unitarias, pruebas de integración y estrategias de testing para aplicaciones web en Rust.
keywords:
  [
    "testing",
    "pruebas unitarias",
    "pruebas integración",
    "framework sword",
    "estrategias testing",
    "testing rust",
  ]
---

# Pruebas

Dado que Sword está construido sobre `axum`, puedes aprovechar las herramientas de testing proporcionadas por el ecosistema de `axum` para probar tus aplicaciones Sword.

## `axum_test`

El crate [`axum_test`](https://docs.rs/axum-test/latest/axum_test/) ofrece utilidades para probar aplicaciones `axum`, y por lo tanto, aplicaciones Sword.

Sin embargo, recuerda que Sword proporciona un sistema de respuestas HTTP estandarizado, por lo que necesitarás adaptar las respuestas de `axum` a las respuestas de Sword en tus pruebas.

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
