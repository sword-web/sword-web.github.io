---
title: "Extensiones"
description: "Las extensiones, al igual que en Axum, permiten almacenar y compartir datos a lo largo del ciclo de vida de una request HTTP."
outline: [2, 3]
---
# Extensiones

Las extensiones, al igual que en Axum, permiten almacenar y compartir datos a lo largo del ciclo de vida de una request HTTP. En Sword son especialmente útiles para compartir información entre interceptors web y controladores.

## Controladores web

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

## `Request` y `StreamRequest`

Tanto `Request` como `StreamRequest` exponen extensiones. Eso permite reutilizar el mismo patrón también en rutas streaming.

Por ejemplo, un interceptor de `StreamRequest` puede insertar datos en `req.extensions` y el handler puede leerlos más adelante.

## Controladores Socket.IO

En Socket.IO existe un concepto relacionado, pero distinto:

- `ctx.extensions()` da acceso a las extensiones del socket
- `ctx.http_extensions()` da acceso a las extensiones HTTP asociadas a la request inicial

Esto resulta útil cuando necesitas compartir información entre el handshake HTTP y la fase posterior de eventos en tiempo real.

## Cuándo usar extensiones

Usa extensiones cuando necesites compartir estado derivado de una request o conexión sin convertirlo en una dependencia fija del controller.

En cambio, si el dato es estructural o permanente en la aplicación, normalmente será mejor modelarlo como una dependencia inyectada.
