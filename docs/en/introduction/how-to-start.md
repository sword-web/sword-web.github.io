# How to Start?

There are two ways to start using Sword: the first is configuring everything manually, and the second is using `sword-cli`, a tool that provides a set of utilities for creating projects and generating code.

## Using sword-cli

To use this method, you need to install `sword-cli` first. This binary provides a set of tools for creating and generating code interactively.

```shell
cargo install sword-cli
sword create my-sword-app
```

This will start an interactive menu to configure your project. Once finished, navigate to the project directory and run:

```shell
cargo run
```

## Manual Configuration

Create a new project with cargo:

```shell
cargo new my-sword-app
```

Then add Sword and serde as dependencies in your `Cargo.toml`:

```toml
[dependencies]
sword =  "0.1.8"
serde = "*"
serde_json = "*"
```

Finally, create a `src/main.rs` file with the following content:

```rust
use sword::prelude::*;

#[controller("/")]
struct AppController {}

#[routes]
impl AppController {
    #[get("/hello")]
    async fn hello(&self) -> HttpResponse {
        HttpResponse::Ok().message("Hello, World!")
    }
}

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<AppController>()
        .build();

    app.run().await;
}
```
