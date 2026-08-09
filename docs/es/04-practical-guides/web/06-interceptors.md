---
title: "Interceptores en Controladores Web"
description: "Cómo aplicar interceptors a controladores web en Sword: tradicionales, con configuración y layers de Tower locales."
outline: [2, 3]
---

# Interceptores en Controladores Web

Sword permite aplicar interceptores a controladores y rutas web.

Existen tres mecanismos: interceptors tradicionales, interceptors con configuración y layers de Tower.

## Interceptores tradicionales

### El Trait `OnRequest`

Este trait permite definir lógica personalizada que se ejecuta antes de que una solicitud HTTP llegue al controlador. Esto es útil para tareas como autenticación, autorización o registro de solicitudes.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestLogger;

impl OnRequest for RequestLogger {
    async fn on_request(&self, req: Request) -> WebInterceptorResult {
        println!("Incoming request: {} {}", req.method(), req.uri());
        req.next().await
    }
}
```

Luego, puedes aplicar este interceptor a un controlador o ruta específica:

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[get("/data")]
    #[interceptor(RequestLogger)]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok().message("Data response")
    }
}
```

## Interceptors con configuración

### El Trait `OnRequestWithConfig`

Al igual que `OnRequest`, este trait permite definir lógica personalizada que se ejecuta antes de que una solicitud HTTP llegue al controlador web, pero permite recibir un parámetro de tipo `T` extra con el que podremos tener un nivel adicional de configuración.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestLogger;

impl OnRequestWithConfig<&str> for RequestLogger {
    async fn on_request(&self, config: &str, req: Request) -> WebInterceptorResult {
        println!("Using '&str' config with value: '{config}'");
        req.next().await
    }
}
```

Luego, puedes aplicar este interceptor a un controlador o ruta específica:

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[get("/data")]
    #[interceptor(RequestLogger, config = "some &str")]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok()
    }
}
```

## Layers de Tower

En controladores web, `#[interceptor(...)]` también acepta expresiones. Esto permite aplicar una layer de Tower directamente sobre un controller o sobre una ruta concreta. La expresión no implementa un trait de Sword como `OnRequest`, sino que se aplica directamente como una layer del ecosistema Tower/Axum.

### Layer local en una ruta

```rust
use sword::prelude::*;
use tower_http::cors::CorsLayer;

#[controller(kind = Controller::Web, path = "/test")]
struct TestController;

impl TestController {
    #[get("/")]
    #[interceptor(CorsLayer::permissive())]
    async fn hello(&self) -> JsonResponse {
        JsonResponse::Ok().message("Hello from Sword")
    }
}
```

## Interceptor a nivel de controller

Tambien puedes aplicar cualquier tipo de interceptor a nivel de controller, lo que afectará a todas las rutas definidas en el mismo.

```rust
use std::time::Duration;
use sword::prelude::*;
use tower_http::timeout::TimeoutLayer;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(TimeoutLayer::new(Duration::from_secs(2)))]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok().message("Data response")
    }
}
```
