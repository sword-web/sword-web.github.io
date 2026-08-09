---
title: "Streaming"
description: "Cómo manejar streaming en Sword: StreamRequest para el body sin bufferizar y Server-Sent Events (SSE) para respuestas en tiempo real."
outline: [2, 3]
---

# Streaming

Sword expone dos formas de streaming: `StreamRequest`, para trabajar con el body de la request como flujo sin bufferizarlo en memoria, y Server-Sent Events (SSE), para enviar respuestas en tiempo real desde el servidor al cliente.

## StreamRequest

`StreamRequest` es la variante de `Request` para cuando no quieres bufferizar el body completo en memoria. Mantiene el body como flujo de Axum y te deja decidir cuándo y cómo consumirlo.

- Usa `Request` cuando quieras un acceso ergonómico a body, query, params, cookies y helpers de extracción.
- Usa `StreamRequest` cuando necesites trabajar con el body como flujo y evitar su carga completa en memoria.

### Interceptores para streaming

Cuando el handler recibe `StreamRequest` en lugar de `Request`, el interceptor web debe implementar el trait de streaming correspondiente.

#### El Trait `OnRequestStream`

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

#### El Trait `OnRequestStreamWithConfig`

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

:::info Nota importante sobre `StreamRequest`

Las rutas que usan `StreamRequest` no pueden combinarse con interceptores Sword definidos a nivel de controlador. En ese caso, aplica el interceptor directamente sobre la ruta.

:::

## Server-Sent Events (SSE)

Server-Sent Events (SSE) es una tecnología de push del servidor que permite a un cliente recibir actualizaciones automáticas desde el servidor a través de una conexión HTTP.

En Sword se declara con el atributo `#[sse]`. El handler devuelve un `Sse` que envuelve un flujo de eventos, y la ruta se sirve por `GET` con content-type `text/event-stream`.

```rust
use async_stream::stream;
use std::time::Duration;
use tokio::time::sleep;

use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/sse")]
struct SseController;

impl SseController {
    #[sse("/countdown")]
    async fn countdown(&self) -> Sse<impl EventStream + use<>> {
        let events = stream! {
            for i in (1..=5).rev() {
                sleep(Duration::from_millis(250)).await;
                yield Ok(Event::default().event("countdown").data(i.to_string()));
            }

            yield Ok(Event::default().event("done").data("The countdown has finished!"));
        };

        Sse::new(events)
    }
}
```

El flujo se construye con el macro `stream!`: cada `yield` produce un evento que se envía al cliente. `Event::default()` crea un evento, `.event(name)` define su tipo y `.data(value)` su contenido.

El tipo de retorno **DEBE** ser `Sse<impl EventStream + use<>>` el cual evita tener que nombrar el tipo concreto del flujo.

En conexiones de larga duración, `.keep_alive(KeepAlive::default())` mantiene viva la conexión enviando comentarios periódicos.

:::warning Nota sobre `request-timeout`

Las conexiones SSE son long-lived. Si `request-timeout` está habilitado en la configuración, la layer de timeout global terminará el flujo.

:::
