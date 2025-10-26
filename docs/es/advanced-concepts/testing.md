# Testing

Dado que Sword está construido sobre `axum`, puedes aprovechar las herramientas de prueba proporcionadas por el ecosistema `axum` para probar tus aplicaciones Sword.

## `axum_test`

El crate [`axum_test`](https://docs.rs/axum-test/latest/axum_test/) ofrece utilidades para probar aplicaciones `axum`, y por ende, aplicaciones Sword.

Sin embargo, recuerda que Sword provee un sistema de respuestas HTTP estandarizado, por lo que necesitarás adaptar las respuestas de `axum` a las de Sword en tus pruebas.

### Ejemplo

Primero, asegúrate de agregar `axum_test` como dependencia:

```toml
[dependencies]
axum-test = "17.3.0"
```
Luego, puedes escribir pruebas para tus controladores Sword de la siguiente manera:

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

Ahora, puedes escribir una prueba para el endpoint `/users`:

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

La estructura `ResponseBody` corresponde a la estructura estándar de respuestas HTTP en Sword. 
