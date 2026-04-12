---
title: Errores gRPC con GrpcError
description: Guia dedicada para modelar errores gRPC con #[derive(GrpcError)] en Sword.
outline: [2, 3]
---

# Errores gRPC con `GrpcError`

Para modelar errores de dominio y convertirlos a `tonic::Status`, Sword proporciona `#[derive(GrpcError)]`.

Esta macro genera:

- `From<Self> for tonic::Status`

Con eso puedes retornar errores propios de tu aplicacion y propagarlos con `?` en metodos gRPC.

## Atributos soportados

Segun el rustdoc de la macro:

- `#[grpc_error(...)]`: defaults a nivel enum.
- `#[grpc(...)]`: override por variante.

Claves disponibles:

- `code = "<grpc_code>"`
- `message = "texto"`
- `message = nombre_de_campo`
- `transparent` (solo variante)
- `tracing = <level>` en `grpc_error/grpc`
- `#[tracing(level)]` como shorthand compatible hacia atras

Niveles validos para tracing: `trace`, `debug`, `info`, `warn`, `error`.

## Codigos gRPC validos

Los valores aceptados por `code` son:

- `ok`
- `cancelled`
- `unknown`
- `invalid_argument`
- `deadline_exceeded`
- `not_found`
- `already_exists`
- `permission_denied`
- `resource_exhausted`
- `failed_precondition`
- `aborted`
- `out_of_range`
- `unimplemented`
- `internal`
- `unavailable`
- `data_loss`
- `unauthenticated`

## Ejemplo completo

```rust
use sword::grpc::*;
use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal", tracing = error)]
enum MyGrpcError {
    #[error("Invalid input")]
    #[grpc(code = "invalid_argument", message = "Invalid input")]
    InvalidInput,

    #[error("Not found: {message}")]
    #[grpc(code = "not_found", message = message)]
    NotFound { message: String },

    #[error("Validation failed: {detail}")]
    #[grpc(code = "invalid_argument", message = client_message)]
    Validation {
        client_message: String,
        detail: String,
    },

    #[error("Auth error: {0}")]
    #[grpc(transparent)]
    Auth(#[from] AuthError),

    #[error("Service unavailable")]
    #[grpc(code = "unavailable", tracing = warn)]
    Unavailable,
}

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "unauthenticated", tracing = warn)]
enum AuthError {
    #[error("Invalid token")]
    #[grpc(code = "unauthenticated", message = "Invalid token")]
    InvalidToken,
}
```

## Nota sobre `transparent`

`#[grpc(transparent)]` delega la conversion a `tonic::Status` en el error interno.

Es util cuando tu variante envuelve otro tipo que ya implementa el flujo de conversion esperado.

## Ver tambien

- [Fundamentos de tonic](/es/practical-guides/grpc/fundamentos-de-tonic)
- [Ficheros .proto](/es/practical-guides/grpc/ficheros-proto)
- [Inspección de servicios gRPC con grpcurl](/es/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
