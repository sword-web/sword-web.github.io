---
title: "Service Inspection with grpcurl"
description: "How to enable reflection in Sword and use grpcurl to inspect and test gRPC services."
outline: [2, 3]
---
# Service Inspection with grpcurl

This guide explains how to inspect and test your gRPC services using `grpcurl` in a Sword application.

For design recommendations on `.proto` contracts, see [.proto Files](/en/practical-guides/grpc/ficheros-proto).

## Minimum Requirements

1. Have `grpcurl` installed.
2. Have at least one gRPC controller registered.
3. Enable reflection in your configuration:

```toml
[grpc]
enable-tonic-reflection = true
```

## Generating a Descriptor in `build.rs`

To allow reflection to expose your services and types, generate `sword_descriptor_set.bin` in the `OUT_DIR`.

```rust
use std::{env, path::PathBuf};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = PathBuf::from(env::var("OUT_DIR")?);
    let descriptor_set_path = out_dir.join("sword_descriptor_set.bin");

    tonic_prost_build::configure()
        .file_descriptor_set_path(&descriptor_set_path)
        .compile_protos(&["config/proto/users.proto"], &["config/proto"])?;

    Ok(())
}
```

Sword registers this descriptor automatically. You do not need to register reflection manually in your modules.

## Basic `grpcurl` Commands

Assuming the server is running at `127.0.0.1:50051`:

List services:

```bash
grpcurl -plaintext 127.0.0.1:50051 list
```

Describe a service:

```bash
grpcurl -plaintext 127.0.0.1:50051 describe users.UserService
```

Global health check:

```bash
grpcurl -plaintext -d '{"service":""}' 127.0.0.1:50051 grpc.health.v1.Health/Check
```

Execute a method with metadata:

```bash
grpcurl -plaintext -H 'authorization: bearer test' -d '{}' 127.0.0.1:50051 users.UserService/ListUsers
```
