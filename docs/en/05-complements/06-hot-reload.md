---
title: "Watch Mode and Hot Reload - Sword Framework"
description: "Learn how to use watch mode and hot reload in Sword during development."
outline: [2, 3]

keywords: ["hot reload", "watch", "sword", "development", "dioxus", "subsecond"]
---
# Watch Mode and Hot Reload

During development, you can use various tools to automatically recompile or refresh your application whenever code changes are detected.

## `cargo-watch` Crate

The `cargo-watch` crate has long been one of the most popular tools for watching source code changes and automatically recompiling the project.

You can install it with:

```bash
cargo install cargo-watch
```

However, `cargo-watch` is limited to recompiling and restarting the application. It does not provide a full hot reload experience on its own.

## Hot Reload with `subsecond` and `dioxus-cli`

The Dioxus team maintains tools like `subsecond`, which enable a smoother hot reload experience compatible with Axum and other crates in the ecosystem.

To use this workflow in a Sword project:

1. Enable the `hot-reload` feature in your `Cargo.toml`:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["hot-reload"] }
```

2. Install `dioxus-cli`:

```bash
cargo install dioxus-cli
```

3. Run your application with `dx serve`:

```bash
dx serve
```

This command serves a similar role to `cargo run` but within a hot-reload-oriented development flow.

## When to use each option?

- Use `cargo-watch` if you only need automatic recompilation and restarts.
- Use `subsecond` + `dioxus-cli` if you want a development experience closer to true hot reload.
