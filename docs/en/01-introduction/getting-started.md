---
title: "Getting Started with Sword"
description: "Examples available in the repository to start using Sword."
outline: [2, 3]

next:
    text: Project structure
    link: /en/introduction/file-structure
---
# Getting Started with Sword

::: info CLI Status
The `sword-cli` command line tool is currently in development. For now, the recommended way to start with Sword is to review and run the examples in the repository on GitHub.
:::

## Examples

You can find the examples in the repository on [GitHub](https://github.com/sword-web/sword/tree/main/examples).

Each example is designed to showcase a specific part of the framework. If this is your first time using Sword, we recommend starting with `web`.

### `web` Example

This is the most straightforward example for understanding the base flow of a REST application based on `axum` with Sword.

### `socketio` Example

This example focuses on Socket.IO integration with Sword, built on top of the `socketioxide` crate.

### `interceptors` Example

This example focuses on interceptors applied to web and Socket.IO controllers.

### `grpc` Example

This example focuses on gRPC integration with Sword, built on top of the `tonic` crate.
