# Request Id Middleware in Sword

The Request Id middleware in Sword assigns a unique identifier (Uuid v4) to each incoming request.

The `id` is automatically generated and can be obtained from the `Request` structure methods via the `id()` method or from the request `Extensions` under the `RequestId` type.

## Sending Request Id in Responses

The `id` is automatically propagated to responses sent by the Sword application. An `X-Request-Id` header is added with the value of the unique identifier generated for the request.

If you want to add the id in the `JSON` response you can use the `request_id()` method by passing `req.id()` as the value.

## Example

```rust
JsonResponse::Ok().message("Hello, World!").request_id(req.id())
```
