---
title: .proto Files
description: Recommendations for organizing and naming .proto contracts in gRPC applications with Sword.
outline: [2, 3]
---

# .proto Files

In Sword, `.proto` files define the public contract of your gRPC service. This contract is then converted into Rust code using `tonic` and `tonic-prost-build`.

## Recommended Location

We recommend storing your `.proto` files under `config/proto/`.

This promotes:

- A predictable structure across different projects.
- Reusing the same pattern in `build.rs`.
- Separating transport contracts from the rest of the application code.

Example:

```text
config/
  proto/
    users.proto
```

## Naming Conventions

These rules aim to avoid ambiguity with internal application services and maintain clear contracts for external clients.

### Services

Use the `GrpcService` suffix for proto services, as your application code may have business services with similar names.

Recommended:

```proto
service UserGrpcService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

Not recommended:

```proto
service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
}
```

### RPC Methods

Name methods based on their intent (`Get`, `List`, `Create`, `Update`, `Delete`, `Stream`) so the contract is self-explanatory for consumers.

Recommended:

```proto
rpc GetUser (GetUserRequest) returns (GetUserResponse);
rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
rpc StreamUsers (StreamUsersRequest) returns (stream User);
```

Not recommended:

```proto
rpc UserGet (GetUserRequest) returns (GetUserResponse);
rpc DoUserAction (ListUsersRequest) returns (ListUsersResponse);
```

### Messages

Avoid technical prefixes or suffixes like `Grpc` in your `message` types. In public contracts, it's better to use neutral, domain-oriented names.

Recommended:

```proto
message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}
```

Not recommended:

```proto
message GetUserGrpcRequest {
  string id = 1;
}

message GetUserGrpcResponse {
  UserGrpcModel user = 1;
}
```

## `build.rs` File

In your `build.rs`, make sure to configure `tonic-prost-build` to compile your `.proto` files from the location you've chosen. For example:

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_prost_build::configure()
        .compile_protos(&["config/proto/users.proto"], &["config/proto"])?;

    Ok(())
}
```

## See Also

- [Tonic Fundamentals](/en/practical-guides/grpc/fundamentos-de-tonic)
- [Service Inspection with grpcurl](/en/practical-guides/grpc/inspeccion-de-servicios-con-grpcurl)
