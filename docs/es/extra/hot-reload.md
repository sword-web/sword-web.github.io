---
title: Modo Watch y Hot Reload - Framework Sword
description: Habilita el modo watch y hot reload en Sword para un desarrollo más rápido. Aprende a reiniciar automáticamente tu servidor cuando se detectan cambios en el código.
keywords:
  [
    "hot reload",
    "modo watch",
    "desarrollo",
    "reinicio automático",
    "framework sword",
    "flujo de desarrollo",
  ]
---

# Modo Watch y Hot Reload

Hot reload es una herramienta de desarrollo comúnmente vista en entornos de Node.js y otros lenguajes. En Rust, hay dos opciones:

## Cargo Watch

Con el tiempo, `cargo-watch` ha sido la herramienta más popular para observar cambios en el código fuente y recompilar automáticamente el proyecto. Puedes instalarlo usando `cargo`:

```bash
cargo install cargo-watch
```

Sin embargo, `cargo-watch` solo recompila y reinicia la aplicación; no proporciona una experiencia completa de hot reload.

## Hot Reload with `subsecond` and `dioxus-cli`

The `Dioxus` team has developed a crate called `subsecond`, which enables a smoother hot reload experience compatible with `axum` and other crates.

To use `subsecond` in your Sword project, follow these steps:

1. Enable the `hot-reload` feature flag in your `Cargo.toml`:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["hot-reload"] }
```

2. Install `dioxus-cli` to run the server with hot reload:

```bash
cargo install dioxus-cli
```

3. Run your Sword application with `dioxus-cli`:

```bash
dx serve # equivalent to `cargo run`
```
