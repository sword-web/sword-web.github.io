---
title: Project Structure - Sword Framework
description: Understand the recommended project structure and file organization in Sword applications. Learn the module-based architecture pattern.
keywords: ["project structure", "sword framework", "rust project layout", "modular architecture", "file organization"]
---

# File Structure

As mentioned in the introduction, Sword suggests a module-based development structure.

When initializing an application with `sword-cli`, it will generate a structure similar to the following:

```shell
my-sword-app
├── Cargo.lock
├── Cargo.toml
├── config
│   └── config.toml
└── src
    ├── controller.rs
    ├── main.rs
    └── service.rs
```

This gives you an idea of how to organize your project. However, as your application grows, it's recommended to divide the application into modules and separate the different layers of the application.

In that case, the recommended structure is as follows:

```shell
module_name
├── controller.rs   # HTTP Layer (Controller definition and endpoints)
├── dtos.rs         # Input/output schema definitions and validation
├── entity.rs       # Domain Layer (entities and business models)
├── mod.rs          # Module entry point (definition and re-exports)
├── repository.rs   # Persistence Layer (data access)
└── service.rs      # Business logic layer

```

You've probably seen or used a similar architecture in frameworks like Spring in Java or NestJS. Sword takes strong inspiration from the latter.
