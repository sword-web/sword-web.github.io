# Extensions

Extensions, just like in Axum, allow you to store and share data throughout the lifecycle of an HTTP request. In Sword, they are especially useful for sharing information between web interceptors and controllers.

## Web Controllers

### Inserting data from an interceptor

A web interceptor can insert values into `req.extensions` before delegating execution to the next step in the pipeline.

```rust
use sword::prelude::*;
use sword::web::*;
use uuid::Uuid;

#[derive(Interceptor)]
struct RequestIdInterceptor;

impl OnRequest for RequestIdInterceptor {
    async fn on_request(&self, mut req: Request) -> WebInterceptorResult {
        let request_id = Uuid::new_v4();

        req.extensions.insert::<Uuid>(request_id);

        req.next().await
    }
}
```

### Reading extensions from a controller

Next, a web controller can read that value from the same request:

```rust
use sword::prelude::*;
use sword::web::*;
use uuid::Uuid;

#[controller(kind = Controller::Web, path = "/api")]
#[interceptor(RequestIdInterceptor)]
struct ApiController;

impl ApiController {
    #[get("/data")]
    async fn get_data(&self, req: Request) -> JsonResponse {
        let request_id = req.extensions.get::<Uuid>().cloned();

        JsonResponse::Ok().data(serde_json::json!({
            "request_id": request_id,
        }))
    }
}
```

This pattern is useful for sharing:

- Request IDs.
- Authentication information.
- Flags calculated by interceptors or layers.
- Traceability context.

### Request Mutability

If you need to insert or modify extensions within an interceptor, you must receive the request as mutable:

```rust
async fn on_request(&self, mut req: Request) -> WebInterceptorResult
```

If you only need to read extensions within the controller, the request doesn't need to be mutable.

## `Request` and `StreamRequest`

Both `Request` and `StreamRequest` expose extensions. This allows you to reuse the same pattern even in streaming routes.

For example, a `StreamRequest` interceptor can insert data into `req.extensions`, and the handler can read it later.

## Socket.IO Controllers

In Socket.IO, there's a related but distinct concept:

- `ctx.extensions()` gives access to socket extensions.
- `ctx.http_extensions()` gives access to HTTP extensions associated with the initial handshake request.

This is useful when you need to share information between the HTTP handshake and the subsequent real-time event phase.

## When to use extensions

Use extensions when you need to share state derived from a request or connection without making it a fixed dependency of the controller.

In contrast, if the data is structural or permanent in the application, it's usually better to model it as an injected dependency.
