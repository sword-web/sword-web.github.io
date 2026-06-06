---
title: "Dependency Inversion with #[contract] - Sword Framework"
description: "Learn how #[contract] implements dependency inversion: depend on abstractions, not concrete implementations."
outline: [2, 3]
keywords:
    [
        "contract",
        "dependency inversion",
        "DI",
        "#[contract]",
        "injectable",
        "sword framework",
    ]
---

# Dependency Inversion with `#[contract]`

## What Is Dependency Inversion?

Dependency inversion is a concept that refers to the practice of making code depend on **abstractions** (traits), not on **concrete implementations** (specific structs).

An everyday example: a laptop works with any printer that follows the USB standard. The laptop doesn't care about the printer brand — it only cares about the **contract** (USB). You can swap printers without changing the laptop.

The same principle applies to code: instead of a controller creating a `DatabaseTaskRepository` directly, it depends on a `TaskRepository` trait. The actual implementation can change without modifying the controller.

## When Should You Use It?

- You have multiple data sources (database, cache, external API) and want to switch between them.
- You want to test business logic without setting up a real database.
- You work in a team and want to separate _what_ something does from _how_ it does it.
- You anticipate that a technology might change in the future.

## What Is a `#[contract]`?

A `contract` is a trait annotated with `#[contract]`. It defines **what** something does, not **how** it does it.

```rust
use sword::prelude::*;

#[contract]
pub trait TaskRepository {
    async fn find_all(&self) -> Vec<Value>;
}
```

This contract says: "anything that implements me can find all tasks." It doesn't say whether tasks come from PostgreSQL, Redis, or an in-memory list.

Contracts support both `async` and `sync` methods.

## How Do You Implement a Contract?

The real implementation also uses `#[contract]` on the `impl` block:

```rust
#[contract]
impl TaskRepository for DatabaseTaskRepository {
    async fn find_all(&self) -> Vec<Value> {
        // real database query
        todo!()
    }
}
```

You can have multiple implementations of the same contract — one for production, one for testing, one for a cache layer.

## How Do You Inject a Contract?

Inject the contract as `Arc<dyn Trait>` in any struct that supports dependency injection.

### In a Controller

```rust
#[controller(kind = Controller::Web, path = "/tasks")]
pub struct TasksController {
    repo: Arc<dyn TaskRepository>,
}
```

### In a Component (`#[injectable]`)

```rust
#[injectable]
pub struct TasksService {
    repo: Arc<dyn TaskRepository>,
}
```

### In a Provider (`#[injectable(provider)]`)

```rust
#[injectable(provider)]
pub struct TasksQueue {
    repo: Arc<dyn TaskRepository>,
}
```

The injection works the same way in all three cases — the DI container resolves the correct implementation automatically.

## Full Example

**Before** — tightly coupled, hard to test:

```rust
pub struct TasksController {
    repo: DatabaseTaskRepository,
}

impl TasksController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        let tasks = self.repo.find_all().await; // needs a real DB
        Ok(JsonResponse::Ok().data(tasks))
    }
}
```

**After** — decoupled, easy to swap:

```rust
// 1. Define the contract
#[contract]
pub trait TaskRepository {
    async fn find_all(&self) -> Vec<Value>;
}

// 2. Implement it
#[contract]
impl TaskRepository for DatabaseTaskRepository {
    async fn find_all(&self) -> Vec<Value> {
        todo!()
    }
}

// 3. Use it in the controller
#[controller(kind = Controller::Web, path = "/tasks")]
pub struct TasksController {
    repo: Arc<dyn TaskRepository>,
}

impl TasksController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        let tasks = self.repo.find_all().await;
        Ok(JsonResponse::Ok().data(tasks))
    }
}
```

Now you can swap the database for a cache without touching the controller.

## See Also

- [Providers](/en/application-components/di/providers)
- [Components](/en/application-components/di/components)
- [Injecting Dependencies](/en/application-components/di/injecting)
