---
title: "Modo Watch y Hot Reload - Framework Sword"
description: "Aprende a usar watch y hot reload en Sword durante el desarrollo."
outline: [2, 3]

keywords: ["hot reload", "watch", "sword", "desarrollo", "dioxus", "subsecond"]
---
# Modo Watch y Hot Reload

Durante el desarrollo, puedes utilizar distintas herramientas para recompilar o refrescar tu aplicación automáticamente cuando detectan cambios en el código.

## Crate `cargo-watch`

El crate `cargo-watch` ha sido durante mucho tiempo una de las herramientas más conocidas para observar cambios en el código fuente y recompilar automáticamente el proyecto.

Puedes instalarlo con:

```bash
cargo install cargo-watch
```

Sin embargo, `cargo-watch` se limita a recompilar y reiniciar la aplicación. No ofrece por sí solo una experiencia de hot reload completa.

## Hot reload con `subsecond` y `dioxus-cli`

El equipo de Dioxus mantiene herramientas como `subsecond`, que permiten una experiencia de hot reload más fluida y compatible con Axum y otros crates del ecosistema.

Para utilizar este flujo en un proyecto Sword:

1. Habilita la feature `hot-reload` en tu `Cargo.toml`

```toml
[dependencies]
sword = { version = "x.y.z", features = ["hot-reload"] }
```

2. Instala `dioxus-cli`

```bash
cargo install dioxus-cli
```

3. Ejecuta tu aplicación con `dx serve`

```bash
dx serve
```

Ese comando cumple un rol similar a `cargo run`, pero dentro del flujo de desarrollo orientado a hot reload.

## ¿Cuándo usar cada opción?

- Usa `cargo-watch` si solo necesitas recompilación y reinicio automático.
- Usa `subsecond` + `dioxus-cli` si quieres una experiencia de desarrollo más cercana al hot reload.
