# Controladores Socket.IO

En Sword, los controladores Socket.IO son una adaptación de los `handlers` de `socketioxide`. Con ellos tendrás la capacidad de manejar conexiones bidireccionales y en tiempo real.

A diferencia de un controlador web, con estos controladores trabajarás con eventos usando el atributo `#[on("event")]`.

## Definir un controlador Socket.IO

Para definir un controlador Socket.IO debes declarar el atributo kind como `Controller::SocketIo` y un `namespace` asociado al controlador.

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

Sword soporta estos eventos especiales:

- `#[on("connection")]`
- `#[on("disconnection")]`
- `#[on("fallback")]`

Y además cualquier evento personalizado:

- `#[on("message")]`
- `#[on("chat-message")]`
- `#[on("room:join")]`

## Estructura `SocketContext` en detalle

La estructura `SocketContext` es el extractor principal en los métodos de un controlador Socket.IO. Se construye internamente para eventos de conexión, mensaje o desconexión.

### Métodos y atributos de utilidad

- `ctx.socket` te da acceso directo al `SocketRef` para `emit`, `join`, `leave`, `broadcast`, etc.
- `ctx.id()` retorna el `Sid` del socket.
- `ctx.event()` retorna el nombre del evento (solo en handlers de mensaje).
- `ctx.try_data::<T>()` deserializa el payload a un tipo `T`.
- `ctx.try_validated_data::<T>()` deserializa y valida con `validator` (si está activo `validation-validator`).
- `ctx.ack(&data)` responde ACK al cliente cuando el evento fue enviado con callback.
- `ctx.has_ack()` indica si hay ACK disponible.
- `ctx.has_data()` indica si aún no consumiste el payload.
- `ctx.disconnect_reason()` solo tiene valor en `disconnection`.
- `ctx.disconnect()` cierra la conexión desde servidor.
- `ctx.extensions()` acceso a extensiones del socket.
- `ctx.http_extensions()` acceso a extensiones HTTP de la request inicial.

### Nota importante sobre `try_data`

`try_data::<T>()` consume el payload interno. Si llamas `try_data` dos veces en el mismo handler, la segunda llamada fallará porque ya no hay data disponible.

## Ejemplo con eventos de conexión, mensaje y desconexión

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

## Respuestas ACK

Si el cliente envía un evento con callback ACK, puedes responder desde el handler:

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

## Interceptors en Socket.IO

Socket.IO tiene interceptores de conexión mediante el trait `OnConnect`.

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

Y se aplica en el `struct` del controlador:

```rust
#[controller(kind = Controller::SocketIo, namespace = "/chat")]
#[interceptor(AuthConnectInterceptor)]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("authorized socket: {}", ctx.id());
    }
}
```

Si el interceptor retorna `Err`, la conexión se rechaza.

## Registrar el controlador en un módulo

```rust
use sword::prelude::*;

pub struct ChatModule;

impl Module for ChatModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<ChatController>();
    }
}
```

## Configuración completa de Socket.IO

Para habilitar Socket.IO debes usar el feature `socketio-controllers` y configurar `[socketio]` en el fichero de configuración.

### Campos disponibles en `SocketIoServerConfig`

| Key                   | Tipo                    | Default                          | Descripción |
| --------------------- | ----------------------- | -------------------------------- | ----------- |
| `ack-timeout`         | `Option<TimeConfig>`    | `5s` (si no se define)           |             |
| `connect-timeout`     | `Option<TimeConfig>`    | `45s` (si no se define)          |             |
| `max-buffer-size`     | `Option<usize>`         | `128` (si no se define)          |             |
| `max-payload`         | `Option<ByteConfig>`    | `100KB` (si no se define)        |             |
| `ping-interval`       | `Option<TimeConfig>`    | `25s` (si no se define)          |             |
| `ping-timeout`        | `Option<TimeConfig>`    | `20s` (si no se define)          |             |
| `req-path`            | `Option<String>`        | `"/socket.io"` (si no se define) |             |
| `transports`          | `Option<Vec<String>>`   | `["polling", "websocket"]`       |             |
| `parser`              | `"common" \| "msgpack"` | `"common"`                       |             |
| `ws-read-buffer-size` | `Option<usize>`         | `4096` bytes (si no se define)   |             |
| `display`             | `bool`                  | `false`                          |             |
