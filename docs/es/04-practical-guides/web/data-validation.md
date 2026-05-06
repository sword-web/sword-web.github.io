---
title: "Validación de Datos"
description: "La validación de datos de entrada es un aspecto fundamental en aplicaciones web."
outline: [2, 3]
---
# Validación de Datos

La validación de datos de entrada es un aspecto fundamental en aplicaciones web. Permite asegurar que los datos cumplen reglas específicas antes de ser procesados o almacenados.

Sword integra soporte con el crate `validator` mediante la feature `validation-validator`.

## Habilitar `validator`

Para usar validación basada en el crate `validator`, agrega las dependencias y habilita la feature correspondiente:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["validation-validator"] }
serde = { features = ["derive"] }
validator = { features = ["derive"] }
```

Con esto podrás usar helpers como:

- `req.body_validator::<T>()`
- `req.query_validator::<T>()`
- `req.params_validator::<T>()`

## Ejemplo

### Definición de DTOs

```rust
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
struct CreateUserDto {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Name must be between 1 and 50 characters"
    ))]
    pub name: String,

    #[validate(email(message = "Invalid email format"))]
    pub email: String,
}

#[derive(Debug, Deserialize, Validate, Default)]
struct GetUsersQuery {
    #[validate(range(min = 1, message = "Page must be at least 1"))]
    pub page: Option<u32>,

    #[validate(range(
        min = 1,
        max = 100,
        message = "Page size must be between 1 and 100"
    ))]
    pub page_size: Option<u32>,
}
```

### Implementación del controlador

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list(&self, req: Request) -> WebResult {
        let query = req.query_validator::<GetUsersQuery>()?.unwrap_or_default();
        println!("Listing users with query: {query:?}");

        Ok(JsonResponse::Ok().message("User list"))
    }

    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let data = req.body_validator::<CreateUserDto>()?;
        println!("Creating user with data: {data:?}");

        Ok(JsonResponse::Created().message("User created"))
    }
}
```

## Respuesta de error de validación

Sword maneja automáticamente los errores de validación y responde con un estado HTTP `400 Bad Request`, incluyendo detalles de validación en el cuerpo de la respuesta.

### Cuerpo de la solicitud

```json
{
    "name": "",
    "email": "not_an_valid_email"
}
```

### Respuesta de error

```json
{
    "code": 400,
    "errors": {
        "email": [
            {
                "code": "email",
                "message": "Invalid email format"
            }
        ],
        "name": [
            {
                "code": "length",
                "message": "Name must be between 1 and 50 characters"
            }
        ]
    },
    "message": "Invalid request body",
    "success": false,
    "timestamp": "2025-10-21T05:09:16Z"
}
```

## Nota final

Esta integración corresponde específicamente a la feature `validation-validator`. Si decides usar otra librería de validación, tendrás que definir tu propia lógica de validación y el formato de error que quieras exponer.
