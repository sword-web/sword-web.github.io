---
title: "Introduction to Sword - Web Framework for Rust"
description: "Sword is a structured and opinionated web framework for Rust, built on top of the Tokio ecosystem. Learn about its modular architecture and features."

keywords:
    [
        "sword framework",
        "rust web framework",
        "grpc",
        "axum",
        "tokio",
        "rust web development",
        "modular framework",
    ]
---
# Introduction

Sword is a web framework that enables building server-side applications in a structured and opinionated way.

It is currently under active development, so some features may change or be removed frequently. This documentation may undergo modifications until a stable version is reached.

### Motivation

The core idea of Sword is to establish a development structure based on modules, similar to frameworks like Spring or NestJS. Additionally, Sword provides a suite of tools and utilities commonly required in these types of frameworks:

- Configuration and environment variable management via `toml`
- Standardized HTTP response formatting (JSON)
- Essential built-in middlewares (Interceptors)
- Dependency Injection (Automatic component construction)
- Simple and idiomatic error handling
- Support for REST and gRPC applications

### What do we mean by "structured/opinionated"?

Building scalable web applications requires organizing code into well-defined layers and maintaining a clear separation of concerns.

If you are here, you have likely used `axum`, a framework developed by the `tokio` team. Axum offers a comprehensive set of features for web development; however, as your project grows, the codebase can become complex to maintain. You might find yourself adding elements to extend or simplify Axum's own functionality, which can lead to a difficult-to-maintain codebase over time.

For this reason, Sword leverages libraries from the `tokio` ecosystem to build a more organized and modular development structure, aiming to facilitate the scalability and maintainability of your Rust web projects.
