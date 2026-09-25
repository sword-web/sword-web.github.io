---
title: "Service Inspection with grpcurl"
description: "How to enable reflection in Sword and use grpcurl to inspect and test gRPC services."
outline: [2, 3]
---

# Service Inspection with grpcurl

This guide explains how to inspect and test your gRPC services with `grpcurl` in a Sword application.

For `.proto` contract design recommendations, see [gRPC Fundamentals & Contracts](/en/practical-guides/grpc/protocol-buffers).

## Minimum requirements

1. Have `grpcurl` installed.
2. Have at least one registered gRPC controller.
3. Enable reflection in the configuration:

```toml
[grpc]
enable-tonic-reflection = true
```

::: tip Reflection is registered from `build.rs`
For reflection to expose your services and types, your `build.rs` must generate `sword_descriptor_set.bin` in `OUT_DIR`. See [gRPC Fundamentals & Contracts](/en/practical-guides/grpc/protocol-buffers).
:::

## Basic `grpcurl` commands

Assuming a server at `127.0.0.1:50051`:

### List services

```bash
grpcurl -plaintext 127.0.0.1:50051 list
```

### Describe a service

```bash
grpcurl -plaintext 127.0.0.1:50051 describe users.UserService
```

### Global health check

```bash
grpcurl -plaintext -d '{"service":""}' 127.0.0.1:50051 grpc.health.v1.Health/Check
```

### Run a method with metadata

```bash
grpcurl -plaintext -H 'authorization: bearer test' -d '{}' 127.0.0.1:50051 users.UserService/ListUsers
```
