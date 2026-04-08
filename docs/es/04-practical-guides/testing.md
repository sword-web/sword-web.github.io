---
title: Pruebas - Framework Sword
description: Aprende a probar controladores web en Sword usando axum-test y el builder actual de la aplicación.
keywords: ["testing", "axum-test", "sword", "pruebas web", "rust"]
---

# Pruebas

Sword puede probarse cómodamente con herramientas del ecosistema de Tokio, dependiento el tipo de aplicación que estés construyendo. Para aplicaciones web, `axum-test` es una excelente opción para probar controladores y rutas HTTP.

## Pruebas de Controladores Web con `axum-test`

Primero, agrega `axum-test` a tu proyecto:

```shell
cargo add axum-test --dev
```

## Ejemplo completo

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

## Qué se está probando aquí

En este ejemplo se construye una aplicación real con `Application::builder()`, se registra un módulo y luego se ejercita el router final mediante `TestServer`.

Este enfoque es útil para:

- probar rutas HTTP completas
- verificar el payload JSON de respuesta
- validar interceptors, layers e integración HTTP del framework
- comprobar códigos de estado y estructura estándar de respuesta

## `JsonResponseBody`

La estructura `JsonResponseBody` representa el formato JSON estándar de las respuestas HTTP de Sword y resulta útil cuando quieres inspeccionar `message`, `data`, `errors` u otros campos de la respuesta en tus pruebas.
