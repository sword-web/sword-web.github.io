---
title: "The `main` Function and Macro"
description: "As you know, in Rust, program execution begins at the main function."
outline: [2, 3]
---
# The `main` Function and Macro

As you know, in Rust, program execution begins at the `main` function.

Commonly, in asynchronous frameworks, the `main` function must be marked with a special attribute to indicate that it is asynchronous.

In Sword, the `#[sword::main]` macro initializes the application's internal runtime with `tokio` and runs the `main` function asynchronously.

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

Furthermore, by using this approach, you don't need to add `tokio` as a dependency in your project unless you explicitly need it for other functionality.
