---
title: "Interceptores en Controladores Socket.IO"
description: "Cómo aplicar interceptores a controladores Socket.IO en Sword: OnConnect, OnConnectWithConfig y el rol de Tower."
outline: [2, 3]
---

# Interceptores en Controladores Socket.IO

Sword permite aplicar interceptores a controladores Socket.IO para manejar la conexión de clientes a un namespace.

## Interceptores tradicionales

### El Trait `OnConnect`

Este trait permite definir lógica personalizada que se ejecuta antes de que un cliente se conecte a un namespace en concreto.

A diferencia de los interceptores de controladores web, el interceptor `OnConnect` se ejecuta solo en el handshake inicial (evento `#[on("connection")]`). Luego, cada evento bajo el namespace no ejecutará el interceptor.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnect for EventLogger {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());

        Ok(())
    }
}
```

Como habrás notado, es necesario definir un tipo de error asociado. Este puede tener la estructura o formato que estimes conveniente, pero debe implementar el trait `Display`.

Luego, puedes aplicar este interceptor a un controlador Socket.IO:

```rust
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
        let payload: Event = ctx.try_data().expect("Failed to parse event data");

        println!("Received 'event' from {}: {payload:?}", ctx.id());
    }
}
```

En este ejemplo, el interceptor se aplica antes del evento `#[on("connection")]`. Cualquier interacción en otros eventos asociados al controlador no pasará por el interceptor aplicado.

## Interceptores con configuración

### El Trait `OnConnectWithConfig`

Al igual que `OnConnect`, este trait permite definir lógica personalizada que se ejecuta antes de que un cliente se conecte a un namespace en concreto, pero permite recibir un parámetro de tipo `T` extra con el que podremos tener un nivel adicional de configuración.

```rust
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

Como habrás notado, es necesario definir un tipo de error asociado. Este puede tener la estructura o formato que estimes conveniente, pero debe implementar el trait `Display`.

Luego, puedes aplicar este interceptor a un controlador Socket.IO:

```rust
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
        let payload: Event = ctx.try_data().expect("Failed to parse event data");

        println!("Received 'event' from {}: {payload:?}", ctx.id());
    }
}
```

En este ejemplo, el interceptor se aplica antes del evento `#[on("connection")]`. Cualquier interacción en otros eventos asociados al controlador no pasará por el interceptor aplicado.

## Tower y Socket.IO

En Socket.IO conviene distinguir dos cosas:

- **Layers globales**: sí aplican, porque Socket.IO se monta sobre el runtime web de la aplicación. Por ejemplo, una layer global de CORS puede influir en el handshake inicial y en la solicitud HTTP asociada al transporte `polling` o `websocket`.
- **Layers locales vía `#[interceptor(expr)]`**: no se soportan para lógica de conexión.

Si necesitas lógica específica de conexión en Socket.IO, la forma correcta es mediante `OnConnect` u `OnConnectWithConfig`.

## Extensiones

En Socket.IO existe un concepto relacionado, pero distinto al de las extensiones web:

- `ctx.extensions()` da acceso a las extensiones del socket.
- `ctx.http_extensions()` da acceso a las extensiones HTTP asociadas a la solicitud inicial.

Esto resulta útil cuando necesitas compartir información entre el handshake HTTP y la fase posterior de eventos en tiempo real. Para más detalles, revisa [Contexto y extensiones](/es/practical-guides/socketio/context-and-extensions).
