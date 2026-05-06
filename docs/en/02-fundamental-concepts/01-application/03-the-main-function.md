---
title: "The `main` Function and Macro"
description: "As you know, in Rust, program execution begins at the main function."
outline: [2, 3]
---
# The `main` Function and Macro

As you know, in Rust, program execution begins at the `main` function.

Commonly, in asynchronous frameworks, the `main` function must be marked with a special attribute to indicate that it is asynchronous.

For example, in `tokio`, `#[tokio::main]` is used, and in `async-std`, `#[async_std::main]` is used.

In Sword, we provide the `#[sword::main]` macro, which is essentially the same as `#[tokio::main]` under the hood. However, it adds additional functionality that will be discussed later: `hot-reload`.

Furthermore, by using this approach, you don't need to add `tokio` as a dependency in your project unless you explicitly need it for other functionality.

## Example

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```
