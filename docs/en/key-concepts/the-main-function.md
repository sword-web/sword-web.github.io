---
title: The Main Function and Macro - Sword Framework
description: Understand the #[sword::main] macro for async Rust applications. Learn about hot-reload and async runtime configuration in Sword.
keywords: ["sword macro", "main function", "async rust", "tokio main", "hot reload", "rust async runtime"]
---

# The Main Function and Macro

As you know, in Rust, program execution begins with the `main` function.

In async frameworks, the `main` function typically needs to be marked with a special attribute to indicate that it's asynchronous.

For example, `tokio` uses `#[tokio::main]`, and `async-std` uses `#[async_std::main]`.

In Sword, we provide the `#[sword::main]` macro which is essentially the same as `#[tokio::main]` under the hood. However, we add extra functionality that we'll discuss later: `hot-reload`.

Additionally, by using this approach, you don't need to add `tokio` as a direct dependency in your project unless you need it explicitly for other features.

## Example

```rust

use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run().await;
}

```
