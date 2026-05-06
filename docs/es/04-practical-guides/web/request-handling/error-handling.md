---
title: "Manejo de errores en `Request`"
description: "Muchos metodos de Request retornan Result porque la extraccion o deserializacion puede fallar."
outline: [2, 3]
---
# Manejo de errores en `Request`

Muchos metodos de `Request` retornan `Result` porque la extraccion o deserializacion puede fallar.

Ejemplos comunes:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`

## Conversion automatica de errores

Cuando el handler retorna `WebResult`, Sword convierte automaticamente muchos `RequestError` en `JsonResponse` al propagar con `?`.

## Manejo estructurado con `#[derive(HttpError)]`

`HttpError` es una derive macro para enums de error HTTP. Genera:

- `From<Self> for JsonResponse`
- `IntoResponse`

Esto te permite retornar errores de dominio directamente desde handlers web.

## Atributos soportados

Segun el rustdoc de la macro:

- `#[http_error(...)]`: defaults a nivel enum.
- `#[http(...)]`: override por variante.

Claves disponibles:

- `code = <u16>`
- `message = "texto"`
- `message = nombre_de_campo`
- `error = nombre_de_campo` (solo variantes con campos nombrados)
- `errors = nombre_de_campo` (solo variantes con campos nombrados)
- `transparent` (solo variante, delega en otro tipo `HttpError`)
- `tracing = <level>` en `http_error/http`
- `#[tracing(level)]` como shorthand compatible hacia atras

Niveles validos para tracing: `trace`, `debug`, `info`, `warn`, `error`.

## Ejemplo completo

```rust
use serde_json::Value;
use sword::prelude::*;
use sword::web::*;
use thiserror::Error;

#[derive(Debug, Error, HttpError)]
#[http_error(code = 500, tracing = error, message = "Internal server error")]
pub enum ApiError {
    #[error("Not found")]
    #[http(code = 404, message = "Resource missing", tracing = info)]
    NotFound,

    #[error("Conflict: {field}")]
    #[http(code = 409, message = client_message, error = detail)]
    Conflict {
        client_message: String,
        field: String,
        detail: Value,
    },

    #[error("Auth error: {0}")]
    #[http(transparent)]
    Auth(#[from] AuthError),
}

#[derive(Debug, Error, HttpError)]
#[http_error(code = 401, message = "Unauthorized")]
pub enum AuthError {
    #[error("Invalid token")]
    #[http(code = 401, message = "Invalid token")]
    InvalidToken,
}
```

## Nota sobre tracing

Si habilitas `tracing` en la macro, el codigo generado emite logs estructurados con datos como:

- `error`
- `error_type`
- `status_code`
- campos de la variante cuando existen

## Cuando manejar manualmente

Si quieres una respuesta totalmente custom para un caso puntual, puedes evitar `?` y transformar errores manualmente con `match` o `map_err`.

## Ver tambien

- [Referencia de Request](/es/practical-guides/web/request-handling/request-structure)
- [Manejo de Requests](/es/practical-guides/web/request-handling/explanation)
