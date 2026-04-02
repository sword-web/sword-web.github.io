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

- El runtime interno de la aplicación
- El estado compartido de la aplicación
- Carga de la configuración desde el fichero `.toml`

### Métodos y atributos de la estructura

La estructura tiene campos y metodos clave que te permiten personalizar tu aplicación:

#### Atributo `config`

Atributo público que permite acceder a la configuración de la aplicación cargada desde el fichero de configuración.

<hr/>

#### Método `with_module::<M>()`

Método que registra un módulo que implementa el trait `Module`. Los módulos definen puntos de entrada para agrupar controladores, componentes y proveedores relacionados.

##### Parámetros

- `M`: Un tipo que implementa el trait `Module`.

Learn more about modules in the [Modules](../../application-components/modules) section.

<hr/>

#### Método `with_layer::<L>(layer: L)`

Registra un `Layer` de Tower de forma global en la aplicación.

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

Para más detalles sobre Tower, revisa la sección de [Layers con Tower](/es/application-components/interceptors/tower).

<hr/>

#### Método `from_config_path<P: AsRef<Path>>(path: P)`

Permite cargar la configuración de la aplicación desde un fichero `.toml` ubicado en una ruta personalizada.

<hr/>

#### Método `from_config(config: Config)`

Permite cargar la configuración de la aplicación a partir de una instancia de `Config` creada manualmente.

<hr/>

#### Método `build()`

Finaliza la construcción del `ApplicationBuilder` y devuelve una instancia de `Application` lista para ejecutarse.
