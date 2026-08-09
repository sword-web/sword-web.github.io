---
title: "Compilando protos"
description: "Cómo configurar build.rs con tonic-prost-build para compilar contratos .proto y generar el descriptor de reflection en Sword."
outline: [2, 3]
---

# Compilando protos con `tonic-prost-build`

Los ficheros `.proto` no se leen en runtime: se compilan en tiempo de build y generan el código Rust del servicio, los tipos de mensaje y, opcionalmente, un descriptor para reflection.

## `build.rs`

Todo proyecto que usa controladores gRPC necesita un fichero `build.rs` que compile los `.proto` con `tonic_prost_build`. En Sword, además, se genera `sword_descriptor_set.bin` en `OUT_DIR` para habilitar reflection.

```rust
// build.rs
use std::{env, path::PathBuf};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = PathBuf::from(env::var("OUT_DIR")?);
    let descriptor_path = out_dir.join("sword_descriptor_set.bin");

    tonic_prost_build::configure()
        .file_descriptor_set_path(&descriptor_path)
        .compile_protos(&["config/proto/users.proto"], &["config/proto"])?;

    Ok(())
}
```

Desglose de la configuración:

- `.file_descriptor_set_path(...)`: escribe el descriptor en `OUT_DIR/sword_descriptor_set.bin`. Es lo que permite a Sword registrar reflection automáticamente.
- `.compile_protos(&["config/proto/users.proto"], &["config/proto"])`: compila el contrato y sus imports, usando `config/proto` como raíz de resolución.

::: tip Sword registra el descriptor automáticamente
No necesitas registrar reflection manualmente en tus módulos. Con solo generar `sword_descriptor_set.bin` en `OUT_DIR`, Sword lo detecta y lo expone.
:::

::: warning Sin `OUT_DIR` no hay reflection
Si omites `.file_descriptor_set_path(...)`, el código se compila igual, pero no habrá descriptor disponible, y `grpcurl` no podrá listar/describir servicios con reflection.
:::

## Dependencias

En tu `Cargo.toml` necesitas `tonic-prost-build` como dependencia de build, además de `prost` y `tonic-prost` en runtime:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc", "grpc-reflection"] }
tonic = "x.y.z"
prost = "x.y.z"
tonic-prost = "x.y.z"

[build-dependencies]
tonic-prost-build = "x.y.z"
```

::: info ¿Por qué también `prost` y `tonic-prost` en runtime?
El código generado por la compilación depende de `prost` (serialización) y `tonic-prost` (codec) en el proyecto final. `sword` no puede reexportarlos en tu lugar.
:::
