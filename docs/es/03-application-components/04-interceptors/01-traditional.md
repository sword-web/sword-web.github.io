# Interceptores Tradicionales

Este tipo es el más común. Se declara como una estructura que deriva el trait `Interceptor`. Como se mencionó en la sección de inyección de dependencias, por debajo los interceptores son `Components`; es decir, pueden poseer dependencias sin requerir un constructor definido.

## Controladores Web - Interceptor

### El Trait `OnRequest`

Este trait permite definir lógica personalizada que se ejecuta antes de que una solicitud HTTP llegue al controlador. Esto es útil para tareas como autenticación, autorización o registro de solicitudes.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct RequestLogger;

impl OnRequest for RequestLogger {
    async fn on_request(&self, req: Request) -> WebInterceptorResult {
        println!("Incoming request: {} {}", req.method(), req.uri());
        req.next().await
    }
}
```

Luego, puedes aplicar este interceptor a un controlador o ruta específica:

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[get("/data")]
    #[interceptor(RequestLogger)]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok().message("Data response")
    }
}
```

### El Trait `OnRequestStream`

Cuando el handler recibe `StreamRequest` en lugar de `Request`, el interceptor web debe implementar `OnRequestStream`.

Este caso es útil cuando no quieres bufferizar el body completo en memoria y necesitas trabajar con el flujo bruto de la request.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamTagInterceptor;

impl OnRequestStream for StreamTagInterceptor {
    async fn on_request(&self, mut req: StreamRequest) -> WebInterceptorResult {
        req.extensions.insert("stream-ok".to_string());
        req.next().await
    }
}
```

Y puedes aplicarlo a una ruta que reciba `StreamRequest`:

```rust
use axum::body::to_bytes;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/stream")]
struct StreamController;

impl StreamController {
    #[post("/echo")]
    #[interceptor(StreamTagInterceptor)]
    async fn echo(&self, req: StreamRequest) -> WebResult {
        let tag = req.extensions.get::<String>().cloned().unwrap_or_default();
        let body_limit = req.body_limit();

        let body = to_bytes(req.into_body(), body_limit).await.map_err(|_| {
            JsonResponse::InternalServerError().message("Failed to read stream body")
        })?;

        Ok(JsonResponse::Ok().data(serde_json::json!({
            "len": body.len(),
            "tag": tag,
        })))
    }
}
```

### Diferencia entre `Request` y `StreamRequest`

- Usa `Request` cuando quieras un acceso más ergonómico a body, query, params, cookies y helpers de extracción.
- Usa `StreamRequest` cuando necesites trabajar con el body como flujo y evitar su carga completa en memoria.

### Nota importante sobre `StreamRequest`

Las rutas que usan `StreamRequest` no pueden combinarse con interceptores Sword definidos a nivel de controller. En ese caso, aplica el interceptor directamente sobre la ruta o usa layers de Tower basadas en expresiones.

## Controladores Socket.IO - Interceptor

### El Trait `OnConnect`

Este trait permite definir lógica personalizada que se ejecuta antes de que un cliente se conecte a un `namespace` en concreto.

A diferencia de los interceptores de controladores web, el interceptor `OnConnect` se ejecuta solo en el handshake inicial (evento `#[on("connection")]`). Luego, cada evento bajo el `namespace` no ejecutará el interceptor.

```rust
use sword::prelude::*;
use sword::socketio::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnect for EventLogger {
    type Error = String;

    async fn on_connect(&self, ctx: SocketContext) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());

        Ok(())
    }
}
```

Como habrás notado, es necesario definir un tipo de error asociado. Este puede tener la estructura o formato que estimes conveniente, pero debe implementar el trait `Display`.

Luego, puedes aplicar este interceptor a un controlador Socket.IO:

```rust
use sword::prelude::*;
use sword::socketio::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger)]
struct EventController;

impl EventController {
    #[on("connection")]
    async fn on_connect(&self, ctx: SocketContext) {
        println!("Client connected: {}", ctx.id());
    }

    #[on("event")]
    async fn handle_message_event(&self, ctx: SocketContext) {
        let payload: Event = ctx.try_data().expect("Failed to parse event data");

        println!("Received 'event' from {}: {payload:?}", ctx.id());
    }
}
```

En este ejemplo, el interceptor se aplica antes del evento `#[on("connection")]`. Cualquier interacción en otros eventos asociados al controlador no pasará por el interceptor aplicado.

## Controladores gRPC - Interceptor

### El Trait `OnRequest`

En gRPC, `OnRequest` permite interceptar la request antes de que llegue al método del servicio.

```rust
use sword::grpc::*;
use sword::prelude::*;

#[derive(Interceptor)]
struct AuthInterceptor;

#[sword::grpc::async_trait]
impl OnRequest for AuthInterceptor {
    async fn on_request(&self, req: Request<()>) -> GrpcInterceptorResult {
        if req.metadata().get("authorization").is_none() {
            return Err(Status::unauthenticated("missing authorization metadata"));
        }

        Ok(req)
    }
}
```

Aplicación sobre un controlador gRPC:

```rust
#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(AuthInterceptor)]
struct UsersController;
```

En esta variante no existe `next()`: el interceptor valida/transforma metadata de entrada y retorna `Ok(req)` o un `Status` de error.
