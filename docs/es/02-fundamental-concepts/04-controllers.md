---
title: "Controladores"
description: "Un controlador es el punto de entrada a tu aplicación: recibe solicitudes o eventos y los convierte en llamadas a la lógica de negocio."
outline: [2, 3]
---

# Controladores

Un controlador es el punto de entrada a tu aplicación. Recibe eventos o solicitudes internas o externas y los transforma en llamadas a la lógica de negocio de tus módulos.

Según el mecanismo de comunicación, un controlador puede atender una solicitud HTTP, escuchar mensajes en tiempo real, responder a llamadas remotas gRPC o procesar eventos internos y externos.

<ControllersDiagram />

## Declaración

Un controlador es una estructura anotada con la macro `#[controller]` que implementa el trait `ControllerSpec`.

```rust
use std::sync::Arc;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController {
    logger: Arc<Logger>,
    service: Arc<UsersService>,
}
```

### Atributos de la macro

**Tipo de controlador**

El atributo `kind` selecciona el tipo de controlador, definidos por:

```rust
enum Controller {
    Web,
    SocketIo,
    Grpc,
    Events,
    Jobs,
}
```

**Atributos propios de cada tipo de controlador**

Cada tipo de controlador define sus propios atributos, que se documentan en la guía práctica correspondiente:

- [Controladores web](/es/practical-guides/web/controllers)
- [Controladores Socket.IO](/es/practical-guides/socketio/controllers)
- [Controladores gRPC](/es/practical-guides/grpc/controllers)
- [Controladores de Tareas programadas](/es/practical-guides/jobs/controllers)

## Registro

Los controladores se registran desde un módulo, un módulo es la unidad de cohesión de los dominios de tu aplicación, puedes registrar uno o varios controladores en un módulo:

```rust
impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

Internamente, todo controlador implementa `ControllerSpec`, que describe cómo montarlo en su transporte.
