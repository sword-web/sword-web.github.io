# Request Id Middleware en Sword

El middleware de Request Id en Sword asigna un identificador único (Uuid v4) a cada petición entrante.

El `id` se genera automáticamente y se puede obtener desde los métodos de la estructura `Request` mediante el método `id()` o desde los `Extensions` de la petición bajo el tipo `RequestId`.

## Envío del Request Id en las Respuestas

El `id` se propaga automáticamente a las respuestas enviadas por la aplicación Sword. Se añade una cabecera `X-Request-Id` con el valor del identificador único generado para la petición.

Si quieres añadir el id en la respuesta `JSON` puedes usar el metodo `request_id()` ingresando el `req.id()` como valor.

## Ejemplo

```rust
JsonResponse::Ok().message("Hello, World!").request_id(req.id())
```
