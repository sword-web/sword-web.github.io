# Middlewares y Layers con `tower`

Sword, al igual que axum, se integra con el ecosistema de middlewares de Tower. Esto significa que puedes utilizar cualquier middleware compatible con Tower en tu aplicación.

## Registrar un Middleware de Tower Globalmente

Puedes registrar un middleware de Tower globalmente para toda la aplicación utilizando el método `with_layer` en el constructor de la aplicación.

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

## Registrar un Middleware de Tower en un Controlador o Ruta

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