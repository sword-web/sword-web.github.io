---
title: "Errores gRPC con GrpcError"
description: "Cómo modelar errores de dominio y convertirlos a tonic::Status con #[derive(GrpcError)] en Sword."
outline: [2, 3]
---

# Manejo de errores en aplicaciones gRPC

Normalmente los métodos de cada controlador gRPC retornan `GrpcResult<U>`, que se resuelve en un `tonic::Status` cuando algo falla. Sin embargo, los servicios, repositorios y otros componentes suelen retornar errores de dominio propios de un módulo.

Por esto, Sword provee `GrpcError`, una macro para enums de errores. Esta macro genera la conversión de cada error a `tonic::Status` en función de los atributos definidos en cada variante.

## Definiendo errores de dominio

```rust
use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal")]
pub enum UserError {
    #[error("Usuario no encontrado")]
    #[grpc(code = "not_found", message = "Usuario no encontrado")]
    NotFound,

    #[error("El usuario ya existe")]
    #[grpc(code = "already_exists", message = "El usuario ya existe")]
    AlreadyExists,
}
```

Como habrás visto, es necesario implementar `thiserror::Error` para que la macro `GrpcError` funcione correctamente. Esto permite que el error pueda ser propagado y transformado con más facilidad entre diferentes variantes.

## Atributos disponibles

- `code`: Código gRPC `&str` a retornar. Obligatorio.
- `message`: Mensaje a retornar en el `Status`. Puede ser un literal o un campo de la variante.
- `transparent`: solo en variante sin campos, delega en otro tipo `GrpcError`.
- `tracing`: nivel de tracing para la variante. Ver [Tracing](#tracing).

Niveles válidos para tracing: `trace`, `debug`, `info`, `warn`, `error`.

## Códigos gRPC válidos

Los valores aceptados por `code` son:

- `ok`
- `cancelled`
- `unknown`
- `invalid_argument`
- `deadline_exceeded`
- `not_found`
- `already_exists`
- `permission_denied`
- `resource_exhausted`
- `failed_precondition`
- `aborted`
- `out_of_range`
- `unimplemented`
- `internal`
- `unavailable`
- `data_loss`
- `unauthenticated`

## Tracing

Otro aspecto interesante de `GrpcError` es que permite habilitar `tracing` para cada variante mediante el atributo `tracing = <nivel>` (o el shorthand compatible `#[tracing(nivel)]`). Esto genera logs estructurados con información del error y los campos de la variante.

Por ejemplo, para `UserError::Conflict` con `tracing = error`:

```rust
#[error("Conflicto en {field}: {value}")]
#[grpc(code = "already_exists", message = "Conflicto en {field}: {value}", tracing = error)]
Conflict {
    field: String,
    value: String,
},
```

La salida en consola se vería así:

```text
ERROR gRPC error response error="Conflicto en username: Alice" error_type="Conflict" grpc_code="already_exists" field="username" value="Alice"
```

## Interpolación de Mensajes

En el atributo `message` puedes referenciar campos de la variante con sintaxis `{field}`. Por ejemplo, en `UserError`:

```rust
#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal")]
pub enum UserError {
    // ...

    #[error("Conflicto en {field}: {value}")]
    #[grpc(code = "already_exists", message = "Conflicto en {field}: {value}")]
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

use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal", tracing = error)]
pub enum AppError {
    #[error("Auth error: {0}")]
    #[grpc(transparent)]
    Auth(#[from] AuthError),

    #[error("User error: {0}")]
    #[grpc(transparent)]
    User(#[from] UserError),

    #[error("Service unavailable")]
    #[grpc(code = "unavailable", tracing = warn)]
    Unavailable,
}
```

```rust [users/errors.rs]
use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "internal")]
pub enum UserError {
    #[error("Usuario no encontrado")]
    #[grpc(code = "not_found", message = "Usuario no encontrado")]
    NotFound,

    #[error("El usuario ya existe")]
    #[grpc(code = "already_exists", message = "El usuario ya existe")]
    AlreadyExists,

    #[error("Conflicto en {field}: {value}")]
    #[grpc(code = "already_exists", message = "Conflicto en {field}: {value}", tracing = error)]
    Conflict {
        field: String,
        value: String,
    },
}
```

```rust [auth/errors.rs]
use sword::grpc::*;
use thiserror::Error;

#[derive(Debug, Error, GrpcError)]
#[grpc_error(code = "unauthenticated")]
pub enum AuthError {
    #[error("Token inválido")]
    #[grpc(code = "unauthenticated", message = "Token inválido")]
    InvalidToken,
}
```

```text [Status resultante]
// AuthError::InvalidToken
Status::unauthenticated("Token inválido")
code = "unauthenticated" message = "Token inválido"

// UserError::NotFound
Status::not_found("Usuario no encontrado")
code = "not_found" message = "Usuario no encontrado"

// UserError::AlreadyExists
Status::already_exists("El usuario ya existe")
code = "already_exists" message = "El usuario ya existe"

// UserError::Conflict
Status::already_exists("Conflicto en username: Alice")
code = "already_exists" message = "Conflicto en username: Alice"

// AppError::Unavailable
Status::unavailable("Service unavailable")
code = "unavailable" message = "Service unavailable"
```

:::

## Nota sobre `transparent`

`#[grpc(transparent)]` delega la conversión a `tonic::Status` en el error interno.

Es útil cuando tu variante envuelve otro tipo que ya implementa el flujo de conversión esperado.
