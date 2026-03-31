---
title: Manejo de Respuestas HTTP - Sword Framework
description: Aprende a construir respuestas HTTP en Sword usando JsonResponse y WebResult.
keywords: ["http", "jsonresponse", "webresult", "sword", "respuestas web"]
---

# Manejo de respuestas HTTP

En Sword, la forma recomendada de responder desde un controlador web es usando `JsonResponse` o `WebResult`.

## Tipos de retorno más comunes

Los tipos más habituales en controladores web son:

- `JsonResponse`
- `WebResult`

`WebResult` es un alias de:

```rust
Result<JsonResponse, JsonResponse>
```

Esto permite devolver respuestas exitosas y errores con el mismo formato JSON estandarizado del framework.

## `JsonResponse`

`JsonResponse` es la estructura principal para construir respuestas HTTP JSON en Sword.

### Estados HTTP

Puedes crear respuestas con distintos códigos de estado usando constructores como:

- `JsonResponse::Ok()`
- `JsonResponse::Created()`
- `JsonResponse::BadRequest()`
- `JsonResponse::Unauthorized()`
- `JsonResponse::InternalServerError()`

Ejemplo:

```rust
use sword::prelude::*;

async fn example() -> JsonResponse {
    JsonResponse::Ok().message("Successful operation")
}
```

## Añadir contenido a la respuesta

### Método `message()`

Permite añadir un mensaje descriptivo:

```rust
let response = JsonResponse::Ok().message("Successful operation");
```

### Método `data()`

Permite adjuntar cualquier valor serializable:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct MyData {
    field1: String,
    field2: u32,
}

let my_data = MyData {
    field1: "value".to_string(),
    field2: 42,
};

let response = JsonResponse::Ok().data(my_data);
```

### Método `error()`

Permite adjuntar un error único:

```rust
let response = JsonResponse::BadRequest().error("Invalid input data");
```

### Método `errors()`

Permite adjuntar múltiples errores o una estructura de errores validada:

```rust
let response = JsonResponse::BadRequest().errors(vec!["Error 1", "Error 2"]);
```

## Ejemplo de controlador

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list_users(&self) -> JsonResponse {
        JsonResponse::Ok().message("Users list")
    }

    #[post("/")]
    async fn create_user(&self) -> WebResult {
        Ok(JsonResponse::Created().message("User created"))
    }
}
```

## Errores automáticos desde `Request`

Muchos métodos de `Request` retornan errores que Sword convierte automáticamente en `JsonResponse`.

Por ejemplo:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`
- `req.body_validator::<T>()`

Esto permite escribir handlers como:

```rust
use sword::prelude::*;

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

## Trait `IntoResponse`

Aunque `JsonResponse` y `WebResult` son las opciones recomendadas, un controlador también puede retornar cualquier tipo que implemente `IntoResponse`, ya que la capa web de Sword se apoya en Axum.
