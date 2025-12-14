# Manejo de respuestas HTTP

Como habrás visto en la sección de [Manejo de errores](./request-handling/error-handling.md), los métodos de la estructura `Request` pueden retornar errores que son convertidos automáticamente en respuestas HTTP estandarizadas.

Además existen dos tipos posibles de retorno en los controladores:

- `HttpResponse`
- `HttpResult`

## La estructura `HttpResponse`

Sword utiliza la estructura `HttpResponse` para representar respuestas HTTP. Puedes construir una respuesta HTTP utilizando los métodos proporcionados por esta estructura.

### Configuración de estado HTTP

`HttpResponse` proporciona un conjunto de metodos estáticos para configurar el estado de la respuesta HTTP. Algunos ejemplos incluyen:

- `HttpResponse::Ok()`: Retorna una respuesta con el estado HTTP 200 OK.
- `HttpResponse::Created()`: Retorna una respuesta con el estado HTTP 201 Created.
- Y así sucesivamente para otros códigos de estado HTTP.

Esto generará una respuesta estándar de la forma:

```json
{
  "code": 200,
  "message": "OK",
  "success": true,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

### Agregar datos a la respuesta

#### `message()`
Puedes agregar un mensaje personalizado a la respuesta utilizando el método `message()`:

```rust
let response = HttpResponse::Ok().message("Successful operation");
```

Esto generará una respuesta de la forma:

```json
{
  "code": 200,
  "message": "Successful operation",
  "success": true,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

#### `data()`

Puedes agregar datos que implementen `serde::Serialize` a la respuesta utilizando el método `data()`:

```rust
let my_data = MyData { field1: "value".to_string(), field2: 42 };
let response = HttpResponse::Ok().data(my_data);
```

Esto generará una respuesta de la forma:

```json
{
  "code": 200,
  "data": {
    "field1": "value",
    "field2": 42
  },
  "success": true,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

#### `error()`
Puedes agregar información de error a la respuesta utilizando el método `error()`

```rust
let error_response = HttpResponse::BadRequest().error("Invalid input data");
```

Esto generará:

```json
{
  "code": 400,
  "error": "Invalid input data",
  "message": "Bad Request",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

#### `errors()`
Puedes agregar múltiples mensajes de error a la respuesta utilizando el método `errors()`:

```rust
let errors_response = HttpResponse::BadRequest().errors(vec!["Error 1", "Error 2"]);
```

Esto generará:

```json
{
  "code": 400,
  "errors": ["Error 1", "Error 2"],
  "message": "Bad Request",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```