---
title: "Tonic Fundamentals"
description: "Core tonic concepts: what a .proto generates, RPC types, and build dependencies for gRPC controllers in Sword."
outline: [2, 3]
---

# Tonic Fundamentals

Sword uses `tonic` as its gRPC foundation. This guide covers the `tonic` concepts you need to understand before writing code with Sword: what compiling a `.proto` produces, what RPC types exist, and what build dependencies are required.

## What does compiling a `.proto` generate?

When you compile a `.proto` file with `tonic-prost-build`, it generates:

- A trait for the defined service (for example `UserGrpcService`),
- A server to register the service (for example `UserGrpcServiceServer<T>`),
- A client to invoke the service (for example `UserGrpcServiceClient<T>`),
- Request/response types and enums defined in the contract.

The compilation is configured in `build.rs`; see [Compiling Protos](/en/practical-guides/grpc/compilando-proto).

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

## Build dependencies

To compile the `.proto` files you need `tonic-prost-build` as a build dependency, and at runtime `prost` (serialization) and `tonic-prost` (codec).

::: details Minimum dependencies

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

::: tip Why is `sword` with its `grpc` feature not enough?
When `.proto` files are compiled, they depend directly on `prost` and `tonic-prost` in the final client, meaning these crates need to be in the project's `Cargo.toml`; it is not enough for `sword` to re-export them.
:::

::: info Advanced types with `prost-types`
If your contract uses protobuf well-known types (`google.protobuf.Timestamp`, `Duration`, `Any`, etc.), you also need the `prost-types` crate in the project. These types compile to their `prost-types` equivalents in Rust.

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

::: info `grpc-reflection` feature
If you also want to expose reflection (needed to inspect and test services with `grpcurl`), include the `grpc-reflection` feature. Without it, the descriptor generated in `build.rs` is not registered.
:::

## Next step

With the tonic concepts clear, the next step is learning how Sword defines and implements gRPC controllers:

- [gRPC API Reference](/en/practical-guides/grpc/api-reference-grpc)
