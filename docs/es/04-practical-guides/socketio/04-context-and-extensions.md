---
title: "Contexto y extensiones"
description: "Esta guía se enfoca en compartir estado con extensiones durante el ciclo de vida de una conexión Socket.IO."
outline: [2, 3]
---
# Contexto y extensiones

Esta guía se enfoca en compartir estado con extensiones durante el ciclo de vida de una conexión Socket.IO.

La referencia completa de `SocketContext` (métodos, firmas y semántica por tipo de handler) está en [Manejo de eventos y referencia de SocketContext](/es/practical-guides/socketio/event-handling).

## Extensiones del socket

`ctx.extensions()` da acceso al almacenamiento de extensiones del socket.

Uso recomendado:

- guardar estado asociado a una conexión concreta.
- compartir datos entre distintos eventos del mismo cliente.

## Extensiones HTTP del handshake

`ctx.http_extensions()` permite leer extensiones de la solicitud HTTP inicial del handshake.

Uso recomendado:

- reutilizar datos agregados por layers o interceptores HTTP antes de entrar al mundo Socket.IO.

## Ejemplo conceptual

```rust
use sword::socketio::SocketContext;

fn read_shared_data(ctx: &SocketContext) {
    let _socket_ext = ctx.extensions();
    let _http_ext = ctx.http_extensions();
}
```
