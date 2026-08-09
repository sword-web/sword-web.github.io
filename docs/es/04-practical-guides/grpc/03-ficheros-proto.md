---
title: "Ficheros .proto"
description: "Recomendaciones para organizar y nombrar contratos .proto en aplicaciones gRPC con Sword."
outline: [2, 3]
---

# Ficheros .proto

En Sword, los ficheros `.proto` definen el contrato público de tu servicio gRPC. Este contrato luego se convierte en código Rust mediante `tonic` y `tonic-prost-build` (ver [Compilando protos](/es/practical-guides/grpc/compilando-proto)).

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

### Métodos RPC

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

### Messages

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
