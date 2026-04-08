---
title: Controladores gRPC
description: Definición y registro de controladores gRPC en Sword.
outline: [2, 3]
prev:
    text: Controladores Socket.IO
    link: /es/application-components/controllers/socket-io-controllers
next:
    text: Inyección de Dependencias
    link: /es/application-components/di/
---

# Controladores gRPC

En Sword, un controlador gRPC es un `struct` anotado con `#[controller(kind = Controller::Grpc, ...)]` que implementa el trait generado por `tonic`.

## Definir un controlador

```rust
use sword::grpc::*;
use sword::prelude::*;

#[controller(kind = Controller::Grpc, service = UserGrpcServiceServer)]
pub struct UsersController;

#[sword::grpc::async_trait]
impl UserGrpcService for UsersController {
    async fn list_users(
        &self,
        req: Request<ListUsersRequest>,
    ) -> GrpcResult<ListUsersReply> {
        tracing::info!("ListUsers grpc method called");

        Ok(Response::new(ListUsersReply { users: vec![] }))
    }
}
```

El trait (`UserGrpcService`) es generado por `tonic` a partir de un archivo `.proto` y debe ser importado para implementar el controlador.

## Registrar en un módulo

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

## Ver también

- [Ficheros .proto](/es/practical-guides/grpc/ficheros-proto)
- [Fundamentos de tonic](/es/practical-guides/grpc/fundamentos-de-tonic)
- [Inspección de servicios gRPC con grpcurl](/es/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
