---
title: "Fundamentos de tonic"
description: "Conceptos base de tonic: qué genera un .proto, tipos de RPC y dependencias de build para implementar controladores gRPC en Sword."
outline: [2, 3]
---

# Fundamentos de tonic

Sword usa `tonic` como base para los controladores gRPC. Esta guía cubre los conceptos de `tonic` que necesitas entender antes de escribir código con Sword: qué produce la compilación de un `.proto`, qué tipos de RPC existen y qué dependencias requiere el build.

## ¿Qué genera la compilación de un `.proto`?

Al compilar un fichero `.proto` con `tonic-prost-build`, se genera:

- Un trait del servicio definido (por ejemplo `UserGrpcService`),
- Un servidor para registrar el servicio (por ejemplo `UserGrpcServiceServer<T>`),
- Un cliente para invocar el servicio (por ejemplo `UserGrpcServiceClient<T>`),
- Tipos de solicitud/respuesta y enums definidos en el contrato.

La compilación se configura en `build.rs`; ver [Compilando protos](/es/practical-guides/grpc/compilando-proto).

## Tipos de RPC

Un servicio definido en `.proto` puede exponer varios tipos de RPC, según la forma de las peticiones y respuestas:

- **Unary**: una petición → una respuesta. Es el tipo más común.
- **Server streaming**: el cliente envía una petición y el servidor responde con un stream de mensajes.
- **Client streaming**: el cliente envía un stream de peticiones y el servidor responde con un único mensaje.
- **Bidirectional streaming**: ambos lados envían y reciben streams de forma concurrente.

En el contrato se declaran así:

```proto
syntax = "proto3";

package users;

service UserGrpcService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);          // unary
  rpc StreamUsers (StreamUsersRequest) returns (stream UserItem);  // server streaming
  rpc UploadUsers (stream UserItem) returns (UploadReply);          // client streaming
  rpc Chat (stream ChatMessage) returns (stream ChatReply);         // bidi streaming
}
```

## Dependencias de build

Para compilar los `.proto` necesitas `tonic-prost-build` como dependencia de build, y en runtime `prost` (serialización) y `tonic-prost` (codec).

::: details Dependencias mínimas

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc", "grpc-reflection"] }
tonic = "x.y.z"
prost = "x.y.z"
prost-types = "x.y.z"
tonic-prost = "x.y.z"

[build-dependencies]
tonic-prost-build = "x.y.z"
```

:::

::: tip ¿Por qué no basta con `sword` y su feature `grpc`?
Cuando los ficheros `.proto` se compilan dependen directamente de `prost` y `tonic-prost` en el cliente final, es decir, con estos crates en el `Cargo.toml` del proyecto, no basta con que `sword` los reexporte.
:::

::: info Tipos avanzados con `prost-types`
Si tu contrato usa tipos well-known de protobuf (`google.protobuf.Timestamp`, `Duration`, `Any`, etc.), también necesitas el crate `prost-types` en el proyecto. Estos tipos se compilan a sus equivalentes de `prost-types` en Rust.

```proto
import "google/protobuf/timestamp.proto";

message UserItem {
  string id = 1;
  string username = 2;
  google.protobuf.Timestamp created_at = 3;
}
```

```rust
pub struct User {
    pub id: String,
    pub username: String,
    pub created_at: prost_types::Timestamp,
}
```

:::

::: info Feature `grpc-reflection`
Si además quieres exponer reflection (necesario para inspeccionar y probar servicios con `grpcurl`), incluye la feature `grpc-reflection`. Sin ella, el descriptor generado en `build.rs` no se registra.
:::

## Siguiente paso

Con los conceptos de tonic claros, el siguiente paso es conocer cómo Sword define e implementa los controladores gRPC:

- [API Reference gRPC](/es/practical-guides/grpc/api-reference-grpc)
