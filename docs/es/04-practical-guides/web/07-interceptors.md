---
title: "Interceptores en Controladores Web"
description: "Cómo aplicar interceptors a controladores web en Sword: tradicionales, con configuración y layers de Tower locales."
outline: [2, 3]
---

# Interceptores en Controladores Web

Sword permite aplicar interceptors a controladores y rutas web. Existen tres mecanismos: interceptors tradicionales, interceptors con configuración y layers de Tower aplicadas con el atributo `#[interceptor(expr)]`.

## Interceptors tradicionales

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

### El Trait `OnRequestStream`

Cuando el handler recibe `StreamRequest` en lugar de `Request`, el interceptor web debe implementar `OnRequestStream`.

Este caso es útil cuando no quieres bufferizar el body completo en memoria y necesitas trabajar con el flujo bruto de la request.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamTagInterceptor;

impl OnRequestStream for StreamTagInterceptor {
    async fn on_request(&self, mut req: StreamRequest) -> WebInterceptorResult {
        req.extensions.insert("stream-ok".to_string());
        req.next().await
    }
}
```

Y puedes aplicarlo a una ruta que reciba `StreamRequest`:

```rust
use axum::body::to_bytes;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/stream")]
struct StreamController;

impl StreamController {
    #[post("/echo")]
    #[interceptor(StreamTagInterceptor)]
    async fn echo(&self, req: StreamRequest) -> WebResult {
        let tag = req.extensions.get::<String>().cloned().unwrap_or_default();
        let body_limit = req.body_limit();

        let body = to_bytes(req.into_body(), body_limit).await.map_err(|_| {
            JsonResponse::InternalServerError().message("Failed to read stream body")
        })?;

        Ok(JsonResponse::Ok().data(serde_json::json!({
            "len": body.len(),
            "tag": tag,
        })))
    }
}
```

#### Diferencia entre `Request` y `StreamRequest`

- Usa `Request` cuando quieras un acceso más ergonómico a body, query, params, cookies y helpers de extracción.
- Usa `StreamRequest` cuando necesites trabajar con el body como flujo y evitar su carga completa en memoria.

#### Nota importante sobre `StreamRequest`

Las rutas que usan `StreamRequest` no pueden combinarse con interceptors Sword definidos a nivel de controller. En ese caso, aplica el interceptor directamente sobre la ruta o usa layers de Tower basadas en expresiones.

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

### El Trait `OnRequestStreamWithConfig`

Si la ruta recibe `StreamRequest`, la variante configurada debe implementarse con `OnRequestStreamWithConfig<T>`.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamConfigInterceptor;

impl OnRequestStreamWithConfig<&'static str> for StreamConfigInterceptor {
    async fn on_request(
        &self,
        config: &'static str,
        mut req: StreamRequest,
    ) -> WebInterceptorResult {
        req.extensions.insert(config.to_string());
        req.next().await
    }
}
```

Aplicado sobre una ruta con `StreamRequest`:

```rust
use axum::body::to_bytes;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/stream")]
struct StreamController;

impl StreamController {
    #[post("/echo-with-config")]
    #[interceptor(StreamConfigInterceptor, config = "stream-config")]
    async fn echo_with_config(&self, req: StreamRequest) -> WebResult {
        let tag = req.extensions.get::<String>().cloned().unwrap_or_default();
        let body_limit = req.body_limit();

        let body = to_bytes(req.into_body(), body_limit).await.map_err(|_| {
            JsonResponse::InternalServerError().message("Failed to read stream body")
        })?;

        Ok(JsonResponse::Ok().data(serde_json::json!({
            "len": body.len(),
            "tag": tag,
        })))
    }
}
```

#### Cómo elegir entre `OnRequestWithConfig` y `OnRequestStreamWithConfig`

- Si el handler recibe `Request`, implementa `OnRequestWithConfig<T>`.
- Si el handler recibe `StreamRequest`, implementa `OnRequestStreamWithConfig<T>`.

#### Nota importante sobre `StreamRequest`

Al igual que en la variante tradicional, las rutas con `StreamRequest` no pueden combinarse con interceptors Sword definidos a nivel de controller. Debes aplicarlos directamente sobre la ruta.

## Layers de Tower con `#[interceptor(expr)]`

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

### Layer local a nivel de controller

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

Las extensiones, al igual que en Axum, permiten almacenar y compartir datos a lo largo del ciclo de vida de una request HTTP. En Sword son especialmente útiles para compartir información entre interceptors web y controladores.

### Insertar datos desde un interceptor

Un interceptor web puede insertar valores dentro de `req.extensions` antes de delegar la ejecución al siguiente paso del pipeline.

```rust
use sword::prelude::*;
use sword::web::*;
use uuid::Uuid;

#[derive(Interceptor)]
struct RequestIdInterceptor;

impl OnRequest for RequestIdInterceptor {
    async fn on_request(&self, mut req: Request) -> WebInterceptorResult {
        let request_id = Uuid::new_v4();

        req.extensions.insert::<Uuid>(request_id);

        req.next().await
    }
}
```

### Leer extensiones desde un controller

Luego, un controlador web puede leer ese valor desde la misma request:

```rust
use sword::prelude::*;
use sword::web::*;
use uuid::Uuid;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(RequestIdInterceptor)]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> JsonResponse {
        let request_id = req.extensions.get::<Uuid>().cloned();

        JsonResponse::Ok().data(serde_json::json!({
            "request_id": request_id,
        }))
    }
}
```

Este patrón es útil para compartir:

- request ids
- información de autenticación
- flags calculadas por interceptors o layers
- contexto de trazabilidad

### Mutabilidad de la request

Si necesitas insertar o modificar extensiones dentro de un interceptor, debes recibir la request como mutable:

```rust
async fn on_request(&self, mut req: Request) -> WebInterceptorResult
```

Si solo necesitas leer extensiones dentro del controlador, no hace falta que la request sea mutable.

### `Request` y `StreamRequest`

Tanto `Request` como `StreamRequest` exponen extensiones. Eso permite reutilizar el mismo patrón también en rutas streaming.
