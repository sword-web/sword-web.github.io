---
title: "Fundamentos de tonic"
description: "Conceptos base de tonic necesarios para implementar controladores gRPC en Sword."
outline: [2, 3]
---
# Fundamentos de tonic

Sword usa `tonic` como base para gRPC. Esta guía resume lo necesario para entender qué implementas cuando creas controladores gRPC en Sword.

## ¿Qué genera tonic desde un `.proto`?

Al compilar tu `.proto`, tonic genera:

- un trait del servicio (por ejemplo `UserGrpcService`),
- un servidor para registrar el servicio (por ejemplo `UserGrpcServiceServer<T>`),
- tipos de request/response y enums definidos en el contrato.

## ¿Qué implementas en Sword?

En Sword implementas el trait generado por tonic dentro de un controlador anotado con `#[controller(kind = Controller::Grpc, ...)]`.

```rust
use sword::grpc::*;
use sword::prelude::*;

#[controller(kind = Controller::Grpc, service = UserGrpcServiceServer)]
pub struct UsersController;

#[sword::grpc::async_trait]
impl UserGrpcService for UsersController {
    async fn get_user(
        &self,
        _: Request<GetUserRequest>,
    ) -> GrpcResult<GetUserResponse> {
        Ok(Response::new(GetUserResponse { user: None }))
    }
}
```

## Tipos base en métodos gRPC

Para métodos unary, la forma general es:

- entrada: `Request<T>`
- salida: `GrpcResult<U>` (`Result<Response<U>, Status>`)

Esto permite:

- acceder a metadata de request,
- devolver respuestas tipadas,
- retornar errores gRPC con `Status`.

## Manejo de errores

La documentacion de `#[derive(GrpcError)]`, atributos soportados (`grpc_error`, `grpc`, `tracing`) y ejemplos de uso se encuentra en la guia dedicada:

- [Errores gRPC con GrpcError](/es/practical-guides/grpc/errores-grpc)

## Ver también

- [Ficheros .proto](/es/practical-guides/grpc/ficheros-proto)
- [Errores gRPC con GrpcError](/es/practical-guides/grpc/errores-grpc)
- [Inspección de servicios gRPC con grpcurl](/es/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
