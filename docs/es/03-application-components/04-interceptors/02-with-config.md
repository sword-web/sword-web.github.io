# Interceptores con Configuración

Este tipo de interceptor posee el mismo comportamiento del `Interceptor` tradicional, pero añade un parámetro adicional en la firma de su método de intercepción.

## Controladores Web - Interceptor

### El Trait `OnRequestWithConfig`

Al igual que `OnRequest`, este trait permite definir lógica personalizada que se ejecuta antes de que una solicitud HTTP llegue al controlador web, pero permite recibir un parámetro de tipo `T` extra con el que podremos tener un nivel adicional de configuración.

```rust
use sword::prelude::*;

#[derive(Interceptor)]
struct RequestLogger;

impl OnRequestWithConfig<&str> for RequestLogger {
    async fn on_request(&self, config: &str, req: Request) -> WebInterceptorResult {
        println!("Using '&str' config with value: '{config}'");
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
    #[interceptor(RequestLogger, config = "some &str")]
    async fn get_data(&self) -> JsonResponse {
        JsonResponse::Ok()
    }
}
```

### El Trait `OnRequestStreamWithConfig`

Si la ruta recibe `StreamRequest`, la variante configurada debe implementarse con `OnRequestStreamWithConfig<T>`.

```rust
use sword::prelude::*;

#[derive(Interceptor)]
struct StreamConfigInterceptor;

impl OnRequestStreamWithConfig<&'static str> for StreamConfigInterceptor {
    async fn on_request(
        &self,
        config: &'static str,
        mut req: StreamRequest,
    ) -> WebInterceptorResult {
        req.extensions.insert(config.to_string());
        req.next().await
    }
}
```

Aplicado sobre una ruta con `StreamRequest`:

```rust
use axum::body::to_bytes;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/stream")]
struct StreamController;

impl StreamController {
    #[post("/echo-with-config")]
    #[interceptor(StreamConfigInterceptor, config = "stream-config")]
    async fn echo_with_config(&self, req: StreamRequest) -> WebResult {
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

### Cómo elegir entre `OnRequestWithConfig` y `OnRequestStreamWithConfig`

- Si el handler recibe `Request`, implementa `OnRequestWithConfig<T>`.
- Si el handler recibe `StreamRequest`, implementa `OnRequestStreamWithConfig<T>`.

### Nota importante sobre `StreamRequest`

Al igual que en la variante tradicional, las rutas con `StreamRequest` no pueden combinarse con interceptores Sword definidos a nivel de controller. Debes aplicarlos directamente sobre la ruta.

## Controladores Socket.IO - Interceptor

### El Trait `OnConnectWithConfig`

Al igual que `OnConnect`, este trait permite definir lógica personalizada que se ejecuta antes de que un cliente se conecte a un `namespace` en concreto, pero permite recibir un parámetro de tipo `T` extra con el que podremos tener un nivel adicional de configuración.

```rust
use sword::prelude::*;

#[derive(Interceptor)]
struct EventLogger;

impl OnConnectWithConfig<&str> for EventLogger {
    type Error = String;

    async fn on_connect(
        &self,
        config: &str,
        ctx: SocketContext,
    ) -> Result<(), Self::Error> {
        println!("[Socket.IO] - New connection - Socket ID: {}", ctx.id());
        println!("Using '&str' config with value: {config}");

        Ok(())
    }
}
```

Como habrás notado, es necesario definir un tipo de error asociado. Este puede tener la estructura o formato que estimes conveniente, pero debe implementar el trait `Display`.

Luego, puedes aplicar este interceptor a un controlador Socket.IO:

```rust
use sword::prelude::*;

#[controller(kind = Controller::SocketIo, namespace = "/events")]
#[interceptor(EventLogger, config = "some &str")]
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

## Controladores gRPC - Interceptor con configuración

### El Trait `OnRequestWithConfig`

En gRPC puedes usar `OnRequestWithConfig<T>` para inyectar parámetros de configuración en la validación/intercepción.

```rust
use sword::grpc::*;
use sword::prelude::*;

#[derive(Interceptor)]
struct ApiKeyInterceptor;

impl OnRequestWithConfig<&'static str> for ApiKeyInterceptor {
    async fn on_request(
        &self,
        expected_key: &'static str,
        req: Request<()>,
    ) -> GrpcInterceptorResult {
        let Some(value) = req.metadata().get("x-api-key") else {
            return Err(Status::unauthenticated("missing x-api-key"));
        };

        let Ok(value) = value.to_str() else {
            return Err(Status::unauthenticated("invalid x-api-key"));
        };

        if value != expected_key {
            return Err(Status::permission_denied("invalid x-api-key"));
        }

        Ok(req)
    }
}
```

Aplicación sobre un controlador gRPC:

```rust
#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(ApiKeyInterceptor, config = "dev-key")]
struct UsersController;
```
