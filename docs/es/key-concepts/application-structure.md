# La estructura `Application` y `ApplicationBuilder`

Sword utiliza el patrón **Builder** para construir aplicaciones web. Este patrón se implementa a través de dos structs principales:

- **`ApplicationBuilder`**: Una estructura que proporciona una interfaz fluida para configurar la aplicación. Almacena la configuración, middlewares, controladores y otros componentes de forma incremental.
- **`Application`**: La estructura final que representa tu aplicación web construida y lista para ser ejecutada.

## Construcción de la aplicación

El flujo de construcción es simple: llamas a `Application::builder()` para obtener un `ApplicationBuilder`, configuras los componentes de tu aplicación encadenando métodos, y finalmente llamas a `.build()` para obtener la instancia final de `Application`:

```rust
let app = Application::builder()
    .with_controller::<SomeController>()
    .build();
```

### ¿Cómo funciona el patrón Builder?

1. **`Application::builder()`**: Crea un nuevo `ApplicationBuilder` que inicializa:

   - El router interno (vacío al inicio)
   - El estado compartido de la aplicación
   - La configuración cargada desde `config/config.toml`

2. **Métodos de configuración** (`.with_controller()`, `.with_layer()`, etc.): Cada método retorna `self`, permitiendo encadenar llamadas y configurar la aplicación de forma fluida.

3. **`.build()`**: Finaliza la construcción, aplica los middlewares automáticos y retorna una instancia de `Application` lista para ejecutar.

### Métodos del Constructor

Estos son los métodos disponibles en `ApplicationBuilder` para configurar tu aplicación antes de construirla.

#### `with_controller`

Registra un controlador que implementa el trait `Controller`. Los controladores definen las rutas y manejan las solicitudes HTTP.

##### Parámetros

- `C`: Un struct que implementa el trait `Controller`.

##### Ejemplo

```rust
use sword::prelude::*;

#[controller("/api")]
struct SomeController;

#[routes]
impl SomeController {
    #[get("/hello")]
    async fn hello(&self) -> HttpResponse {
        HttpResponse::Ok().message("Hello, World!")
    }
}

let app = Application::builder()
    .with_controller::<SomeController>()
    .build();
```

[Ver más sobre controladores en la sección de [Controladores](../key-concepts/controllers-routes.md)]

#### `with_dependency_container`

Registra un contenedor de dependencias para la aplicación. **IMPORTANTE**: Este método debe ser llamado antes de registrar cualquier controlador.

##### Parámetros

- `container`: Una instancia de `DependencyContainer`.

##### Ejemplo

```rust
let container = DependencyContainer::builder()
    .register_component::<SomeInjectable>()
    .build();

let app = Application::builder()
    .with_dependency_container(container)
    .build();
```

#### `with_layer`

Registra un Layer / Middleware de `tower` global para la aplicación.

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

Ver más sobre middlewares en la sección de [Middlewares](../key-concepts/middlewares/tower.md).

#### `with_prefix`

Registra un prefijo global para todas las rutas de la aplicación.

##### Parámetros

- `prefix`: Una cadena que representa el prefijo a ser registrado.

##### Ejemplo

```rust
let app = Application::builder()
    .with_prefix("/api")
    .with_controller::<SomeController>()
    .build();
```

#### `build`

Finaliza la construcción de `ApplicationBuilder` y devuelve una instancia de `Application` lista para ser ejecutada.

Este método:

- Aplica todos los middlewares configurados (validación de Content-Type, límite de tamaño de cuerpo, etc.)
- Activa la capa de cookies si está habilitada
- Aplica el prefijo de rutas si fue configurado
- Retorna una instancia de `Application` completamente construida

##### Ejemplo

```rust
let app = Application::builder()
    .with_controller::<SomeController>()
    .with_prefix("/api")
    .build();
```

## Ejecución de la aplicación

Una vez que has construido una instancia de `Application` usando el patrón builder, puedes ejecutarla utilizando el método `run()`:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run().await;
}
```

El método `run()` inicia el servidor web y comienza a escuchar solicitudes HTTP entrantes. Si has habilitado la opción `graceful-shutdown` en la configuración, la aplicación manejará señales de terminación de forma segura.

### Métodos útiles de `Application`

#### `router()`

Retorna un clon del router interno de la aplicación. Esto es útil si necesitas acceder al router para realizar operaciones avanzadas o inspeccionar la configuración de rutas.

##### Ejemplo

```rust
let app = Application::builder()
    .with_controller::<SomeController>()
    .build();

let router = app.router();
```

#### `run()`

Inicia el servidor web y comienza a escuchar solicitudes HTTP entrantes.

Si has habilitado la opción `graceful-shutdown` en la configuración, la aplicación manejará señales de terminación de forma segura permitiendo que las solicitudes en curso se completen antes de apagar el servidor.

##### Ejemplo

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run().await;
}
```

#### `run_with_graceful_shutdown()`

Este método permite ejecutar la aplicación con una señal de apagado personalizada.

Ejemplo, quieres escuchar una señal de Ctrl+C para apagar la aplicación de manera segura (proveer tiempo para completar las solicitudes en curso):

Si quieres usar la señal graceful por defecto que provee Sword, habilita la opción `graceful-shutdown` en el fichero de configuración. (Ver [Configuración](../key-concepts/configuration/application.md))

Mientras tanto si quieres usar una señal personalizada, puedes hacerlo de la siguiente manera:

Deshabilita la opción `graceful_shutdown` en el fichero de configuración.

```rust
use tokio::signal;
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run_with_graceful_shutdown(shutdown_signal()).await;
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
```
