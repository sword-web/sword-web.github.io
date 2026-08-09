---
title: "Manejo de Errores"
description: "Muchos métodos de `Request` retornan `Result` porque la extracción o deserialización puede fallar."
outline: [2, 3]
---

# Manejo de errores en una aplicación web

Normalmente los métodos de cada controlador retornan errores HTTP, sin embargo, servicios, repositorios y otros componentes suelen retornar errores de dominio propios de un módulo.

Por esto, Sword provee `HttpError`, una macro para enums de errores. Esta macro genera las conversiones correspondientes de cada error a `JsonResponse` en función de los atributos que sean definidos en cada variante.

## Definiendo errores de dominio

```rust
use sword::prelude::*;
use sword::web::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum UserError {
    #[error("Usuario no encontrado")]
    #[http(code = 404, message = "Usuario no encontrado")]
    NotFound,

    #[error("El usuario ya existe")]
    #[http(code = 409, message = "El usuario ya existe")]
    AlreadyExists,
}
```

Como habrás visto, es necesario implementar `thiserror::Error` para que la macro `HttpError` funcione correctamente. Esto permite que el error pueda ser propagado y transformado con más facilidad entre diferentes variantes.

## Atributos disponibles

- `code`: Código de estado HTTP `u16` a retornar. Obligatorio.
- `message`: Mensaje a retornar en la respuesta. Puede ser un literal o un campo de la variante.
- `error` y `errors`: Campo de la variante que será serializado y retornado en la respuesta. Solo para variantes con campos nombrados.
- `transparent`: solo en variante sin campos, delega en otro tipo `HttpError`.

## Tracing

Otro aspecto interesante de `HttpError` es que permite habilitar `tracing` para cada variante mediante el atributo `#[tracing(nivel)]`. Esto genera logs estructurados con información del error y los campos de la variante.

Niveles validos: `trace`, `debug`, `info`, `warn`, `error`.

Por ejemplo, para `UserError::Conflict` con `#[tracing(error)]`:

```rust
#[error("Conflicto en {field}: {value}")]
#[http(code = 409, message = "Conflicto en {field}: {value}")]
#[tracing(error)]
Conflict {
    field: String,
    value: String,
},
```

La salida en consola se vería así:

```text
ERROR HTTP error response error="Conflicto en username: Alice" error_type="Conflict" status_code=409 field="username" value="Alice"
```

## Interpolación de Mensajes

En el atributo `message` puedes referenciar campos de la variante con sintaxis `{field}`. Por ejemplo, en `UserError`:

```rust
#[derive(Debug, Error, HttpError)]
pub enum UserError {
    // ...

    #[error("Conflicto en {field}: {value}")]
    #[http(code = 409, message = "Conflicto en {field}: {value}")]
    Conflict {
        field: String,
        value: String,
    },
}
```

El compilador valida que los campos referenciados existan en la variante. No soportado en variantes tuple o unit.

## Ejemplo completo

::: code-group

```rust [shared/errors.rs]
use crate::auth::AuthError;
use crate::users::UserError;

use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum AppError {
    #[error("Auth error: {0}")]
    #[http(transparent)]
    Auth(#[from] AuthError),

    #[error("User error: {0}")]
    #[http(transparent)]
    User(#[from] UserError),

    #[error("Internal server error")]
    #[http(code = 500, message = "Internal server error")]
    Internal,
}
```

```rust [users/errors.rs]
use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum UserError {
    #[error("Usuario no encontrado")]
    #[http(code = 404, message = "Usuario no encontrado")]
    NotFound,

    #[error("El usuario ya existe")]
    #[http(code = 409, message = "El usuario ya existe")]
    AlreadyExists,

    #[error("Conflicto en {field}: {value}")]
    #[http(code = 409, message = "Conflicto en {field}: {value}")]
    Conflict {
        field: String,
        value: String,
    },
}
```

```rust [auth/errors.rs]
use sword::prelude::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
pub enum AuthError {
    #[error("Token inválido")]
    #[http(code = 401, message = "Token inválido")]
    InvalidToken,
}
```

```jsonc [Respuestas]
// AuthError::InvalidToken
{
    "code": 401,
    "message": "Token inválido",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// UserError::NotFound
{
    "code": 404,
    "message": "Usuario no encontrado",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// UserError::AlreadyExists
{
    "code": 409,
    "message": "El usuario ya existe",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// UserError::Conflict
{
    "code": 409,
    "message": "Conflicto en {field}: {value}",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}

// AppError::Internal
{
    "code": 500,
    "message": "Internal server error",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::
