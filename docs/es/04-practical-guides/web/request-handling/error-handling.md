# Manejo de errores en `Request`

Muchos métodos de `Request` retornan un `Result` porque la extracción o deserialización puede fallar.

Por ejemplo:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`
- `req.body_validator::<T>()`

## Conversión automática de errores

Sword convierte automáticamente muchos errores de `Request` en una `JsonResponse` adecuada cuando el handler retorna `WebResult` y propagas el error con `?`.

## Ejemplo

```rust
use serde::{Deserialize, Serialize};
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/")]
pub struct MyController;

#[derive(Serialize, Deserialize)]
struct MyData {
    pub field1: String,
    pub field2: i32,
}

impl MyController {
    #[post("/")]
    pub async fn post_data(&self, req: Request) -> WebResult {
        let data = req.body::<MyData>()?;

        Ok(JsonResponse::Ok().data(data))
    }
}
```

Si el body no puede deserializarse correctamente, Sword responderá automáticamente con una respuesta JSON de error estandarizada.

## Ejemplo de error

### Cuerpo enviado

```json
{
  "field1": "example",
  "field2": "not_an_integer"
}
```

### Respuesta aproximada

```json
{
  "code": 400,
  "error": "...",
  "message": "Invalid request body",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

## Personalización de errores

Si quieres reemplazar ese comportamiento, puedes no utilizar `?` y manejar el error manualmente con `match`, `map_err` o cualquier otro enfoque que prefieras.

## Limitaciones

La deserialización depende de `serde`, por lo que no siempre será posible obtener mensajes tan específicos como los de una validación estructurada. Si necesitas errores más ricos o por campo, conviene combinar extracción con validación explícita.
