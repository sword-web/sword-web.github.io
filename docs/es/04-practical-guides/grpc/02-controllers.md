---
title: "Controladores gRPC"
description: "Definición y registro de controladores gRPC en Sword."
outline: [2, 3]
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

El trait `UserGrpcService` se genera a partir de un archivo `.proto` como el siguiente:

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

<ApiSection title="Atributos del controlador" :collapsed="false">

#### Atributo `#[controller]`

```rust
#[controller(kind = Controller::Grpc, service = UserGrpcServiceServer)]
```

**Parámetros**

- `kind = Controller::Grpc`: marca la estructura como controlador gRPC.
- `service = UserGrpcServiceServer`: servidor generado por Tonic para el servicio que implementa.

#### Atributo `#[sword::grpc::async_trait]`

```rust
#[sword::grpc::async_trait]
impl UserGrpcService for UsersController { ... }
```

De la misma forma que lo establece `tonic`, este atributo es necesario para implementar el trait generado por `tonic`: permite que los métodos del trait puedan ser `async` y sean registrados correctamente en el servidor gRPC.

**Cuándo usarlo**

- En la implementación del trait generado por Tonic, para habilitar métodos `async` en traits.

</ApiSection>

<ApiSection title="Tipos base y respuestas" :collapsed="false">

#### Tipo `Request<T>`

```rust
pub use tonic::Request;
```

**Retorna**

- Envoltura de Tonic sobre la solicitud entrante, con acceso a `into_inner()` (el mensaje) y `metadata()`.

**Cuándo usarlo**

- Como tipo de entrada en los métodos del servicio (por ejemplo `Request<GetUserRequest>`).

#### Tipo `GrpcResult<T>`

```rust
pub type GrpcResult<T> = Result<Response<T>, Status>;
```

**Retorna**

- `Ok(Response<T>)` si la llamada se resuelve correctamente.
- `Err(Status)` si falla la llamada.

**Cuándo usarlo**

- Como tipo de retorno de los métodos del servicio.

#### Método `GrpcResponse::message()`

```rust
pub fn message<T>(value: T) -> tonic::Response<T>
```

**Retorna**

- Una `Response<T>` con un mensaje único.

**Cuándo usarlo**

- En métodos unary y client streaming para devolver una respuesta tipada.

</ApiSection>
