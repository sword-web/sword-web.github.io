---
title: Referencia de Request
description: Referencia rápida de los métodos más útiles de Request en Sword para parámetros, body, query, headers y metadata de la request.
outline: [2, 3]
prev:
  text: Manejo de Requests
  link: /es/practical-guides/web/request-handling/explanation
next:
  text: Manejo de Errores
  link: /es/practical-guides/web/request-handling/error-handling
---

# La estructura `Request`

`Request` es el extractor principal para trabajar con solicitudes HTTP en controladores web de Sword.

## Resumen rápido

| Método | Uso principal | Retorno |
| --- | --- | --- |
| `uri()` | Leer la URI completa | `String` |
| `method()` | Leer el método HTTP | `&Method` |
| `header()` | Leer un header puntual | `Option<&str>` |
| `headers()` | Leer todos los headers | `&HeaderMap` |
| `headers_mut()` | Modificar headers | `&mut HeaderMap` |
| `set_header()` | Insertar o reemplazar un header | `Result<(), RequestError>` |
| `param()` | Leer un parámetro de ruta tipado | `Result<T, RequestError>` |
| `body()` | Deserializar body JSON | `Result<T, RequestError>` |
| `query()` | Deserializar query string | `Result<Option<T>, RequestError>` |
| `id()` | Leer request id | `String` |
| `authorization()` | Leer header Authorization | `Option<&str>` |
| `user_agent()` | Leer User-Agent | `Option<&str>` |
| `ip()` | Leer `X-Forwarded-For` principal | `Option<&str>` |
| `ips()` | Leer todas las IPs reenviadas | `Option<Vec<&str>>` |
| `protocol()` | Leer protocolo reportado | `&str` |
| `content_type()` | Leer Content-Type | `Option<&str>` |
| `content_length()` | Leer Content-Length | `Option<u64>` |
| `next()` | Continuar la cadena de interceptors | `WebInterceptorResult` |

## Metadata HTTP

::: details `uri()`

Retorna la URI completa de la solicitud.

```rust
pub fn uri(&self) -> String
```

:::

::: details `method()`

Retorna el método HTTP de la solicitud.

```rust
pub fn method(&self) -> &Method
```

:::

::: details `header()`

Lee un header puntual por nombre.

```rust
pub fn header(&self, key: &str) -> Option<&str>
```

:::

::: details `headers()` y `headers_mut()`

Permiten acceder al `HeaderMap` completo.

```rust
pub fn headers(&self) -> &HeaderMap
pub fn headers_mut(&mut self) -> &mut HeaderMap
```

:::

::: details `set_header()`

Inserta o reemplaza un header.

```rust
pub fn set_header(
    &mut self,
    name: impl Into<String>,
    value: impl Into<String>,
) -> Result<(), RequestError>
```

Puede fallar si el nombre o valor del header no son válidos.

:::

## Parámetros y payload

::: details `param()`

Lee un parámetro de ruta y lo convierte al tipo indicado.

```rust
pub fn param<T>(&self, key: &str) -> Result<T, RequestError>
where
    T: FromStr,
    T::Err: Display,
```

Errores habituales:

- el parámetro no existe
- el valor no puede parsearse al tipo pedido

```rust
let id = req.param::<u64>("id")?;
```

:::

::: details `body()`

Deserializa el body JSON al tipo pedido.

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

Errores habituales:

- body vacío
- `Content-Type` no compatible con JSON
- JSON inválido o shape incorrecto

```rust
let dto = req.body::<CreateUserDto>()?;
```

:::

::: details `query()`

Deserializa los parámetros de query string.

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

Retorna:

- `Ok(Some(T))` si hay query y se deserializa bien
- `Ok(None)` si no hay query string
- `Err(RequestError)` si la query existe pero es inválida

```rust
let query = req.query::<ListUsersQuery>()?.unwrap_or_default();
```

:::

## Helpers comunes

::: details `authorization()`, `user_agent()`, `content_type()`, `content_length()`

Helpers de lectura sobre headers comunes.

```rust
pub fn authorization(&self) -> Option<&str>
pub fn user_agent(&self) -> Option<&str>
pub fn content_type(&self) -> Option<&str>
pub fn content_length(&self) -> Option<u64>
```

:::

::: details `ip()`, `ips()` y `protocol()`

Helpers basados en headers reenviados por proxies.

```rust
pub fn ip(&self) -> Option<&str>
pub fn ips(&self) -> Option<Vec<&str>>
pub fn protocol(&self) -> &str
```

::: warning Proxy awareness
Estos métodos dependen de headers como `X-Forwarded-For` y `X-Forwarded-Proto`. Si tu despliegue no los inyecta, pueden venir vacíos o devolver valores por defecto.
:::

:::

::: details `id()`

Retorna el request id actual.

```rust
pub fn id(&self) -> String
```

Si no hay `RequestIdLayer`, devuelve `"unknown"`.

:::

## Uso dentro de interceptors

`next()` existe para continuar la cadena de interceptors.

```rust
pub async fn next(self) -> WebInterceptorResult
```

::: danger Solo en interceptors
No uses `req.next().await` en handlers normales. Está pensado para implementaciones de `OnRequest*` dentro de la cadena de interceptors de Sword.
:::

## Ejemplo completo

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;
```


## Errores más comunes

::: details `RequestError` más frecuentes

- `ParseError`
- `DeserializationError`
- `BodyIsEmpty`
- `BodyTooLarge`
- `UnsupportedMediaType`
- `InvalidHeaderName`
- `InvalidHeaderValue`

:::

## Ver también

- [Manejo de Requests](/es/practical-guides/web/request-handling/explanation)
- [Manejo de Errores](/es/practical-guides/web/request-handling/error-handling)
- [Manejo de respuestas HTTP](/es/practical-guides/web/response-handling)
