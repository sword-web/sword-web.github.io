---
title: "Manejo de eventos y referencia de SocketContext"
description: "En Sword, los controladores Socket.IO trabajan con eventos (#[on(\"...\")]) y reciben un SocketContext."
outline: [2, 3]
---

# Manejo de eventos y referencia de SocketContext

En Sword, los controladores Socket.IO trabajan con eventos (`#[on("...")]`) y reciben un `SocketContext`.
Esta pagina unifica el flujo de eventos con la referencia de la API publica de `SocketContext`.

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

### Método `id()`

```rust
pub fn id(&self) -> &Sid
```

**Retorna**

- Identificador del socket (`socketioxide::Sid`).

**Cuando usarlo**

- Logging, trazabilidad, asociar eventos a una conexion especifica.

### Método `connected()`

```rust
pub fn connected(&self) -> bool
```

**Retorna**

- `true` si el socket está conectado al namespace.

**Cuando usarlo**

- Verificar si el socket sigue activo antes de realizar operaciones.

### Método `ns()`

```rust
pub fn ns(&self) -> &str
```

**Retorna**

- La ruta del namespace actual de este socket.

### Método `rooms()`

```rust
pub fn rooms(&self) -> Vec<Room>
```

**Retorna**

- Todos los nombres de salas a las que este socket está conectado.

### Método `event()`

```rust
pub fn event(&self) -> Option<&str>
```

**Retorna**

- `Some(nombre_evento)` en handlers de mensaje.
- `None` en `connection` y `disconnection`.

**Cuando usarlo**

- Para enrutar logica por nombre de evento o registrar metricas por evento.

### Método `disconnect_reason()`

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Retorna**

- `Some(reason)` en handlers de desconexion.
- `None` en connect/message.

**Cuando usarlo**

- Auditar porque se cierra una conexion.

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

### Método `query::<T>()`

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, SocketError>
```

**Retorna**

- `Ok(Some(T))` si la query string existe y es válida.
- `Ok(None)` si no hay query string.
- `Err(SocketError)` si la query existe pero no deserializa.

**Cuando usarlo**

- Para leer parámetros de query de la URL durante la conexión.

### Método `emit()`

```rust
pub fn emit<T>(&self, event: impl AsRef<str>, data: &T) -> Result<(), SocketError>
where
    T: Serialize + ?Sized
```

**Retorna**

- `Ok(())` si el evento se envía.
- `Err(SocketError)` si falla el envío.

**Cuando usarlo**

- Enviar eventos al cliente conectado.

### Método `emit_with_ack()`

```rust
pub fn emit_with_ack<T: ?Sized + Serialize, V>(
    &self,
    event: impl AsRef<str>,
    data: &T,
) -> Result<AckStream<V>, SocketError>
```

**Retorna**

- Un `AckStream` que se resuelve cuando el cliente confirma el evento.

**Cuando usarlo**

- Cuando necesitas confirmación del cliente de que el evento fue recibido.

### Método `broadcast()`

```rust
pub fn broadcast(&self) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de broadcast que envía a todos los clientes conectados (excepto el emisor).

**Cuando usarlo**

- Transmitir un mensaje a cada cliente conectado.

### Método `local()`

```rust
pub fn local(&self) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de broadcast que envía solo a los clientes de este nodo.

**Cuando usarlo**

- Broadcast solo a la instancia actual del servidor (despliegues multi-nodo).

### Método `to()`

```rust
pub fn to(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de broadcast limitado a las salas especificadas.

**Cuando usarlo**

- Enviar a salas específicas a las que el socket pertenece.

### Método `within()`

```rust
pub fn within(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de broadcast limitado a las salas especificadas (alias de `to()`).

### Método `except()`

```rust
pub fn except(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de broadcast que excluye las salas especificadas.

**Cuando usarlo**

- Broadcast a todos excepto ciertas salas.

### Método `timeout()`

```rust
pub fn timeout(&self, timeout: Duration) -> ConfOperators<'_, A>
```

**Retorna**

- Un operador de configuración con timeout personalizado para acknowledgement.

**Cuando usarlo**

- Establecer un timeout al enviar un mensaje con acknowledgement.

### Método `join()`

```rust
pub fn join(&self, rooms: impl RoomParam)
```

**Cuando usarlo**

- Agregar el socket actual a una o más salas.

### Método `leave()`

```rust
pub fn leave(&self, rooms: impl RoomParam)
```

**Cuando usarlo**

- Remover el socket actual de una o más salas.

### Método `leave_all()`

```rust
pub fn leave_all(&self)
```

**Cuando usarlo**

- Remover el socket actual de todas sus salas.

### Método `has_ack()`

```rust
pub fn has_ack(&self) -> bool
```

**Retorna**

- `true` si el evento actual incluye callback ACK.

**Cuando usarlo**

- Antes de llamar `ack(...)` en handlers de mensaje.

### Método `ack()`

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

### Método `req_parts()`

```rust
pub fn req_parts(&self) -> &Parts
```

**Retorna**

- Las partes del request HTTP del handshake inicial.

**Cuando usarlo**

- Acceder a datos HTTP crudos (method, URI, etc.).

### Método `headers()`

```rust
pub fn headers(&self) -> &HeaderMap
```

**Retorna**

- Una referencia a los headers del request del socket.

**Cuando usarlo**

- Leer headers HTTP del handshake inicial.

### Método `authorization()`

```rust
pub fn authorization(&self) -> Option<&str>
```

**Retorna**

- El valor del header `Authorization`, si está presente.

**Cuando usarlo**

- Extraer tokens bearer u otros datos de autenticación del handshake.

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
    async fn on_connect(&self, socket: SocketContext) {
        println!("connected: {}", socket.id());

        let query: Option<MyQuery> = socket.query().unwrap();
    }

    #[on("message")]
    async fn on_message(&self, socket: SocketContext) {
        let Ok(message) = socket.try_data::<String>() else {
            return;
        };

        if socket.has_ack() {
            let _ = socket.ack(&"ok");
            return;
        }

        socket.emit("message", &message).ok();
    }

    #[on("disconnection")]
    async fn on_disconnect(&self, socket: SocketContext) {
        println!("reason: {:?}", socket.disconnect_reason());
    }
}
```

## Ver tambien

- [Validacion de datos](/es/practical-guides/socketio/data-validation)
- [ACKs](/es/practical-guides/socketio/acknowledgements)
- [Contexto y extensiones](/es/practical-guides/socketio/context-and-extensions)
