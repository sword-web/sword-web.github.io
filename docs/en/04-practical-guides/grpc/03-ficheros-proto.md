---
title: ".proto Files"
description: "Recommendations for organizing and naming .proto contracts in gRPC applications with Sword."
outline: [2, 3]
---

# .proto Files

In Sword, `.proto` files define the public contract of your gRPC service. This contract is later converted into Rust code with `tonic` and `tonic-prost-build` (see [Compiling Protos](/en/practical-guides/grpc/compilando-proto)).

## Recommended location

We recommend keeping the `.proto` files under `config/proto/`.

This helps you:

- maintain a predictable structure across projects,
- reuse the same pattern in `build.rs`,
- separate transport contracts from the rest of the application code.

Example:

```text
config/
  proto/
    users.proto
```

## Naming conventions

These rules aim to avoid ambiguity with your application's internal services and keep clear contracts for external clients.

### Services

Use the `GrpcService` suffix in proto services, because business services with similar names can coexist in your application code.

::: code-group

```proto [Recommended]
service UserGrpcService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

```proto [Not recommended]
service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

:::

### RPC methods

Name methods by intent (`Get`, `List`, `Create`, `Update`, `Delete`, `Stream`) so the contract is self-explanatory for whoever consumes it.

::: code-group

```proto [Recommended]
rpc GetUser (GetUserRequest) returns (GetUserResponse);
rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
rpc StreamUsers (StreamUsersRequest) returns (stream User);
```

```proto [Not recommended]
rpc UserGet (GetUserRequest) returns (GetUserResponse);
rpc DoUserAction (ListUsersRequest) returns (ListUsersResponse);
```

:::

### Messages

Avoid technical prefixes/suffixes such as `Grpc` in `message`. In public contracts, it is better to use neutral, domain-oriented names.

::: code-group

```proto [Recommended]
message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}
```

```proto [Not recommended]
message GetUserGrpcRequest {
  string id = 1;
}

message GetUserGrpcResponse {
  UserGrpcModel user = 1;
}
```

:::
