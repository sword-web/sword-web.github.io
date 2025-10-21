
# Manejo de errores en `Request`

Como habrás visto, algunos métodos de la estructura `Request` retornan un `Result`. Esto se debe a que estos métodos pueden fallar por diversas razones.

Por ejemplo, al utilizar `Request::body<T>()`, el proceso de deserialización al tipo `T` puede fallar si el cuerpo de la solicitud no coincide con la estructura esperada. 

En estos casos, el `Result` retornado contendrá un error que describe la causa del fallo. Puedes manejar estos errores de la manera que prefieras, sin embargo, sword incluye la conversión automatica de errores a respuestas HTTP estándarizadas.

## Conversión automática de errores

Como se mencionó en la sección de controladores, estos, pueden retornar dos tipos:

- `HttpResponse`
- `HttpResult`

El tipo de error que retorna en un método de `Request` puede ser convertido automáticamente en una respuesta HTTP adecuada si el controlador retorna un `HttpResult` y utilizas el operador `?` para propagar el error.

## Ejemplo

```rust
use serde::{Serialize, Deserialize};
use sword::prelude::*;

#[controller("/")]
pub struct MyController;

#[derive(Serialize, Deserialize)]
struct MyData {
    pub field1: String,
    pub field2: i32,
}

#[routes]
impl MyController {
    #[post("/")]
    pub async fn post_data(&self, req: Request) -> HttpResult {
        let data = req.body::<MyData>()?;

        ... Do something with data ...
        
        Ok(HttpResponse::ok().data(data))
    }
}
```

Si enviamos algo como:

```json
{
    "field1": "example",
    "field2": "not_an_integer"
}
```
Obtendremos lo siguiente:

```json
{
  "code": 400,
  "error": "Failed to parse request body to the required type.",
  "message": "Invalid request body",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

## Personalización de errores

Si deseas reemplazar este comportamiento puedes no utilizar el operador `?` y manejar el error manualmente utilizando `match`, `map_err` o cualquier otro método que prefieras.


## Limitaciones

Dado que la deserialización recae en el crate `serde`, los errores no pueden ser tan específicos como para indicar exactamente qué campo falló en la deserialización. En su lugar, se proporciona un mensaje de error genérico indicando que la deserialización falló.

Si necesitas un manejo de errores más detallado, considera deserializar el cuerpo manualmente y manejar los errores según tus necesidades.