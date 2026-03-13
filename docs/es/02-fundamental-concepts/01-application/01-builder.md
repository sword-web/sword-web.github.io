# La estructura `ApplicationBuilder`

Sword usa un patrón **Builder** para construir aplicaciones web. Este patrón se implementa en la estructura `ApplicationBuilder`, que te permite configurar varios aspectos de tu aplicación de manera fluida antes de construir finalmente la instancia de `Application`.

## Construcción de la Aplicación

El flujo de construcción es sencillo: llamas a `Application::builder()` para obtener un `ApplicationBuilder`, configuras los componentes de tu aplicación encadenando métodos, y finalmente llamas a `.build()` para obtener la instancia final de `Application`:

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();
```

### ¿Cómo funciona el patrón Builder?

**Application::builder()**: Crea un nuevo `ApplicationBuilder` que inicializa:

- El enrutador interno
- El estado compartido de la aplicación
- Carga de la configuración desde el fichero `.toml`

### Métodos y atributos de la estructura

La estructura tiene campos y metodos clave que te permiten personalizar tu aplicación:

#### `config`

Atributo público que permite acceder a la configuración de la aplicación cargada desde el fichero de configuración.

<hr/>

#### `with_module::<M>()`

Método que registra un módulo que implementa el trait `Module`. Los módulos definen puntos de entrada para agrupar gateways, componentes y proveedores relacionados.

##### Parameters

- `M`: Un tipo que implementa el trait `Module`.

Learn more about modules in the [Modules](../../application-components/modules) section.

<hr/>

#### `with_layer::<L>(layer: L)`

Registra un `Layer` de Tower middleware de forma global en la aplicación.

##### Parámetros

- `layer`: Una instancia que implementa el trait `Layer`.

##### Ejemplo

```rust
use tower_http::cors::*;

let cors_layer = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(vec!["GET", "POST"]);

let app = Application::builder()
    .with_layer(cors_layer)
    .build();
```

Learn more about middleware in the [Middleware](/es/application-components/middlewares/tower) section.

<hr/>

#### `build()`

Finaliza la construcción del `ApplicationBuilder` y devuelve una instancia de `Application` lista para ejecutarse.
