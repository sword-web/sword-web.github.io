# Extensiones

Las extensiones, al igual que en axum, son una forma de almacenar y compartir datos a lo largo del ciclo de vida de una solicitud HTTP. Permiten que los middlewares y los controladores compartan información.

## Uso de Extensiones

```rust
use sword::prelude::*;
use uuid::Uuid;

#[middleware]
struct LoggerMiddleware;

impl OnRequest for LoggerMiddleware {
    async fn on_request(&self, mut req: Request, next: Next) -> MiddlewareResult {
        let request_id = Uuid::new_v4();

        println!("Incoming request: {} {}", req.method(), req.uri());

        req.extensions.insert::<Uuid>(request_id);

        next!(req, next)
    }
}
```

Luego en un controlador, puedes acceder a la extensión:

```rust
use sword::prelude::*;
use uuid::Uuid;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> HttpResult {
        let request_id = req.extensions.get::<Uuid>().cloned().unwrap_or_default();
        Ok(HttpResponse::Ok().message(format!("Request ID: {request_id}")))
    }
}
```

## Mutabilidad en Extensiones

Cuando desees insertar o modificar datos de las extensiones, debes declarar la `Request` como mutable en la firma del método del middleware o controlador.
