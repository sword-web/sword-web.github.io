# Definición de Controladores

Un controlador es comunmente conocido como una función que maneja una solicitud HTTP y devuelve una respuesta HTTP. En sword manejamos los controladores como `structs`, sus metodos son los que manejan las solicitudes HTTP.

Notarás que este es un enfoque diferente al de otros frameworks web en Rust, donde los controladores son funciones. Este enfoque orientado a objetos permite agrupar funcionalidades relacionadas dentro de un mismo controlador, facilitando la organización y el mantenimiento del código.

## Definiendo un Controlador

Para definir un controlador, debes crear un `struct` y luego marcarla utilizando la macro `#[controller]`.

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

... asumiendo la función main y otras importaciones ...

Application::builder()
    .with_controller::<ApiController>()
    .build()

```

### Atributos de la Macro `#[controller]`

#### `path`

El atributo `path` define el prefijo de ruta para todas las rutas dentro del controlador. En el ejemplo anterior, todas las rutas definidas en `ApiController` tendrán el prefijo `/api`.

### `version`

El atributo `version` permite definir una versión para el controlador, que se incluirá en la ruta. Por ejemplo:

```rust
#[controller("/api", version = "v1")]
struct ApiController;
```

Esto es equivalente a definir el controlador con el prefijo `/api/v1`. Sin embargo aporta semántica adicional, indicando que este controlador pertenece a la versión 1 de la API.

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

Un controlador puede tener acceso a la `request` mediante el parámetro `req: Request`:

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

Para conocer todas las funcionalidades de `Request`, ver [Manejo de Requests](../request-handling/explanation.md).

## Métodos HTTP soportados

De momento, sword soporta los metódos HTTP más comunes:

- `#[get("...")]`
- `#[post("...")]`
- `#[put("...")]`
- `#[delete("...")]`
- `#[patch("...")]`

### Sintaxis de las rutas

Las rutas pueden incluir parámetros, que se definen encerrando el nombre del parámetro entre llaves `{}`. Por ejemplo, en la ruta `/users/{id}`, `{id}` es un parámetro que puede ser extraído desde el path de la request.

Para más detalles sobre la sintaxis de las rutas, puedes [consultar la documentación de axum](https://docs.rs/axum/latest/axum/routing/struct.Router.html#method.route)

## Uso de `async`

Sword está construido sobre `axum`, que utiliza `tokio` como runtime asíncrono. Por lo tanto, todos los métodos de los controladores deben ser `async`, incluso si no realizan operaciones asíncronas dentro del cuerpo del método.

## Uso de `&self`

Como te habrás percatado, los métodos de los controladores reciben `&self` como primer parámetro. Esto permite que los controladores puedan inyectar dependencias a través de sus campos. Sin embargo, este tema se abordará en detalle en la sección de [Inyección de Dependencias](../dependency-injection/index.md).
