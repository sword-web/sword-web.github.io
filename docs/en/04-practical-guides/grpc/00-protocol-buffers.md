---
title: "gRPC Fundamentals & Contracts"
description: "Tonic and Protocol Buffers concepts, how to organize and name .proto contracts, and how to compile them with tonic-prost-build in Sword."
outline: [2, 3]
---

# gRPC Fundamentals & Contracts

Sword uses `tonic` as the foundation for gRPC controllers. In Sword, `.proto` files define the public contract of your gRPC service: they are not read at runtime, they are compiled at build time, and they generate the Rust code for the service, the message types and, optionally, a descriptor for reflection.

## Protocol Buffers

Protocol Buffers is an extensible, language- and platform-neutral mechanism, developed by Google, for serializing structured data.

You define how you want your data structured once, and afterwards you can use automatically generated source code, produced by a compilation process, to easily write and read your structured data across different data streams, using different programming languages.

## RPC types

A service defined in `.proto` can expose several RPC types, depending on the shape of requests and responses:

- **Unary**: one request → one response. It is the most common type.
- **Server streaming**: the client sends one request and the server responds with a stream of messages.
- **Client streaming**: the client sends a stream of requests and the server responds with a single message.
- **Bidirectional streaming**: both sides send and receive streams concurrently.

In the contract they are declared like this:

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

<ApiSection title="Recommendations and Naming Conventions">

These rules aim to avoid ambiguity with your application's internal services and keep clear contracts for external clients.

#### Recommended location

We recommend keeping the `.proto` files in `config/proto/`, or in `shared/proto/` if it is a contract shared across several services.

This helps you:

- maintain a predictable structure across projects,
- reuse the same pattern in `build.rs`,
- separate transport contracts from the rest of the application code.

#### Services

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

#### RPC methods

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

#### Messages

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

</ApiSection>

## Build dependencies

To compile the `.proto` files you need `tonic-prost-build` as a build dependency, plus `prost` (serialization) and `tonic-prost` (codec) as project dependencies.

### Minimum dependencies

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

::: tip Why is `sword` with its `grpc` feature not enough?
When `.proto` files are compiled, they depend directly on `prost` and `tonic-prost` in the final client, meaning these crates need to be in the project's `Cargo.toml`; it is not enough for `sword` to re-export them.
:::

### Advanced types with `prost-types`

If your contract uses protobuf well-known types (`google.protobuf.Timestamp`, `Duration`, `Any`, etc.), you also need the `prost-types` crate in the project.

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

## Compiling `.proto` files in `build.rs`

Any project using gRPC controllers needs a `build.rs` file that compiles the `.proto` files with `tonic_prost_build`.

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

## What does compiling a `.proto` generate?

When you compile a `.proto` file with `tonic-prost-build`, it generates:

- A trait for the defined service (for example `UserGrpcService`),
- A server to register the service (for example `UserGrpcServiceServer<T>`),
- A client to invoke the service (for example `UserGrpcServiceClient<T>`),
- Request/response types and enums defined in the contract.

## Reflection

If you enable the `grpc-reflection` feature, you must generate the reflection descriptor. This lets Sword register reflection automatically and expose it to clients such as `grpcurl`.

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
