---
title: "Controladores"
description: "Un controlador es el punto de entrada a tu aplicación: recibe solicitudes o eventos y los convierte en llamadas a la lógica de negocio."
outline: [2, 3]
---

# Controladores

Un controlador es el punto de entrada a tu aplicación. Recibe eventos o solicitudes internas o externas y los transforma en llamadas a la lógica de negocio de tus módulos.

Según el mecanismo de comunicación, un controlador puede atender una solicitud HTTP, escuchar eventos en tiempo real, responder a llamadas remotas gRPC o procesar eventos internos y externos.

## Declaración

Un controlador es una estructura anotada con la macro `#[controller]`, que indica el tipo de controlador y sus datos de enrutamiento. Los métodos de la estructura son los puntos de entrada, y cada uno se marca con el atributo que corresponde a su transporte:

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        Ok(JsonResponse::Ok().message("Users list"))
    }
}
```

El atributo `kind` selecciona el tipo de controlador (`Web`, `SocketIo`, `Grpc`, ...). Los datos que lo acompañan dependen de ese tipo: `path` para los controladores web, `namespace` para Socket.IO y `service` para gRPC.

## Registro

Los controladores se registran desde un módulo con `register_controllers`. Cada módulo declara los suyos y `Application::builder().with_module::<...>()` se encarga del resto.

```rust
impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

Internamente, todo controlador implementa `ControllerSpec`, que describe cómo montarlo en su transporte.

## Tipos de controlador

Cada transporte documenta la definición y las particularidades de sus controladores en la guía práctica que le corresponde:

- [Controladores web](/es/practical-guides/web/controllers)
- [Controladores Socket.IO](/es/practical-guides/socketio/controllers)
- [Controladores gRPC](/es/practical-guides/grpc/controllers)

Los controladores de eventos internos y externos forman parte del manejo de eventos de la aplicación.
