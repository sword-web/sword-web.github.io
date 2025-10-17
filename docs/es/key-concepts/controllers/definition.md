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
