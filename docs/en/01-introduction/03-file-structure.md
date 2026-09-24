---
title: "File Structure"
description: "Sword suggests a development structure based on modules."
---
# File Structure

As mentioned in the introduction, Sword suggests a development structure based on modules.

A module is an organizational unit that groups together related code, such as controllers, services, repositories, entities and even sub-modules. This allows for a clear separation of concerns and facilitates project scalability.

```shell
module_name
├── controller.rs   # Presentation layer and adapters.
├── dtos.rs         # Input/output schemas and validation.
├── entity.rs       # Domain layer (entities and business models).
├── mod.rs          # Module entry point (definitions and re-exports).
├── repository.rs   # Persistence layer (data access).
└── service.rs      # Business logic layer.
```

You have likely seen or used a similar architecture in frameworks like Spring (Java) or NestJS (Node.js). Sword takes heavy inspiration from the latter.

Of course, this structure is only a guide. In fact, it is highly likely you will need to add additional files, such as:

- `errors.rs` to define module- or domain-specific errors.
- `views.rs` to define views and client-facing structures.

Or even additional directories for sub-modules, for example:

```shell
module_name
├── controllers/    # Presentation layers and adapters (web, grpc, socketio, events, etc)
├── dtos/           # Input/output schemas and validation
├── services/       # Services and business logic associated with the module
├── entity.rs       # Domain layer (entities and business models)
├── mod.rs          # Module entry point (definitions and re-exports)
├── repository.rs   # Persistence layer (data access)
```
