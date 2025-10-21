# Definiendo rutas en controladores

En Sword, las rutas se definen dentro del bloque de implementación de un controlador. Para ello debes utilizar la macro `#[routes]` sobre este bloque `impl`.

```rust
use sword::prelude::*;
use serde_json::Value;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/hello")]
    async fn hello(&self) -> HttpResponse {
        HttpResponse::Ok().message("Hello, world!")
    }
}
```

Un controlador puede tener acceso al contexto de la `request` mediante el parámetro `ctx: Context`

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[get("/hello/{name}")]
    async fn hello(&self, req: Request) -> HttpResult {
        let name: String = req.param("name")?;

        ... Process logic ...

        Ok(HttpResponse::Ok().message(format!("Hello, {}!", name)))
    }
}
```

Para conocer todas las funcionalidades de `Context`, ver [Contexto de la Request](../context-requests.md).

## Métodos HTTP soportados

De momento, sword soporta los metódos HTTP más comunes:

- `#[get("...")]`
- `#[post("...")]`
- `#[put("...")]`
- `#[delete("...")]`
- `#[patch("...")]`

### Sintaxis de las rutas

Las rutas pueden incluir parámetros, que se definen encerrando el nombre del parámetro entre llaves `{}`. Por ejemplo, en la ruta `/users/{id}`, `{id}` es un parámetro que puede ser extraído desde el contexto de la request.

Para más detalles sobre la sintaxis de las rutas, puedes [consultar la documentación de axum](https://docs.rs/axum/latest/axum/routing/struct.Router.html#method.route)

## Uso de `async`

Sword está construido sobre `axum`, que utiliza `tokio` como runtime asíncrono. Por lo tanto, todos los métodos de los controladores deben ser `async`, incluso si no realizan operaciones asíncronas dentro del cuerpo del método.

## Uso de `&self`

Como te habrás percatado, los métodos de los controladores reciben `&self` como primer parámetro. Esto permite que los controladores puedan inyectar dependencias a través de sus campos. Sin embargo, este tema se abordará en detalle en la sección de [Inyección de Dependencias](../dependency-injection.md).
