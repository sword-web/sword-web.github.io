---
title: "Controladores Socket.IO"
description: "Definición y eventos soportados de controladores Socket.IO en Sword."
outline: [2, 3]

prev:
    text: Controladores Web
    link: /es/application-components/controllers/web-controllers
next:
    text: Inyección de Dependencias
    link: /es/application-components/di/
---

# Controladores Socket.IO

En Sword, un controlador Socket.IO es una estructura que define un namespace y un conjunto de eventos que pueden ser manejados por métodos específicos.

Estos controladores permiten manejar conexiones de clientes en tiempo real, procesar mensajes y emitir eventos a los clientes conectados. Se basan en el crate `socketioxide`.

## Definir un controlador

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/chat")]
pub struct ChatController;

impl ChatController {
    #[on("connection")]
    async fn on_connect(&self, socket: SocketContext) {
        println!("Client connected: {}", socket.id());

        let query: Option<MyQuery> = socket.query().unwrap();
        println!("Query params: {:?}", query);
    }

    #[on("message")]
    async fn on_message(&self, socket: SocketContext) {
        let Ok(message) = socket.try_data::<String>() else {
            return;
        };

        socket.emit("message", &message).ok();
    }
}
```

## Eventos soportados

### Eventos especiales

- `#[on("connection")]`: Se ejecuta cuando un cliente se conecta al namespace del controlador.
- `#[on("disconnection")]`: Se ejecuta cuando un cliente se desconecta del namespace del controlador.
- `#[on("fallback")]`: Se ejecuta cuando un evento no tiene un handler definido en el controlador.

### Eventos personalizados

Puedes definir eventos personalizados usando el atributo `#[on("event_name")]`, donde `event_name` es el nombre del evento que deseas manejar.

## Ver también

- [Manejo de eventos](/es/practical-guides/socketio/event-handling)
- [Acknowledgements](/es/practical-guides/socketio/acknowledgements)
- [Interceptores en Controladores Socket.IO](/es/practical-guides/socketio/interceptors)
