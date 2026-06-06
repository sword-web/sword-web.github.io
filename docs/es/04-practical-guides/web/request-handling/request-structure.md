---
title: "Referencia de Request"
description: "Referencia tipo API de Request en Sword para parámetros, body, query, headers, cookies y metadata HTTP."
outline: false

prev:
  text: Manejo de Requests
  link: /es/practical-guides/web/request-handling/explanation
next:
  text: Manejo de Errores
  link: /es/practical-guides/web/request-handling/error-handling
---
# La estructura `Request`

`Request` es el extractor principal para trabajar con solicitudes HTTP en controladores web de Sword.

## Atributo `extensions`

```rust
pub extensions: Extensions
```

**Retorna**

- Extensiones de Axum asociadas a la request actual.

**Cuándo usarlo**

- Para leer estado agregado por layers o interceptores previos.

## Referencia de métodos

### Método `uri()`

```rust
pub fn uri(&self) -> String
```

**Retorna**

- URI completa de la solicitud.

### Método `method()`

```rust
pub fn method(&self) -> &Method
```

**Retorna**

- Método HTTP (`GET`, `POST`, etc.).

### Método `header()`

```rust
pub fn header(&self, key: &str) -> Option<&str>
```

**Retorna**

- Valor de header si existe y es UTF-8 válido.

### Método `headers()`

```rust
pub fn headers(&self) -> &HeaderMap
```

**Retorna**

- Referencia inmutable al `HeaderMap` completo.

### Método `headers_mut()`

```rust
pub fn headers_mut(&mut self) -> &mut HeaderMap
```

**Retorna**

- Referencia mutable al `HeaderMap`.

### Método `set_header()`

```rust
pub fn set_header(
    &mut self,
    name: impl Into<String>,
    value: impl Into<String>,
) -> Result<(), RequestError>
```

**Retorna**

- `Ok(())` si inserta/reemplaza correctamente.
- `Err(RequestError)` si nombre o valor son inválidos.

### Método `param::<T>()`

```rust
pub fn param<T>(&self, key: &str) -> Result<T, RequestError>
where
    T: FromStr,
    T::Err: Display,
```

**Retorna**

- `Ok(T)` si el parámetro existe y parsea.
- `Err(RequestError)` si no existe o no puede parsearse.

**Cuándo usarlo**

- Parámetros de ruta como `/users/{id}`.

### Método `params()`

```rust
pub fn params(&self) -> &HashMap<String, String>
```

**Retorna**

- Todos los parámetros de ruta como `HashMap<String, String>`.

**Cuándo usarlo**

- Cuando necesitas acceder a múltiples path params dinámicamente.

```rust
#[get("/users/{id}/posts/{post_id}")]
async fn get_user_post(&self, req: Request) -> WebResult {
    let all_params = req.params();
    let id = all_params.get("id").unwrap();
    let post_id = all_params.get("post_id").unwrap();
    // ...
}
```

### Método `body::<T>()`

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

**Retorna**

- `Ok(T)` si el body es JSON válido compatible con `T`.
- `Err(RequestError)` si body vacío, media type inválido o deserialización fallida.

**Cuándo usarlo**

- Requests JSON en endpoints `POST`, `PUT`, `PATCH`.

### Método `query::<T>()`

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

**Retorna**

- `Ok(Some(T))` si hay query string válida.
- `Ok(None)` si no hay query string.
- `Err(RequestError)` si la query existe pero no deserializa.

### Método `cookies()`

```rust
pub fn cookies(&self) -> Result<&Cookies, JsonResponse>
```

**Retorna**

- `Ok(&Cookies)` si la capa de cookies está disponible.
- `Err(JsonResponse)` si no puede extraer cookies.

**Cuándo no usarlo**

- Si no tienes habilitada/aplicada la `CookieManagerLayer` en el router.

### Método `authorization()`

```rust
pub fn authorization(&self) -> Option<&str>
```

**Retorna**

- Valor del header `Authorization`.

### Método `user_agent()`

```rust
pub fn user_agent(&self) -> Option<&str>
```

**Retorna**

- Valor del header `User-Agent`.

### Método `ip()`

```rust
pub fn ip(&self) -> Option<&str>
```

**Retorna**

- Primer valor de `X-Forwarded-For` como texto.

### Método `ips()`

```rust
pub fn ips(&self) -> Option<Vec<&str>>
```

**Retorna**

- Lista de IPs en `X-Forwarded-For` separadas por coma.

### Método `protocol()`

```rust
pub fn protocol(&self) -> &str
```

**Retorna**

- Valor de `X-Forwarded-Proto` o `"http"` por defecto.

### Método `content_type()`

```rust
pub fn content_type(&self) -> Option<&str>
```

**Retorna**

- Valor de `Content-Type`.

### Método `content_length()`

```rust
pub fn content_length(&self) -> Option<u64>
```

**Retorna**

- `Content-Length` parseado a `u64`.

### Método `id()`

```rust
pub fn id(&self) -> String
```

**Retorna**

- Request ID de `RequestIdLayer`.
- `"unknown"` si no está disponible.

### Método `next()`

```rust
pub async fn next(self) -> WebInterceptorResult
```

**Retorna**

- Resultado de la cadena de interceptores.

**Cuándo usarlo**

- Solo dentro de implementaciones `OnRequest*`.

**Cuándo no usarlo**

- En handlers web normales.

## Notas operativas

- `ip()`, `ips()` y `protocol()` dependen de headers de proxy (`X-Forwarded-For`, `X-Forwarded-Proto`).
- `body::<T>()` exige `Content-Type` JSON (`application/json` o `+json`).

## Ejemplo de uso

```rust
use serde::Deserialize;
use sword::prelude::*;
use sword::web::*;

#[derive(Deserialize)]
struct ListUsersQuery {
    page: Option<u32>,
}

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/{id}")]
    async fn get_user(&self, req: Request) -> WebResult {
        let id = req.param::<u64>("id")?;
        let query = req.query::<ListUsersQuery>()?.unwrap_or(ListUsersQuery { page: Some(1) });
        let ua = req.user_agent().unwrap_or("unknown");

        Ok(JsonResponse::Ok().data(format!(
            "id={id}, page={:?}, ua={ua}",
            query.page
        )))
    }
}
```

## Ver también

- [Manejo de Requests](/es/practical-guides/web/request-handling/explanation)
- [Manejo de Errores](/es/practical-guides/web/request-handling/error-handling)
- [Manejo de respuestas HTTP](/es/practical-guides/web/response-handling)
