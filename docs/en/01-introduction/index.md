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

Sword is a structured and opinionated framework for building server-side applications.

It is currently under active development, so some features may change or be removed frequently. This documentation may undergo modifications until a stable version is reached.

### Motivation

The main idea behind Sword is to provide a module-based development structure, similar to frameworks like Spring or NestJS. Besides providing the tools and utilities these frameworks usually need, Sword includes:

- Configuration and environment variable management via `toml`
- Standardized JSON responses for HTTP
- Essential built-in middleware (interceptors)
- Dependency injection (automatic component construction)
- Simple, idiomatic error handling
- Support for REST, gRPC, events, Socket.IO, and scheduled jobs (cron jobs)

### What does "structured/opinionated" mean?

Building scalable web applications requires organizing code into well-defined layers and maintaining a clear separation of concerns.

If you are here, you have probably used `axum`, a framework developed by the `tokio` team. Axum covers most of what you need for web development, but as your project grows, the code can become hard to maintain. You may start adding pieces to extend or simplify Axum's own features, and over time the codebase becomes difficult to keep up.

Sword uses libraries from the `tokio` ecosystem to build a more organized, modular structure. The goal is to make Rust web projects easier to scale and maintain.
