---
title: "Manejo de eventos y referencia de SocketContext"
description: 'En Sword, los controladores Socket.IO trabajan con eventos (#[on("...")]) y reciben un SocketContext.'
outline: [2, 3]
---

# Manejo de eventos y referencia de SocketContext

Al igual que en los controladores web, los controladores Socket.IO trabajan con métodos de la estructura, cada uno de ellos tiene la capacidad de utilizar un extractor general del contexto.

Esta estructura, llamada `SocketContext`, encapsula información relevante sobre la conexión, el evento y el estado del socket.

<ApiSection title="Métodos" :collapsed="false">

#### Método `id()`

```rust
pub fn id(&self) -> &Sid
```

**Retorna**

- Identificador del socket (`socketioxide::Sid`).

**Cuándo usarlo**

- Logging, trazabilidad, asociar eventos a una conexión específica.


#### Método `connected()`

```rust
pub fn connected(&self) -> bool
```

**Retorna**

- `true` si el socket está conectado al namespace.

**Cuándo usarlo**

- Verificar si el socket sigue activo antes de realizar operaciones.


#### Método `ns()`

```rust
pub fn ns(&self) -> &str
```

**Retorna**

- La ruta del namespace actual de este socket.


#### Método `rooms()`

```rust
pub fn rooms(&self) -> Vec<Room>
```

**Retorna**

- Todos los nombres de salas a las que este socket está conectado.


#### Método `event()`

```rust
pub fn event(&self) -> Option<&str>
```

**Retorna**

- `Some(nombre_evento)` en handlers de mensaje.

**Cuándo usarlo**

- Para enrutar lógica por nombre de evento o registrar métricas por evento.

:::info
Al usar este método en el evento `connection` o `disconnection` retornará `None`.
:::


#### Método `disconnect_reason()`

```rust
pub fn disconnect_reason(&self) -> Option<&DisconnectReason>
```

**Retorna**

- `Some(reason)` en handlers de desconexión.
- `None` en `connect`/`message`.

**Cuándo usarlo**

- Auditar por qué se cierra una conexión.


#### Método `protocol_version()`

```rust
pub fn protocol_version(&self) -> ProtocolVersion
```

**Retorna**

- Versión de protocolo Socket.IO negociada.

**Cuándo usarlo**

- Diagnostico y compatibilidad de clientes.


#### Método `transport_type()`

```rust
pub fn transport_type(&self) -> TransportType
```

**Retorna**

- Transporte activo (`websocket` o `polling`).

**Cuándo usarlo**

- Telemetría, reglas por tipo de transporte, depuración de handshake.


#### Método `try_data::<T>()`

```rust
pub fn try_data<T: DeserializeOwned>(&self) -> Result<T, SocketError>
```

**Retorna**

- `Ok(T)` si el payload pudo deserializarse.
- `Err(SocketError)` si no hay payload disponible o falla el parseo.

**Cuándo usarlo**

- Cuando necesitas deserializar payload sin validación de esquema.

:::info
En el evento `connection`, este método intenta leer el payload de `auth` del handshake.
:::

:::warning
Este método consume el payload interno. Una segunda llamada en el mismo handler falla.
:::


#### Método `try_validated_data::<T>()`

```rust
pub fn try_validated_data<T>(&self) -> Result<T, SocketError>
where
    T: DeserializeOwned + Validate
```

**Retorna**

- `Ok(T)` si deserializa y valida correctamente.
- `Err(SocketError)` si falla parseo, no hay payload o falla validación.

**Cuándo usarlo**

- Cuando el payload debe cumplir reglas de validación de esquemas.

:::info
En el evento `connection`, este método intenta leer el payload de `auth` del handshake.
:::

:::warning
Este método consume el payload interno. Una segunda llamada en el mismo handler falla.
:::


#### Método `has_data()`

```rust
pub fn has_data(&self) -> bool
```

**Retorna**

- `true` si el payload aun no fue consumido.

**Cuándo usarlo**

- Para evitar intentar parsear dos veces.


#### Método `query::<T>()`

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, SocketError>
```

**Retorna**

- `Ok(Some(T))` si la query string existe y es válida.
- `Ok(None)` si no hay query string.
- `Err(SocketError)` si la query existe pero no deserializa.

**Cuándo usarlo**

- Para leer parámetros de query de la URL durante la conexión.


#### Método `emit()`

```rust
pub fn emit<T>(&self, event: impl AsRef<str>, data: &T) -> Result<(), SocketError>
where
    T: Serialize + ?Sized
```

**Retorna**

- `Ok(())` si el evento se envía.
- `Err(SocketError)` si falla el envío.

**Cuándo usarlo**

- Enviar eventos al cliente conectado.


#### Método `emit_with_ack()`

```rust
pub fn emit_with_ack<T: ?Sized + Serialize, V>(
    &self,
    event: impl AsRef<str>,
    data: &T,
) -> Result<AckStream<V>, SocketError>
```

**Retorna**

- Un `AckStream` que se resuelve cuando el cliente confirma el evento.

**Cuándo usarlo**

- Cuando necesitas confirmación del cliente de que el evento fue recibido.


#### Método `broadcast()`

```rust
pub fn broadcast(&self) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de difusión que envía a todos los clientes conectados (excepto el emisor).

**Cuándo usarlo**

- Transmitir un mensaje a cada cliente conectado.


#### Método `local()`

```rust
pub fn local(&self) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de difusión que envía solo a los clientes de este nodo.

**Cuándo usarlo**

- Broadcast solo a la instancia actual del servidor (despliegues multi-nodo).


#### Método `to()`

```rust
pub fn to(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de difusión limitado a las salas especificadas.

**Cuándo usarlo**

- Enviar a salas específicas a las que el socket pertenece.


#### Método `within()`

```rust
pub fn within(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de difusión limitado a las salas especificadas (alias de `to()`).


#### Método `except()`

```rust
pub fn except(&self, rooms: impl RoomParam) -> BroadcastOperators<A>
```

**Retorna**

- Un operador de difusión que excluye las salas especificadas.

**Cuándo usarlo**

- Broadcast a todos excepto ciertas salas.


#### Método `timeout()`

```rust
pub fn timeout(&self, timeout: Duration) -> ConfOperators<'_, A>
```

**Retorna**

- Un operador de configuración con tiempo de espera personalizado para la confirmación.

**Cuándo usarlo**

- Establecer un tiempo de espera al enviar un mensaje con confirmación.


#### Método `join()`

```rust
pub fn join(&self, rooms: impl RoomParam)
```

**Cuándo usarlo**

- Agregar el socket actual a una o más salas.


#### Método `leave()`

```rust
pub fn leave(&self, rooms: impl RoomParam)
```

**Cuándo usarlo**

- Remover el socket actual de una o más salas.


#### Método `leave_all()`

```rust
pub fn leave_all(&self)
```

**Cuándo usarlo**

- Remover el socket actual de todas sus salas.


#### Método `has_ack()`

```rust
pub fn has_ack(&self) -> bool
```

**Retorna**

- `true` si el evento actual incluye callback ACK.

**Cuándo usarlo**

- Antes de llamar `ack(...)` en handlers de mensaje.


#### Método `ack()`

```rust
pub fn ack<D>(self, data: &D) -> Result<(), SendError>
where
    D: Serialize + ?Sized
```

**Retorna**

- `Ok(())` si el ACK se envía.
- `Err(SendError)` si no hay ACK disponible o falla el envío.

**Cuándo usarlo**

- Para responder callbacks del cliente cuando `has_ack()` es `true`.

**Cuando no usarlo**

- En handlers sin ACK asociado.

::: warning
Consume `self`, es decir, después de invocarlo no puedes reutilizar el contexto.
:::


#### Método `req_parts()`

```rust
pub fn req_parts(&self) -> &Parts
```

**Retorna**

- Las partes de la solicitud HTTP del handshake inicial.

**Cuándo usarlo**

- Acceder a datos HTTP crudos (método, URI, etc.).


#### Método `headers()`

```rust
pub fn headers(&self) -> &HeaderMap
```

**Retorna**

- Una referencia a los headers de la solicitud del socket.

**Cuándo usarlo**

- Leer headers HTTP del handshake inicial.


#### Método `authorization()`

```rust
pub fn authorization(&self) -> Option<&str>
```

**Retorna**

- El valor del header `Authorization`, si está presente.

**Cuándo usarlo**

- Extraer tokens Bearer u otros datos de autenticación del handshake.


#### Método `extensions()`

```rust
pub fn extensions(&self) -> &Extensions
```

**Retorna**

- Almacén de extensiones asociado al socket.

**Cuándo usarlo**

- Compartir estado durante la vida de la conexión.


#### Método `http_extensions()`

```rust
pub fn http_extensions(&self) -> &HttpExtensions
```

**Retorna**

- Extensiones HTTP del handshake inicial.

**Cuándo usarlo**

- Reutilizar datos escritos en interceptores/layers HTTP durante el handshake.


#### Método `disconnect()`

```rust
pub fn disconnect(self) -> Result<(), SocketError>
```

**Retorna**

- `Ok(())` si la desconexión se ejecuta.
- `Err(SocketError)` si falla el cierre de conexión.

**Cuándo usarlo**

- Cuando el servidor decide cortar la conexión activamente.

::: warning
Consume `self`, es decir, después de invocarlo no puedes reutilizar el contexto.
:::

</ApiSection>

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
