---
title: Controladores Socket.IO
description: Definición, eventos soportados, SocketContext y configuración de controladores Socket.IO en Sword.
outline: [2, 3]
prev:
  text: Controladores Web
  link: /es/application-components/controllers/web-controllers
next:
  text: Inyección de Dependencias
  link: /es/application-components/di/
---

# Controladores Socket.IO

En Sword, un controlador Socket.IO es un `struct` anotado con `#[controller(kind = Controller::SocketIo, namespace = "...")]` cuyos métodos manejan eventos declarados con `#[on("...")]`.

## Definir un controlador

```rust
use sword::prelude::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }
}
```

## Eventos soportados

### Eventos especiales

- `#[on("connection")]`
- `#[on("disconnection")]`
- `#[on("fallback")]`

### Eventos personalizados

- `#[on("message")]`
- `#[on("chat-message")]`
- `#[on("room:join")]`

## `SocketContext`

`SocketContext` es el extractor principal en handlers Socket.IO.

### Resumen rápido

| API | Uso |
| --- | --- |
| `ctx.socket` | acceso directo a `emit`, `join`, `leave`, `broadcast`, etc. |
| `ctx.id()` | leer el identificador del socket |
| `ctx.event()` | leer el nombre del evento actual |
| `ctx.try_data::<T>()` | deserializar el payload |
| `ctx.try_validated_data::<T>()` | deserializar y validar payload |
| `ctx.ack(&value)` | responder un ACK |
| `ctx.has_ack()` | comprobar si existe ACK |
| `ctx.has_data()` | saber si el payload sigue disponible |
| `ctx.disconnect_reason()` | leer motivo de desconexión |
| `ctx.disconnect()` | cerrar la conexión desde servidor |
| `ctx.extensions()` | extensiones del socket |
| `ctx.http_extensions()` | extensiones HTTP del handshake |
| `ctx.transport_type()` | transporte actual |
|

`ctx.try_data::<T>()` consume el payload interno. Si se invoca dos veces en el mismo handler, la segunda llamada falla porque ya no queda data disponible.

### Ejemplo con conexión, mensaje y desconexión

```rust
use sword::prelude::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("connected: {}", ctx.id());
    }

    #[on("message")]
    async fn on_message(&self, ctx: SocketContext) {
        let Ok(message) = ctx.try_data::<String>() else {
            return;
        };

        ctx.socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, ctx: SocketContext) {
        println!("disconnect reason: {:?}", ctx.disconnect_reason());
    }
}
```

## ACKs

Si el cliente envía un evento con callback ACK, el handler puede responder mediante `ctx.ack(...)`.

```rust
use serde::Serialize;
use sword::prelude::*;

#[derive(Serialize)]
struct AckPayload {
    ok: bool,
}

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("ping")]
    async fn ping(&self, ctx: SocketContext) {
        if ctx.has_ack() {
            let _ = ctx.ack(&AckPayload { ok: true });
        }
    }
}
```

`ctx.has_ack()` permite comprobar si el evento actual incluye callback ACK.

## Interceptors de conexión

Socket.IO en Sword soporta interceptors de conexión mediante `OnConnect` y `OnConnectWithConfig`.

```rust
use sword::prelude::*;

#[derive(Interceptor)]
pub struct AuthConnectInterceptor;

impl OnConnect for AuthConnectInterceptor {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        let Some(auth) = ctx.socket.req_parts().headers.get("authorization") else {
            return Err("missing authorization header".to_string());
        };

        let token = auth.to_str().map_err(|_| "invalid authorization header")?;

        if token.is_empty() {
            return Err("empty token".to_string());
        }

        Ok(())
    }
}
```

Aplicación sobre el controlador:

```rust
#[controller(kind = Controller::SocketIo, namespace = "/chat")]
#[interceptor(AuthConnectInterceptor)]
pub struct ChatController;
```

Si el interceptor retorna `Err`, la conexión se rechaza. El tipo de error debe implementar `Display`.

## Registro en un módulo

```rust
use sword::prelude::*;

pub struct ChatModule;

impl Module for ChatModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<ChatController>();
    }
}
```

## Configuración de `[socketio]`

Para habilitar Socket.IO debes compilar con `socketio-controllers` y definir la sección `[socketio]` en la configuración.

```toml
[socketio]
enabled = true
parser = "common"
transports = ["websocket", "polling"]
ping-timeout = "20s"
ping-interval = "25s"
```

### Campos disponibles en `SocketIoServerConfig`

| Key | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `ack-timeout` | `Option<TimeConfig>` | `5s` | Tiempo máximo para ACK saliente |
| `connect-timeout` | `Option<TimeConfig>` | `45s` | Límite para completar la conexión inicial |
| `max-buffer-size` | `Option<usize>` | `128` | Máximo de paquetes en buffer por conexión |
| `max-payload` | `Option<ByteConfig>` | `100KB` | Tamaño máximo de payload saliente |
| `ping-interval` | `Option<TimeConfig>` | `25s` | Intervalo de ping del servidor |
| `ping-timeout` | `Option<TimeConfig>` | `20s` | Tiempo de espera de pong antes de desconectar |
| `req-path` | `Option<String>` | `"/socket.io"` | Ruta HTTP donde se monta Socket.IO |
| `transports` | `Option<Vec<String>>` | `["polling", "websocket"]` | Transportes permitidos |
| `parser` | `"common" \| "msgpack"` | `"common"` | Parser de payloads |
| `ws-read-buffer-size` | `Option<usize>` | `4096` | Tamaño del buffer de lectura websocket |
| `display` | `bool` | `false` | Muestra esta config en startup |

La clave soportada por configuración es `transports`.

## Ver también

- [Manejo de eventos](/es/practical-guides/socketio/event-handling)
- [ACKs](/es/practical-guides/socketio/acknowledgements)
- [Contexto y extensiones](/es/practical-guides/socketio/context-and-extensions)
- [Interceptores con Configuración](/es/application-components/interceptors/with-config)
