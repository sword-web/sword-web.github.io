---
title: Dependency Container - Sword Framework
description: Learn about the DependencyContainer in Sword. Understand dependency registration, Arc usage, and centralized dependency management.
keywords: ["dependency container", "DI container", "dependency registration", "sword framework", "Arc pointers", "thread safety"]
---

# Dependency Container

The `DependencyContainer` structure is the core of the dependency injection pattern in Sword. It acts as a centralized registry where dependencies can be registered and resolved.

## Dependency Registration

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let db = Database::connect("sqlite::memory:").await.unwrap();

    let container = DependencyContainer::builder()
        .register_provider(db)
        .register_component::<UserService>()
        .build();
}
```
In this example, a `Database` instance is created and a `DbProvider` is registered as a provider in the dependency container. Additionally, `UserService` is registered as a component that can be resolved automatically.

## Using `Arc`

When dependencies are registered in the container, it uses `Arc` pointers internally, thus ensuring that shared dependencies are safe for thread access. This means that it is not necessary to manually wrap dependencies in `Arc` when registering them.