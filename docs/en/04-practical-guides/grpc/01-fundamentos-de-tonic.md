---
title: "Tonic Fundamentals"
description: "Core tonic concepts you need to implement gRPC controllers in Sword."
outline: [2, 3]
---
# Tonic Fundamentals

Sword uses `tonic` as its gRPC foundation. This guide covers the essentials you need to understand what you're implementing when building gRPC controllers in Sword.

## What does tonic generate from a `.proto` file?

When you compile your `.proto`, tonic generates:

- a service trait (for example `UserGrpcService`),
- a server wrapper used to register the service (for example `UserGrpcServiceServer<T>`),
- request/response types and enums defined in the contract.

## What do you implement in Sword?

In Sword, you implement the tonic-generated trait inside a controller annotated with `#[controller(kind = Controller::Grpc, ...)]`.

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

## Core types in gRPC methods

For unary methods, the common shape is:

- input: `Request<T>`
- output: `GrpcResult<U>` (`Result<Response<U>, Status>`)

This gives you:

- access to request metadata,
- typed responses,
- structured gRPC errors through `Status`.

## Error handling

Documentation for `#[derive(GrpcError)]`, supported attributes (`grpc_error`, `grpc`, `tracing`), and usage examples is available in the dedicated guide:

- [gRPC Errors with GrpcError](/en/practical-guides/grpc/errores-grpc)

## See also

- [.proto files](/en/practical-guides/grpc/ficheros-proto)
- [gRPC Errors with GrpcError](/en/practical-guides/grpc/errores-grpc)
- [Service inspection with grpcurl](/en/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
