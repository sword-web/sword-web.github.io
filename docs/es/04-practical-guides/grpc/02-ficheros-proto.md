---
title: Ficheros .proto
description: Recomendaciones para organizar y nombrar contratos .proto en aplicaciones gRPC con Sword.
outline: [2, 3]
---

# Ficheros .proto

En Sword, los ficheros `.proto` definen el contrato público de tu servicio gRPC. Este contrato luego se convierte en código Rust mediante `tonic` y `tonic-prost-build`.

## Ubicación recomendada

Recomendamos guardar los `.proto` bajo `config/proto/`.

Esto facilita:

- mantener una estructura predecible entre proyectos,
- reutilizar el mismo patrón en `build.rs`,
- separar contratos de transporte del resto del código de aplicación.

Ejemplo:

```text
config/
  proto/
    users.proto
```

## Convenciones de naming

Estas reglas buscan evitar ambigüedad con servicios internos de tu aplicación y mantener contratos claros para clientes externos.

### Services

Usa el sufijo `GrpcService` en servicios proto, porque en tu código de aplicación pueden coexistir servicios de negocio con nombres similares.

Recomendado:

```proto
service UserGrpcService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

No recomendado:

```proto
service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

### Métodos RPC

Nombra métodos por intención (`Get`, `List`, `Create`, `Update`, `Delete`, `Stream`) para que el contrato sea autoexplicativo para quien lo consume.

Recomendado:

```proto
rpc GetUser (GetUserRequest) returns (GetUserResponse);
rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
rpc StreamUsers (StreamUsersRequest) returns (stream User);
```

No recomendado:

```proto
rpc UserGet (GetUserRequest) returns (GetUserResponse);
rpc DoUserAction (ListUsersRequest) returns (ListUsersResponse);
```

### Messages

Evita prefijos/sufijos técnicos como `Grpc` en `message`. En contratos públicos, es mejor usar nombres neutrales y orientados al dominio.

Recomendado:

```proto
message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}
```

No recomendado:

```proto
message GetUserGrpcRequest {
  string id = 1;
}

message GetUserGrpcResponse {
  UserGrpcModel user = 1;
}
```

## Fichero `build.rs`

En tu `build.rs`, asegúrate de configurar `tonic-prost-build` para compilar tus `.proto` desde la ubicación que has elegido. Por ejemplo:

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_prost_build::configure()
        .compile_protos(&["config/proto/users.proto"], &["config/proto"])?;

    Ok(())
}
```

## Ver también

- [Fundamentos de tonic](/es/practical-guides/grpc/fundamentos-de-tonic)
- [Inspección de servicios gRPC con grpcurl](/es/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
