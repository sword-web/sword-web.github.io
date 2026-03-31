# Contexto y extensiones

`SocketContext` es el punto central de acceso al estado de una conexión Socket.IO dentro de un handler.

## Información básica del socket

Puedes acceder a datos del socket actual con métodos como:

- `ctx.id()`
- `ctx.event()`
- `ctx.protocol_version()`
- `ctx.transport_type()`
- `ctx.disconnect_reason()`

Ejemplo:

```rust
println!("Socket ID: {}", ctx.id());

if let Some(event) = ctx.event() {
    println!("Current event: {event}");
}
```

## Extensiones del socket

`ctx.extensions()` da acceso al almacenamiento de extensiones propio del socket.

Esto puede servir para compartir estado durante la vida de la conexión.

## Extensiones HTTP

`ctx.http_extensions()` da acceso a las extensiones HTTP de la request inicial del handshake.

Esto es útil cuando una layer o interceptor HTTP deja información en la request y luego necesitas reutilizarla en el contexto Socket.IO.

## Cerrar la conexión

Puedes cerrar la conexión desde el servidor con:

```rust
let _ = ctx.disconnect();
```
