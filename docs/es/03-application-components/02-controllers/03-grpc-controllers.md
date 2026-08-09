---
title: "Controladores gRPC"
description: "Definición y registro de controladores gRPC en Sword."
outline: [2, 3]

prev:
    text: Controladores Socket.IO
    link: /es/application-components/controllers/socket-io-controllers
next:
    text: Inyección de Dependencias
    link: /es/application-components/di/
---

# Controladores gRPC

En Sword, un controlador gRPC es una estructura que implementa un trait generada por `tonic` a partir de un archivo `.proto`. Este trait define los métodos gRPC que el controlador debe implementar.

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

El trait `UserGrpcService` se genera a partir de un fichero `.proto` como el siguiente:

```proto
syntax = "proto3";

package users;

service UserGrpcService {
  rpc ListUsers (ListUsersRequest) returns (ListUsersReply);
}

message ListUsersRequest {}

message ListUsersReply {
  repeated UserItem users = 1;
}

message UserItem {
  string id = 1;
  string username = 2;
}
```

## Ver también

- [Ficheros .proto](/es/practical-guides/grpc/ficheros-proto)
- [Fundamentos de tonic](/es/practical-guides/grpc/fundamentos-de-tonic)
- [API Reference gRPC](/es/practical-guides/grpc/api-reference-grpc)
- [Inspección de servicios gRPC con grpcurl](/es/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
