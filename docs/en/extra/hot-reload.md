---
title: Watch Mode and Hot Reload - Sword Framework
description: Enable watch mode and hot reload in Sword for faster development. Learn to automatically restart your server when code changes are detected.
keywords: ["hot reload", "watch mode", "development", "auto restart", "sword framework", "development workflow"]
---

# Watch Mode and Hot Reload

Hot reload is a development tool commonly seen in Node.js environments and other languages. In Rust, there are two options:

## Cargo Watch

Over time, `cargo-watch` has been the most popular tool for watching changes in source code and automatically recompiling the project. You can install it using `cargo`:

```bash
cargo install cargo-watch
```

However, `cargo-watch` only recompiles and restarts the application; it doesn't provide a complete hot reload experience.

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
