---
title: "Interceptores en Controladores Web"
description: "Cómo aplicar interceptores a controladores web en Sword: tradicionales, con configuración y layers de Tower locales."
outline: [2, 3]
---

# Interceptores en Controladores Web

Sword permite aplicar interceptores a controladores y rutas web.

Existen tres mecanismos: interceptores tradicionales, interceptores con configuración y layers de Tower.

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

## Interceptores con configuración

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

En controladores web es posible aplicar una layer de Tower directamente sobre un controlador o sobre una ruta concreta, esto siempre y cuando sea una expresión que implemente `tower::Layer` o algún derivado compatible.

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

## Interceptor a nivel de controlador

También puedes aplicar cualquier tipo de interceptor a nivel de controlador, lo que afectará a todas las rutas definidas en el mismo.

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

## Extensiones

Las extensiones permiten almacenar y compartir datos a lo largo del ciclo de vida de una request HTTP. Son especialmente útiles para que un interceptor deje información que el handler consumirá después.

Un interceptor puede insertar valores en `req.extensions` antes de delegar la ejecución al siguiente paso del pipeline:

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestIdInterceptor;

impl OnRequest for RequestIdInterceptor {
    async fn on_request(&self, mut req: Request) -> WebInterceptorResult {
        req.extensions.insert("request-123".to_string());

        req.next().await
    }
}
```

Luego, el handler lee ese valor por tipo desde la misma request:

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(RequestIdInterceptor)]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> JsonResponse {
        let request_id = req.extensions.get::<String>().cloned();

        JsonResponse::Ok().data(serde_json::json!({
            "request_id": request_id,
        }))
    }
}
```

Este patrón es útil para compartir request ids, información de autenticación, flags calculadas por interceptors o contexto de trazabilidad.

Para insertar o modificar extensiones, el interceptor debe recibir la request como mutable (`mut req`). Si solo necesitas leer extensiones dentro del handler, no hace falta que la request sea mutable.
