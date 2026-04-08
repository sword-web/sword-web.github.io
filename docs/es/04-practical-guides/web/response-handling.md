---
title: Manejo de respuestas HTTP
description: Cómo decidir entre JsonResponse, WebResult y respuestas compatibles con Axum en controladores web de Sword.
outline: [2, 3]
prev:
  text: Extender Request
  link: /es/practical-guides/web/request-handling/extending-request
---

# Manejo de respuestas HTTP

En Sword, la forma recomendada de responder desde un controlador web es usando `JsonResponse` o `WebResult`.

## Tipos de retorno habituales

::: code-group

```rust [JsonResponse]
use sword::prelude::*;
use sword::web::*;

#[get("/")]
async fn health(&self) -> JsonResponse {
    JsonResponse::Ok().message("Service available")
}
```

```rust [WebResult]
use sword::prelude::*;
use sword::web::*;

#[get("/{id}")]
async fn get_user(&self, req: Request) -> WebResult {
    let id = req.param::<u64>("id")?;

    Ok(JsonResponse::Ok().data(id))
}
```

:::

- `JsonResponse`
- `WebResult`

## `WebResult`

`WebResult` es un alias de:

```rust
Result<JsonResponse, JsonResponse>
```

Esto permite devolver respuestas exitosas y de error con el mismo formato JSON del framework.

## `JsonResponse`

`JsonResponse` es la estructura principal para construir respuestas JSON en Sword.

### Constructores habituales

- `JsonResponse::Ok()`
- `JsonResponse::Created()`
- `JsonResponse::BadRequest()`
- `JsonResponse::Unauthorized()`
- `JsonResponse::NotFound()`
- `JsonResponse::InternalServerError()`

### Ejemplo mínimo

```rust
use sword::prelude::*;
use sword::web::*;

async fn example() -> JsonResponse {
    JsonResponse::Ok().message("Successful operation")
}
```

## Construcción de payload

::: details `message()`

Añade un mensaje descriptivo a la respuesta.

```rust
let response = JsonResponse::Ok().message("Successful operation");
```

:::

::: details `data()`

Adjunta cualquier valor serializable.

```rust
use serde::Serialize;

#[derive(Serialize)]
struct MyData {
    field1: String,
    field2: u32,
}

let response = JsonResponse::Ok().data(MyData {
    field1: "value".to_string(),
    field2: 42,
});
```

:::

::: details `error()`

Adjunta un error único.

```rust
let response = JsonResponse::BadRequest().error("Invalid input data");
```

:::

::: details `errors()`

Adjunta una colección de errores o una estructura de validación.

```rust
let response = JsonResponse::BadRequest().errors(vec!["Error 1", "Error 2"]);
```

:::

## Ejemplo de controlador

::: code-group

```rust [Retorno simple]
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list_users(&self) -> JsonResponse {
        JsonResponse::Ok().message("Users list")
    }
}
```

```rust [Con errores]
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/{id}")]
    async fn get_by_id(&self, req: Request) -> WebResult {
        let id = req.param::<u64>("id")?;

        Ok(JsonResponse::Ok().data(id))
    }
}
```

:::

## Errores automáticos desde `Request`

Muchos métodos de `Request` retornan `RequestError`, y Sword los convierte en respuestas JSON cuando trabajas con `WebResult`.

Métodos comunes:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`
- `req.body_validator::<T>()`

## ¿Puedo devolver otra cosa?

Sí. Un controlador también puede retornar cualquier tipo que implemente `IntoResponse`, porque la capa web de Sword se apoya en Axum.

`JsonResponse` y `WebResult` siguen siendo la opción recomendada si quieres conservar el formato estándar de respuestas del framework.

## Ver también

- [Manejo de Requests](/es/practical-guides/web/request-handling/explanation)
- [La estructura `Request`](/es/practical-guides/web/request-handling/request-structure)
- [Manejo de Errores](/es/practical-guides/web/request-handling/error-handling)
