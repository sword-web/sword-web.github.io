# Middlewares

Un middleware de sword es una estructura declarada bajo la macro `#[middleware]`. Los middlewares permiten interceptar y procesar solicitudes y respuestas HTTP en controladores o rutas específicas.

## `OnRequest Trait`

El trait `OnRequest` permite definir lógica personalizada que se ejecuta antes de que una solicitud llegue al controlador. Esto es útil para tareas como autenticación, autorización o registro de solicitudes.

```rust
use sword::prelude::*;

#[middleware]
struct LoggerMiddleware;

impl OnRequest for LoggerMiddleware {
    async fn on_request(&self, req: Request, next: Next) -> MiddlewareResult {
        println!("Incoming request: {} {}", req.method(), req.uri());
        next!(req, next)
    }
}
```

Luego, puedes aplicar este middleware a un controlador o ruta específica:

```rust

use sword::prelude::*;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/data")]
    #[uses(LoggerMiddleware)]
    async fn get_data(&self) -> HttpResponse {
        HttpResponse::Ok().message("Data response")
    }
}
```
