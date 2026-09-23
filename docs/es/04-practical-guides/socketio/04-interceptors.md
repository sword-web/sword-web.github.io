---
title: "Interceptores en Controladores Socket.IO"
description: "Cómo aplicar interceptores a controladores Socket.IO en Sword: OnConnect, OnConnectWithConfig y el rol de Tower."
outline: [2, 3]
---

# Interceptores en Controladores Socket.IO

En los controladores Socket.IO, los interceptores funcionan de manera diferente a los interceptores de controladores web. Esto se debe a que la naturaleza de las conexiones en tiempo real y el flujo de eventos difiere del flujo de solicitudes HTTP tradicionales.

A diferencia de los interceptores de controladores web, el interceptor se ejecuta solo en el handshake inicial evento `connection`. Luego, cada evento bajo el namespace no ejecutará el interceptor.

## Interceptores tradicionales

### El Trait `OnConnect`

Este trait permite definir lógica personalizada que se ejecuta antes de que un cliente se conecte a un namespace en concreto.

::: code-group

```rust [interceptor.rs]
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnect for EventLogger {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        println!("New connection - Socket ID: {}", ctx.id());

        Ok(())
    }
}
```

```rust [controller.rs]
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger)]
struct EventController;

impl EventController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("event")]
    async fn handle_message_event(&self, ctx: SocketContext) {
        // ... do something with the event
    }
}
```

:::

:::info
Como habrás notado, es necesario definir un tipo de error asociado. Este puede tener la estructura o formato que estimes conveniente, pero debe implementar el trait `Display`.

:::

## Interceptores con configuración

### El Trait `OnConnectWithConfig`

Al igual que `OnConnect`, este trait permite definir lógica personalizada que se ejecuta antes de que un cliente se conecte a un namespace en concreto, pero permite recibir un parámetro de tipo `T` extra con el que podremos tener un nivel adicional de configuración.

::: code-group

```rust [interceptor.rs]
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnectWithConfig<&str> for EventLogger {
    type Error = String;

    async fn on_connect(
        &self,
        config: &str,
        ctx: SocketContext,
    ) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());
        println!("Using '&str' config with value: {config}");

        Ok(())
    }
}
```

```rust [controller.rs]
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger, config = "some &str")]
struct EventController;

impl EventController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("event")]
    async fn handle_message_event(&self, ctx: SocketContext) {
        // ... do something with the event
    }
}
```

:::

## Tower y Socket.IO

En Socket.IO conviene distinguir dos cosas:

- **Layers globales**: sí aplican, porque Socket.IO se monta sobre el runtime web de la aplicación. Por ejemplo, una layer global de CORS puede influir en el handshake inicial y en la solicitud HTTP asociada al transporte `polling` o `websocket`.
- **Layers locales vía `#[interceptor(expr)]`**: no se soportan para lógica de conexión.

Si necesitas lógica específica de conexión en Socket.IO, la forma correcta es mediante `OnConnect` u `OnConnectWithConfig`.

## Extensiones

En Socket.IO existe un concepto relacionado, pero distinto al de las extensiones web:

- `ctx.extensions()` da acceso a las extensiones del socket.
- `ctx.http_extensions()` da acceso a las extensiones HTTP asociadas a la solicitud inicial.

### Ejemplo de uso de extensiones

El interceptor puede leer información del handshake y dejarla lista para los handlers en eventos posteriores:

::: code-group

```rust [interceptor.rs]
use sword::prelude::*;
use sword::socketio::*;
use sword_layers::request_id::RequestId;

#[derive(Interceptor)]
struct UserInterceptor;

impl OnConnect for UserInterceptor {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        let request_id = ctx
            .http_extensions()
            .get::<RequestId>()
            .map(|r| r.to_string())
            .unwrap_or_default();

        ctx.extensions().insert(request_id);

        Ok(())
    }
}
```

```rust [controller.rs]
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(UserInterceptor)]
struct EventController;

impl EventController {
    #[on("message")]
    async fn handle_message(&self, ctx: SocketContext) {
        let request_id = ctx.extensions().get::<String>();
        // ... use the stored request id
    }
}
```

:::

### Diferencia entre `extensions()` y `http_extensions()`

- `ctx.extensions()` da acceso a los datos del socket. Viven durante toda la conexión — desde el `connection` hasta el `disconnection` — y se comparten entre todos los eventos del socket. Es el lugar para que el interceptor escriba y los handlers lean.
- `ctx.http_extensions()` da acceso a las extensiones de la request HTTP del handshake que estableció la conexión. Es una foto del momento en que el cliente se conectó: contiene lo que las layers o interceptors web dejaron en la request inicial, como el `RequestId` de `RequestIdLayer` o las cookies si `CookieManagerLayer` está presente. Es de solo lectura.
