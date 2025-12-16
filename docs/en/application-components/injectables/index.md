---
title: Dependency Injection - Sword Framework
description: Master dependency injection in Sword. Learn about the DependencyContainer, Injectable types, Providers, and Components for modular applications.
keywords: ["dependency injection", "DI container", "injectable", "providers", "components", "sword framework", "modular architecture"]
---

# Dependency Injection in Sword

Dependency injection is a design pattern that allows an object to receive its dependencies from external sources instead of creating them itself.

This enables greater modularity, facilitates unit testing, and improves code maintainability.

Sword uses this approach to manage components and services within the application, allowing dependencies to be injected automatically when needed.

## Key Concepts

### Dependency Container

The `DependencyContainer` structure is the core of the dependency injection pattern in Sword. It acts as a centralized registry where dependencies can be registered and resolved.

### `Injectable`

`Injectable` is a general concept that refers to any structure that can be used as a dependency. `Injectable` structures can be automatically injected by the dependency container when requested.

### `Provider`

A `Provider` is a type of `Injectable` structure that must be instantiated and manually registered in the dependency container. `Providers` are responsible for providing connection logic to external services, such as databases or APIs.

### `Component`

A `Component` is an `Injectable` structure that builds itself based on dependencies already registered in the container. `Components` are ideal for representing modular parts of the application that depend on other services or configurations.