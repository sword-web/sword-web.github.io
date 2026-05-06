---
title: "Manejo de eventos y referencia de SocketContext"
description: "En Sword, los controladores Socket.IO trabajan con eventos (#[on(\"...\")]) y reciben un SocketContext."
outline: [2, 3]
---
# Manejo de eventos y referencia de SocketContext

En Sword, los controladores Socket.IO trabajan con eventos (`#[on("...")]`) y reciben un `SocketContext`.
Esta pagina unifica el flujo de eventos con la referencia de la API publica de `SocketContext`, basada en la implementacion real del crate `sword-socketio`.

## Tipos de eventos

Los handlers mas comunes son:

- `connection`
- `disconnection`
- eventos personalizados como `message`, `chat-message` o `room:join`

## Comportamiento por tipo de handler

- En `connection`, `event()` retorna `None`; `try_data::<T>()` intenta leer `auth` del handshake.
- En `message`, `event()` retorna `Some(nombre_evento)` y `try_data::<T>()` lee el payload del evento.
- En `disconnection`, `disconnect_reason()` puede retornar el motivo de desconexion.

## Referencia de SocketContext

### Atributo `socket`

```rust
pub socket: SocketRef<A>
```

**Retorna**

- Acceso directo al socket de `socketioxide`.

**Cuando usarlo**

- Para `emit`, `join`, `leave`, `broadcast`, `to(room)`, etc.

**Cuando no usarlo**

- Cuando solo necesitas informacion del contexto (`id`, `event`, `transport_type`, etc.).

### Método `id()`

```rust
pub fn id(&self) -> &Sid
```

**Retorna**

- Identificador del socket (`socketioxide::Sid`).

**Cuando usarlo**

- Logging, trazabilidad, asociar eventos a una conexion especifica.

### Método `event()`

```rust
pub fn event(&self) -> Option<&str>
```

**Retorna**

- `Some(nombre_evento)` en handlers de mensaje.
- `None` en `connection` y `disconnection`.

**Cuando usarlo**

- Para enrutar logica por nombre de evento o registrar metricas por evento.

### Método `protocol_version()`

```rust
pub fn protocol_version(&self) -> ProtocolVersion
```

**Retorna**

- Version de protocolo Socket.IO negociada.

**Cuando usarlo**

- Diagnostico y compatibilidad de clientes.

### Método `transport_type()`

```rust
pub fn transport_type(&self) -> TransportType
```

**Retorna**

- Transporte activo (`websocket` o `polling`).

**Cuando usarlo**

- Telemetria, reglas por tipo de transporte, debugging de handshake.

### Método `disconnect_reason()`

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Retorna**

- `Some(reason)` en handlers de desconexion.
- `None` en connect/message.

**Cuando usarlo**

- Auditar porque se cierra una conexion.

### Método `try_data::<T>()`

```rust
pub fn try_data<T: DeserializeOwned>(&self) -> Result<T, SocketError>
```

**Retorna**

- `Ok(T)` si el payload pudo deserializarse.
- `Err(SocketError)` si no hay payload disponible o falla el parseo.

**Cuando usarlo**

- Cuando necesitas deserializar payload (o `auth` en `connection`) sin validacion de `validator`.

**Cuando no usarlo**

- Si necesitas reglas declarativas de validacion; en ese caso usa `try_validated_data::<T>()`.

**Notas**

- Este metodo consume el payload interno. Una segunda llamada en el mismo handler falla.

### Método `try_validated_data::<T>()`

```rust
pub fn try_validated_data<T>(&self) -> Result<T, SocketError>
where
    T: DeserializeOwned + Validate
```

**Retorna**

- `Ok(T)` si deserializa y valida correctamente.
- `Err(SocketError)` si falla parseo, no hay payload o falla validacion.

**Cuando usarlo**

- Cuando el payload debe cumplir reglas de `validator`.

**Cuando no usarlo**

- Si no habilitaste la feature `validation-validator`.

**Notas**

- Internamente usa `try_data()`, por lo que tambien consume el payload.

### Método `has_data()`

```rust
pub fn has_data(&self) -> bool
```

**Retorna**

- `true` si el payload aun no fue consumido.

**Cuando usarlo**

- Para evitar intentar parsear dos veces.

### Método `has_ack()`

```rust
pub fn has_ack(&self) -> bool
```

**Retorna**

- `true` si el evento actual incluye callback ACK.

**Cuando usarlo**

- Antes de llamar `ack(...)` en handlers de mensaje.

### Método `ack(&value)`

```rust
pub fn ack<D>(self, data: &D) -> Result<(), SendError>
where
    D: Serialize + ?Sized
```

**Retorna**

- `Ok(())` si el ACK se envia.
- `Err(SendError)` si no hay ACK disponible o falla el envio.

**Cuando usarlo**

- Para responder callbacks del cliente cuando `has_ack()` es `true`.

**Cuando no usarlo**

- En handlers sin ACK asociado.

**Notas**

- Consume `self`; despues de `ack(...)` no puedes seguir usando ese `SocketContext`.

### Método `extensions()`

```rust
pub fn extensions(&self) -> &Extensions
```

**Retorna**

- Almacen de extensiones asociado al socket.

**Cuando usarlo**

- Compartir estado durante la vida de la conexion.

### Método `http_extensions()`

```rust
pub fn http_extensions(&self) -> &HttpExtensions
```

**Retorna**

- Extensiones HTTP del handshake inicial.

**Cuando usarlo**

- Reutilizar datos escritos en interceptors/layers HTTP durante el handshake.

### Método `disconnect()`

```rust
pub fn disconnect(self) -> Result<(), SocketError>
```

**Retorna**

- `Ok(())` si la desconexion se ejecuta.
- `Err(SocketError)` si falla el cierre de conexion.

**Cuando usarlo**

- Cuando el servidor decide cortar la conexion activamente.

**Notas**

- Consume `self`; despues de llamarlo no puedes reutilizar el contexto.

## Ejemplo base

```rust
use sword::prelude::*;
use sword::socketio::*;

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

        if ctx.has_ack() {
            let _ = ctx.ack(&"ok");
            return;
        }

        ctx.socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, ctx: SocketContext) {
        println!("reason: {:?}", ctx.disconnect_reason());
    }
}
```

## Ver tambien

- [Validacion de datos](/es/practical-guides/socketio/data-validation)
- [ACKs](/es/practical-guides/socketio/acknowledgements)
- [Contexto y extensiones](/es/practical-guides/socketio/context-and-extensions)
