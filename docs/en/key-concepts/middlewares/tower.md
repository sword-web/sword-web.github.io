# Middlewares and Layers with `tower`

Sword, like axum, integrates with the Tower middleware ecosystem. This means you can use any Tower-compatible middleware in your application.

## Registering a Tower Middleware Globally

You can register a Tower middleware globally for the entire application using the `with_layer` method in the application builder.

```rust
use sword::prelude::*;
use tower_http::cors::*;

#[sword::main]
async fn main() {
    let cors_layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec!["GET", "POST"]);

    let app = Application::builder()
        .with_controller::<SomeController>()
        .with_layer(cors_layer)
        .build();

    app.run().await;
}
```

## Registering a Tower Middleware on a Controller or Route

```rust
use sword::prelude::*;
use tower_http::timeout::TimeoutLayer;

use tokio::time::{sleep, Duration};
use tower_http::timeout::TimeoutLayer;

#[controller("/")]
struct AppController {}

#[routes]
impl AppController {
    #[get("/")]
    #[uses(TimeoutLayer::new(Duration::from_secs(2)))]
    async fn get_data(&self) -> HttpResponse {
        sleep(Duration::from_secs(3)).await;
        HttpResponse::Ok()
    }
}
```

