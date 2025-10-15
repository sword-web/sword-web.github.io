# Introduction

Sword is a web framework that allows building server-side applications in a structured and opinionated way, based on `Axum` and `Tokio`.

### Motivation

The main idea of Sword is to establish a module-based development structure, similar to frameworks like Spring (Java) or NestJS (Node.js). Additionally, Sword provides a set of tools and utilities commonly needed in web applications with `Axum`, such as:

- Configuration and environment variable handling
- Standardized HTTP response format
- Integrated middlewares (CORS, Timeout, Helmet headers, etc.)
- Dependency injection
- Interactive CLI for project and module creation
- Cookie handling
- Schema validation

### What do we mean by "structured/opinionated"?

Building scalable web applications requires organizing code into well-defined layers and maintaining clear separation of responsibilities.

If you're here, you've probably checked out `Axum`, a framework developed by the `tokio-rs` team. Axum offers a fairly complete set of features for developing web applications; however, as your project grows, the code can become complex to maintain, or you might end up adding features to extend or simplify the framework.
