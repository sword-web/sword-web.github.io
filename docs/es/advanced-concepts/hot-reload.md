# Watch Mode y Hot Reload

El `Hot Reload` es una herramienta de desarrollo comunmente vista en entornos `Node.js` u otros lenguajes, en Rust existe dos opciones:

## Cargo Watch

A lo largo del tiempo, `cargo-watch` ha sido la herramienta más popular para observar cambios en el código fuente y recompilar automáticamente el proyecto. Puedes instalarlo usando `cargo`:

```bash
cargo install cargo-watch
```

Sin embargo, `cargo-watch` solo recompila y reinicia la aplicación, no proporciona una experiencia de recarga en caliente completa.

## Hot Reload con `subsecond` y `dioxus-cli`

El equipo de `Dioxus` ha desarrollado un crate llamado `subsecond`, que permite una experiencia de recarga en caliente más fluida compatible con `axum` y otros crates.

Para utilizar `subsecond` en tu proyecto Sword, sigue estos pasos:

1. Activar el feature flag `hot-reload` en tu `Cargo.toml`:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["hot-reload"] }
```

2. Instalar `dioxus-cli` para ejecutar el servidor con recarga en caliente:

```bash
cargo install dioxus-cli
```

3. Ejecutar tu aplicación Sword con `dioxus-cli`:

```bash
dx serve # equivalente a `cargo run`
```
