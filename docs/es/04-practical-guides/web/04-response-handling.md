---
title: "Manejo de respuestas HTTP"
description: "Cómo decidir entre JsonResponse, WebResult y respuestas compatibles con Axum en controladores web de Sword."
outline: [2, 3]
---

# Manejo de respuestas HTTP

La forma recomendada de responder en un endpoint web es usando `WebResult`. Esto asegura que todas las respuestas tengan un formato consistente y que los errores se manejen de manera uniforme.

## WebResult

Este es un alias de:

```rust
Result<JsonResponse, JsonResponse>
```

Esto permite devolver respuestas exitosas y de error con el mismo formato JSON.

## JsonResponse

La estructura principal para construir respuestas JSON en Sword. Esta estructura provee una serie de métodos estáticos equivalentes a los códigos de estado HTTP más comunes, y permite encadenar métodos para agregar mensajes, datos o errores.

### Constructores habituales

- `JsonResponse::Ok()`
- `JsonResponse::Created()`
- `JsonResponse::BadRequest()`
- `JsonResponse::Unauthorized()`
- `JsonResponse::NotFound()`
- `JsonResponse::InternalServerError()`

### Mensaje por defecto

Si no especificas un mensaje con `message(...)`, Sword añade automáticamente el texto canónico del código HTTP. Esto ocurre también con códigos menos habituales, como los que se construyen con `JsonResponse::TooManyRequests()`:

::: code-group

```rust [Ejemplo]
JsonResponse::TooManyRequests()
```

```json [Respuesta]
{
    "code": 429,
    "success": false,
    "message": "Too Many Requests",
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

### Construcción de payload

#### Método `message()`

Añade un mensaje descriptivo a la respuesta.

::: code-group

```rust [Ejemplo]
JsonResponse::Ok().message("Successful operation");
```

```json [Respuesta]
{
    "code": 200,
    "success": true,
    "message": "Successful operation",
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

#### Método `data()`

Añadir información serializable a la respuesta.

::: code-group

```rust [Ejemplo]
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

```json [Respuesta]
{
    "code": 200,
    "message": "OK",
    "success": true,
    "timestamp": "2024-06-01T12:00:00Z",
    "data": {
        "field1": "value",
        "field2": 42
    }
}
```

:::

#### Método `error()` y `errors()`

Permiten adjuntar errores a la respuesta. `error()` es para un único error, mientras que `errors()` es para una colección de errores o una estructura de validación. Ambos tienen en si el mismo propósito, sin embargo se incluyen ambas para semántica y claridad en la intención de la respuesta.

::: code-group

```rust [Ejemplo]
JsonResponse::BadRequest()
    .error("Invalid input data")
    .errors(vec!["Error 1", "Error 2"]);
```

```json [Respuesta]
{
    "code": 400,
    "message": "Bad Request",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z",
    "error": "Invalid input data",
    "errors": ["Error 1", "Error 2"]
}
```

:::

### Errores automáticos desde `Request`

Muchos métodos de `Request` retornan `RequestError`, si usas `?` en el método del controlador, el error se convertirá automáticamente en un `JsonResponse` con el código de estado correspondiente.

#### Ejemplo

::: code-group

```rust [Ejemplo]
#[derive(Deserialize)]
struct UserData {
    name: String,
    email: String,
}

#[post("/")]
async fn create_user(&self, req: Request) -> WebResult {
    let _ = req.body::<UserData>()?;
    Ok(JsonResponse::Created())
}
```

```json [Request Body]
{
    "name": "Alice"
}
```

```json [Respuesta]
{
    "code": 400,
    "error": "Failed to deserialize request body to the required type.",
    "message": "Invalid request body",
    "success": false,
    "timestamp": "2024-06-01T12:00:00Z"
}
```

:::

### Auto conversión de respuesta con `WebResult<T>`

Las macros de ruta (`#[get]`, `#[post]`, etc.) detectan el tipo genérico `T` de `WebResult<T>` y lo envuelven automáticamente en un `JsonResponse`.

El código de estado se elige según el método HTTP de la ruta: `POST` responde con `201 Created`, mientras que el resto de métodos responden con `200 OK`.

#### Ejemplo GET (200)

::: code-group

```rust [Ejemplo]
#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
}

// Asumiendo una estructura `UserController`

#[get("/users/{id}")]
async fn get_user(&self, req: Request) -> WebResult<User> {
    let user = User { id: 1, name: "Alice".to_string() };
    Ok(user)
}
```

```json [Respuesta]
{
    "code": 200,
    "message": "OK",
    "success": true,
    "timestamp": "2024-06-01T12:00:00Z",
    "data": {
        "id": 1,
        "name": "Alice"
    }
}
```

:::

En este caso el valor de `Ok(...)` se coloca automáticamente en `data`. Si no quieres devolver datos, puedes usar `()` y la respuesta llevará solo el código de estado y su mensaje.

#### Ejemplo POST (201)

::: code-group

```rust [Ejemplo]
#[derive(Serialize)]
struct CreateUserResponse {
    id: u32,
}

#[post("/users")]
async fn create_user(&self) -> WebResult<CreateUserResponse> {
    Ok(CreateUserResponse { id: 1 })
}
```

```json [Respuesta]
{
    "code": 201,
    "message": "Created",
    "success": true,
    "timestamp": "2024-06-01T12:00:00Z",
    "data": {
        "id": 1
    }
}
```

:::

## `File` — descargas y contenido inline

`JsonResponse` cubre las respuestas JSON, pero a veces necesitas devolver archivos. Para eso Sword expone `File`, un builder que construye respuestas de descarga o de visualización inline según la `ContentDisposition` que uses. Por defecto, `File` se comporta como una descarga (`ContentDisposition::Attachment`) con `Content-Type` `application/octet-stream`.

Un endpoint de descarga típico se ve así:

```rust
use sword::prelude::*;

#[get("/reports/{name}")]
async fn download_report(&self) -> File {
    let data = std::fs::read("report.pdf").unwrap();

    File::new()
        .bytes(&data)
        .content_type("application/pdf")
        .filename("report.pdf")
        .attachment()
}
```

El método `bytes()` recibe el contenido del archivo, `content_type()` define su `Content-Type`, y `filename()` el nombre que se usará en el header `Content-Disposition`.

Si en lugar de descargar quieres que el navegador muestre el archivo directamente (por ejemplo, un PDF o una imagen), usa `inline()`:

```rust
File::new()
    .bytes(&data)
    .content_type("image/png")
    .filename("logo.png")
    .inline()
```

También puedes agregar headers personalizados con `header(...)`. Y como `File` implementa `IntoResponse`, puedes devolverlo directamente o dentro de un `WebResult<File>`.

## `Redirect` — redirecciones HTTP

Cuando un endpoint necesita redirigir a otra URL, Sword expone `Redirect`. Cada constructor cubre uno de los códigos 3xx más comunes:

- `Redirect::permanent(url)` — `301 Moved Permanently`
- `Redirect::found(url)` — `302 Found`
- `Redirect::see_other(url)` — `303 See Other`
- `Redirect::temporary(url)` — `307 Temporary Redirect`
- `Redirect::permanent_redirect(url)` — `308 Permanent Redirect`
- `Redirect::status(code, url)` — un código personalizado

Por ejemplo, después de un login exitoso puedes redirigir con `see_other`, que fuerza una petición `GET` a la nueva ubicación:

```rust
use sword::prelude::*;

#[post("/login")]
async fn login(&self) -> Redirect {
    Redirect::see_other("/dashboard")
}
```

La redirección agrega el header `Location` con la URL de destino y el código de estado correspondiente. Puedes añadir headers extra con `header(...)`:

```rust
Redirect::temporary("/maintenance")
    .header("X-Redirect-Reason", "maintenance")
```

Al igual que `File`, `Redirect` implementa `IntoResponse`, por lo que también puede devolverse dentro de un `WebResult<Redirect>`.
