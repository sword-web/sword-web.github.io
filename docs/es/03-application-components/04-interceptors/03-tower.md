# Layers con `tower`

Sword se integra con el ecosistema de Tower. Esto significa que puedes aplicar cualquier `tower::Layer` compatible allí donde el framework lo permita.

En la práctica, el uso de Tower en Sword se divide en dos niveles:

- layers globales sobre toda la aplicación con `Application::builder().with_layer(...)`
- layers locales en controladores web mediante `#[interceptor(expr)]`

## Aplicación completa

### Aplicaciones web

Si registras una layer con `with_layer(...)`, esta se aplica sobre el router final de la aplicación.

```rust
use sword::prelude::*;
use sword_layers::cors::{CorsConfig, CorsLayer};

struct AppModule;

impl Module for AppModule {}

#[sword::main]
async fn main() {
    let cors = CorsLayer::new(&CorsConfig::default());

    let app = Application::builder()
        .with_module::<AppModule>()
        .with_layer(cors)
        .build();

    app.run().await;
}
```

Este enfoque es el más adecuado para concerns transversales como:

- CORS
- cookies
- compresión
- security headers
- request id
- timeouts

### Aplicaciones web con Socket.IO

Cuando tu aplicación monta controladores web y Socket.IO sobre el mismo runtime web, las layers globales registradas con `with_layer(...)` también afectan la parte HTTP asociada a Socket.IO.

Por ejemplo, una layer global de CORS puede influir en:

- rutas HTTP normales
- el handshake inicial de Socket.IO
- la request HTTP asociada al transporte `polling` o `websocket`

Eso no convierte la layer en un interceptor local de conexión, pero sí significa que forma parte del pipeline HTTP general sobre el que se monta Socket.IO.

## Controladores web

En controladores web, `#[interceptor(...)]` también acepta expresiones. Esto permite aplicar una layer de Tower directamente sobre un controller o sobre una ruta concreta.

### Layer local en una ruta

```rust
use sword::prelude::*;
use tower_http::cors::CorsLayer;

#[controller(kind = Controller::Web, path = "/test")]
struct TestController;

impl TestController {
    #[get("/")]
    #[interceptor(CorsLayer::permissive())]
    async fn hello(&self) -> JsonResponse {
        JsonResponse::Ok().message("Hello from Sword")
    }
}
```

### Layer local a nivel de controller

```rust
use std::time::Duration;
use sword::prelude::*;
use tower_http::timeout::TimeoutLayer;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(TimeoutLayer::new(Duration::from_secs(2)))]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok().message("Data response")
    }
}
```

En este caso, la expresión no implementa un trait de Sword como `OnRequest`, sino que se aplica directamente como una layer del ecosistema Tower/Axum.

## Controladores Socket.IO

En controladores Socket.IO conviene distinguir dos cosas:

- **Layers globales**: sí aplican, porque Socket.IO se monta sobre el runtime web de la aplicación.
- **Layers locales vía `#[interceptor(expr)]`**: no deben documentarse como soporte equivalente al de controladores web.

Si necesitas lógica específica de conexión en Socket.IO, la forma correcta de documentarla y usarla sigue siendo mediante:

- `OnConnect`
- `OnConnectWithConfig`

Es decir, en Socket.IO:

- usa layers globales para concerns HTTP transversales
- usa interceptors Sword para lógica de conexión específica del namespace

## `sword-layers`

Además del soporte general para Tower, Sword cuenta con el crate complementario `sword-layers`, que agrupa layers reutilizables y configurables pensadas para el framework.

Entre las más comunes se encuentran:

- `CorsLayer`
- `CompressionLayer`
- `CookieManagerLayer`
- `Helmet`
- `TimeoutLayer`
- `RequestIdLayer`
- `ServeDir`

Estas layers se usan igual que cualquier otra layer de Tower, normalmente con `with_layer(...)` a nivel global.

## Cuándo usar qué

- Usa `with_layer(...)` cuando quieras aplicar una layer global a toda la aplicación.
- Usa `#[interceptor(expr)]` cuando quieras aplicar una layer Tower local a un controller o ruta web concreta.
- Usa interceptors Sword cuando necesites trabajar directamente con `Request`, `StreamRequest` o `SocketContext`.
