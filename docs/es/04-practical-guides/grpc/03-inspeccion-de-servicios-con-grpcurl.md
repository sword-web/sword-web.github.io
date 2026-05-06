---
title: "Inspección de servicios gRPC con grpcurl"
description: "Cómo habilitar reflection en Sword y usar grpcurl para inspeccionar y probar servicios gRPC."
outline: [2, 3]
---
# Inspección de servicios gRPC con grpcurl

Esta guía explica cómo inspeccionar y probar tus servicios gRPC con `grpcurl` en una aplicación Sword.

Para recomendaciones de diseño del contrato `.proto`, revisa [Ficheros .proto](/es/practical-guides/grpc/ficheros-proto).

## Requisitos mínimos

1. Tener `grpcurl` instalado.
2. Tener al menos un controlador gRPC registrado.
3. Activar reflection en configuración:

```toml
[grpc]
enable-tonic-reflection = true
```

## Generar descriptor en `build.rs`

Para que reflection exponga tus servicios y tipos, genera `sword_descriptor_set.bin` en `OUT_DIR`.

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

Sword registra este descriptor automáticamente. No necesitas registrar reflection manualmente en tus módulos.

## Comandos básicos con grpcurl

Asumiendo servidor en `127.0.0.1:50051`:

Listar servicios:

```bash
grpcurl -plaintext 127.0.0.1:50051 list
```

Describir un servicio:

```bash
grpcurl -plaintext 127.0.0.1:50051 describe users.UserService
```

Health check global:

```bash
grpcurl -plaintext -d '{"service":""}' 127.0.0.1:50051 grpc.health.v1.Health/Check
```

Ejecutar un método con metadata:

```bash
grpcurl -plaintext -H 'authorization: bearer test' -d '{}' 127.0.0.1:50051 users.UserService/ListUsers
```
