---
title: "Dependency Injection - Sword Framework"
description: "Master dependency injection in Sword. Learn about the DependencyContainer, Injectable types, Providers, and Components for modular applications."
outline: [2, 3]

keywords:
    [
        "dependency injection",
        "DI container",
        "injectable",
        "providers",
        "components",
        "sword framework",
        "modular architecture",
    ]
---
# Dependency Injection in Sword

Dependency injection (DI) is a design pattern in which an object receives its dependencies from external sources rather than creating them itself.

This approach enhances modularity, facilitates unit testing, and improves code maintainability.

Sword uses this pattern to manage components and services within the application, allowing dependencies to be injected automatically whenever they are needed.

## Key Concepts

### Dependency Container

The `DependencyContainer` struct is the core of the dependency injection pattern in Sword. It acts as a centralized registry where dependencies can be registered and resolved.

### `Injectable`

The term `Injectable` refers to any struct that can be used as a dependency. `Injectable` structs can be automatically injected by the dependency container when requested.

### `Provider`

A `Provider` is a type of `Injectable` struct that must be manually instantiated and registered in the dependency container. Providers are typically responsible for providing connections to external services, such as databases or APIs.

### `Component`

A `Component` is an `Injectable` struct that is self-constructed based on dependencies already registered in the container. Components are ideal for representing modular parts of the application that depend on other services or configurations.
