---
title: "Fundamentos y contratos gRPC"
description: "Conceptos de Tonic y Protocol Buffers, organización y naming de contratos .proto, y su compilación con tonic-prost-build en Sword."
outline: [2, 3]
---

# Fundamentos y contratos gRPC

Sword usa `tonic` como base para los controladores gRPC. En Sword, los archivos `.proto` definen el contrato público de tu servicio gRPC: no se leen en runtime, se compilan en tiempo de build y generan el código Rust del servicio, los tipos de mensaje y, opcionalmente, un descriptor para reflection.

## Protocol Buffers

Protocol Buffers es un mecanismo extensible y neutral respecto al lenguaje y la plataforma, desarrollado por Google, para serializar datos estructurados.

Defines cómo quieres estructurar tus datos una sola vez y, posteriormente, puedes utilizar código fuente generado automáticamente tras un proceso de compilación para escribir y leer fácilmente tus datos estructurados desde y hacia distintos flujos de datos, utilizando diversos lenguajes de programación.

## Tipos de RPC

Un servicio definido en `.proto` puede exponer varios tipos de RPC, según la forma de las solicitudes y respuestas:

- **Unary**: una solicitud → una respuesta. Es el tipo más común.
- **Server streaming**: el cliente envía una solicitud y el servidor responde con un stream de mensajes.
- **Client streaming**: el cliente envía un stream de solicitudes y el servidor responde con un único mensaje.
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

<ApiSection title="Recomendaciones y convenciones de naming">

Estas reglas buscan evitar ambigüedad con servicios internos de tu aplicación y mantener contratos claros para clientes externos.

#### Ubicación recomendada

Recomendamos guardar los `.proto` en `config/proto/` o bien en `shared/proto/` si se trata de un contrato compartido entre varios servicios.

Esto facilita:

- mantener una estructura predecible entre proyectos,
- reutilizar el mismo patrón en `build.rs`,
- separar contratos de transporte del resto del código de aplicación.

#### Servicios

Usa el sufijo `GrpcService` en servicios proto, porque en tu código de aplicación pueden coexistir servicios de negocio con nombres similares.

::: code-group

```proto [Recomendado]
service UserGrpcService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

```proto [No recomendado]
service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

:::

#### Métodos RPC

Nombra métodos por intención (`Get`, `List`, `Create`, `Update`, `Delete`, `Stream`) para que el contrato sea autoexplicativo para quien lo consume.

::: code-group

```proto [Recomendado]
rpc GetUser (GetUserRequest) returns (GetUserResponse);
rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
rpc StreamUsers (StreamUsersRequest) returns (stream User);
```

```proto [No recomendado]
rpc UserGet (GetUserRequest) returns (GetUserResponse);
rpc DoUserAction (ListUsersRequest) returns (ListUsersResponse);
```

:::

#### Mensajes

Evita prefijos/sufijos técnicos como `Grpc` en `message`. En contratos públicos, es mejor usar nombres neutrales y orientados al dominio.

::: code-group

```proto [Recomendado]
message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}
```

```proto [No recomendado]
message GetUserGrpcRequest {
  string id = 1;
}

message GetUserGrpcResponse {
  UserGrpcModel user = 1;
}
```

:::

</ApiSection>

## Dependencias de build

Para compilar los `.proto` necesitas `tonic-prost-build` como dependencia de build, y `prost` (serialización) y `tonic-prost` (codec) en las dependencias del proyecto.

### Dependencias mínimas

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc"] }
tonic = "x.y.z"
prost = "x.y.z"
prost-types = "x.y.z"
tonic-prost = "x.y.z"

[build-dependencies]
tonic-prost-build = "x.y.z"
```

::: tip ¿Por qué no basta con `sword` y su feature `grpc`?
Cuando los archivos `.proto` se compilan dependen directamente de `prost` y `tonic-prost` en el cliente final, es decir, con estos crates en el `Cargo.toml` del proyecto, no basta con que `sword` los reexporte.
:::

### Tipos avanzados con `prost-types`

Si tu contrato usa tipos well-known de protobuf (`google.protobuf.Timestamp`, `Duration`, `Any`, etc.), también necesitas el crate `prost-types` en el proyecto.

::: code-group

```proto [user.proto]
import "google/protobuf/timestamp.proto";

message UserItem {
  string id = 1;
  string username = 2;
  google.protobuf.Timestamp created_at = 3;
}
```

```rust [generated.rs]
pub struct User {
    pub id: String,
    pub username: String,
    pub created_at: prost_types::Timestamp,
}
```

:::

## Compilación de ficheros .proto en build.rs

Todo proyecto que usa controladores gRPC necesita un archivo `build.rs` que compile los `.proto` con `tonic_prost_build`.

::: code-group

```rust [build.rs]
use std::{env, path::pathbuf};

fn main() -> result<(), box<dyn std::error::error>> {
    tonic_prost_build::configure()
        .compile_protos(&["config/proto/users.proto"], &["config/proto"])?;

    ok(())
}
```

:::

## ¿Qué genera la compilación de un `.proto`?

Al compilar un archivo `.proto` con `tonic-prost-build`, se genera:

- Un trait del servicio definido (por ejemplo `UserGrpcService`),
- Un servidor para registrar el servicio (por ejemplo `UserGrpcServiceServer<T>`),
- Un cliente para invocar el servicio (por ejemplo `UserGrpcServiceClient<T>`),
- Tipos de solicitud/respuesta y enums definidos en el contrato.

## Reflection

Si se habilita la feature `grpc-reflection` debes generar el descriptor de reflection. Esto permite a Sword registrar automáticamente reflection y exponerlo a clientes como `grpcurl`.

::: code-group

```toml [Cargo.toml]
[dependencies]
sword = { version = "x.y.z", features = ["grpc", "grpc-reflection"] }
```

```rust [build.rs]
use std::{env, path::pathbuf};

fn main() -> result<(), box<dyn std::error::error>> {
    let out_dir = pathbuf::from(env::var("out_dir")?); // [!code ++]
    let descriptor_path = out_dir.join("sword_descriptor_set.bin"); // [!code ++]

    tonic_prost_build::configure()
        .file_descriptor_set_path(&descriptor_path) // [!code ++]
        .compile_protos(&["config/proto/users.proto"], &["config/proto"])?;

    ok(())
}
```

:::
