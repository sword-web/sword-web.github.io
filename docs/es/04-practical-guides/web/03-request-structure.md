---
title: "Referencia de `Request`"
description: "Referencia de la estructura `Request` en Sword para parámetros, body, query, headers, cookies y metadata HTTP."
outline: false
---

# La estructura 'Request'

La estructura `Request` es el extractor principal para trabajar con solicitudes HTTP en controladores web de Sword.

<ApiSection title="API Reference" :collapsed="false">

#### Acceso a las extensiones de la solicitud

Atributo que retorna las extensiones de Axum asociadas a la solicitud actual.

```rust
pub extensions: Extensions
```

**Cuándo usarlo**

- Para leer estado agregado por layers o interceptores previos.

---

#### Obteniendo la URI de la solicitud

Método que retorna la URI completa de la solicitud

```rust
pub fn uri(&self) -> String
```

**Retorna**

- URI completa de la solicitud, incluyendo path y query string.

---

#### Obteniendo el método HTTP de la solicitud

```rust
pub fn method(&self) -> &Method
```

**Retorna**

- Método HTTP de la solicitud.

---

#### Obtener un header de la solicitud

```rust
pub fn header(&self, key: &str) -> Option<&str>
```

**Retorna**

- Valor de header si existe y es UTF-8 válido.

---

#### Obtener todos los headers de la solicitud

```rust
pub fn headers(&self) -> &HeaderMap
pub fn headers_mut(&mut self) -> &mut HeaderMap
```

**Retorna**

- Referencia inmutable y mutable al `HeaderMap` respectivamente.

---

#### Agregar o reemplazar un header de la solicitud

```rust
pub fn set_header(&mut self, name: impl Into<String>, value: impl Into<String>) -> Result<(), RequestError>
```

**Retorna**

- `Ok(())` si inserta/reemplaza correctamente.
- `Err(RequestError)` si nombre o valor son inválidos.

---

#### Obtener un parámetro de ruta

```rust
pub fn param<T>(&self, key: &str) -> Result<T, RequestError>
where
    T: FromStr,
    T::Err: Display,
```

**Parámetros**

- `T`: Tipo al que se quiere parsear el parámetro de ruta.
- `key`: Nombre del parámetro de ruta a extraer.

**Retorna**

- `Ok(T)` si el parámetro existe y parsea.
- `Err(RequestError)` si no existe o no puede parsearse.

**Cuándo usarlo**

- Parámetros de ruta como `/users/{id}`.

---

#### Obtener todos los parámetros de ruta

```rust
pub fn params(&self) -> &RawPathParams
```

**Retorna**

- Los parámetros de ruta crudos (percent-decodificados, sin deserializar) como `RawPathParams`.

**Cuándo usarlo**

- Cuando necesitas iterar todos los path params sin conocer sus nombres de antemano. Para uno puntual, usa `param::<T>()`.

---

#### Obtener el body de la solicitud

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

**Parámetros**

- `T`: Tipo al que se quiere deserializar el body JSON. Debe implementar `DeserializeOwned`.

**Retorna**

- `Ok(T)` si el body es JSON válido compatible con `T`.
- `Err(RequestError)` si body vacío, media type inválido o deserialización fallida.

**Cuándo usarlo**

- Requests JSON en endpoints `POST`, `PUT`, `PATCH`.

---

#### Obtener la query string de la solicitud

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

**Parámetros**

- `T`: Tipo al que se quiere deserializar la query string. Debe implementar `DeserializeOwned`.

**Retorna**

- `Ok(Some(T))` si hay query string válida.
- `Ok(None)` si no hay query string.
- `Err(RequestError)` si la query existe pero no deserializa.

---

#### Accediendo a las cookies de la solicitud

```rust
pub fn cookies(&self) -> Result<&Cookies, JsonResponse>
```

**Retorna**

- `Ok(&Cookies)` si el layer de cookies está disponible.
- `Err(JsonResponse)` si no puede extraer cookies.

---

#### Obteniendo el header 'Authorization'

Acceso directo al header `Authorization` de la solicitud.

```rust
pub fn authorization(&self) -> Option<&str>
```

**Retorna**

- Valor del header `Authorization` o `None` si no existe o no es UTF-8 válido.

---

#### Obteniendo el header 'User-Agent'

Acceso directo al header `User-Agent` de la solicitud.

```rust
pub fn user_agent(&self) -> Option<&str>
```

**Retorna**

- Valor del header `User-Agent` o `None` si no existe o no es UTF-8 válido.

---

#### Obteniendo la IP del cliente

Acceso directo al primer valor del header `X-Forwarded-For` de la solicitud.

```rust
pub fn ip(&self) -> Option<&str>
```

**Retorna**

- Primer valor de `X-Forwarded-For` como texto plano, o `None` si no existe.

---

#### Obteniendo todas las IPs del cliente

Acceso directo al header `X-Forwarded-For` de la solicitud, que puede contener múltiples IPs.

```rust
pub fn ips(&self) -> Option<Vec<&str>>
```

**Retorna**

- Lista de IPs en `X-Forwarded-For` separadas por coma, o `None` si no existe.

---

#### Obteniendo el protocolo de la solicitud

Acceso directo al header `X-Forwarded-Proto` de la solicitud.

```rust
pub fn protocol(&self) -> &str
```

**Retorna**

- Valor de `X-Forwarded-Proto` o `"http"` por defecto.

---

#### Obteniendo el header 'Content-Type'

Acceso directo al header `Content-Type` de la solicitud.

```rust
pub fn content_type(&self) -> Option<&str>
```

**Retorna**

- Valor de `Content-Type` o `None` si no existe o no es UTF-8 válido.

---

#### Obteniendo el header 'Content-Length'

```rust
pub fn content_length(&self) -> Option<u64>
```

**Retorna**

- `Content-Length` parseado a `u64`, o `None` si no existe o no es un número válido.

---

#### Obteniendo el Request ID

```rust
pub fn id(&self) -> String
```

**Retorna**

- Request ID de `RequestIdLayer` en formato UUID v4.
- `"unknown"` si no está disponible.

---

#### Avanzando al siguiente interceptor

Este método permite continuar la cadena de interceptores, solo debe ser usado dentro de implementaciones `OnRequest*`. No debe usarse en handlers web normales.

```rust
pub async fn next(self) -> WebInterceptorResult
```

</ApiSection>
