---
title: "Getting Started with Sword"
description: "Examples in the repository to help you start using Sword."
outline: [2, 3]
---

# Getting Started with Sword

The simplest way to get started with Sword is to review the examples in the GitHub repository. Each example covers a specific part of the framework and shows how it works.

The `sword-cli` command line tool is still in development, so it is not recommended for starting a project right now.

## Examples

You can find the examples in the repository on [GitHub](https://github.com/sword-web/sword/tree/main/examples).

### Web Application Example

This is the most direct example for understanding the base flow of a REST API built with Sword on top of `axum`.

[View on GitHub](https://github.com/sword-web/sword/tree/main/examples/web)

### Socket.IO Application Example

This example focuses on Socket.IO integration with Sword, using the `socketioxide` crate.

[View on GitHub](https://github.com/sword-web/sword/tree/main/examples/socketio)

### gRPC Application Example

This example focuses on gRPC integration with Sword, using the `tonic` crate.

[View on GitHub](https://github.com/sword-web/sword/tree/main/examples/grpc)

### NATS Events Application Example

This example focuses on integration with the NATS event broker, using the `async_nats` crate.

[View on GitHub](https://github.com/sword-web/sword/tree/main/examples/events)
