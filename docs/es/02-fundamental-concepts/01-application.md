---
title: "Aplicación"
description: "Cómo construir, ejecutar y arrancar una aplicación Sword: constructor, instancia y función main."
outline: [2, 3]
---

# La aplicación Sword

El punto central de una aplicación Sword es la estructura `Application`. Esta estructura representa la instancia de tu aplicación y proporciona métodos para construirla, configurarla y ejecutarla.

## Construcción de la Aplicación

Sword usa un patrón constructor para crear aplicaciones. Se implementa en la estructura `ApplicationBuilder`, que permite configurar aspectos de la aplicación de forma fluida antes de construir la instancia de `Application`.

El flujo consiste en llamar a `Application::builder()` y encadenar métodos:

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();
```

Internamente, el método `builder()`:

- Inicializa el estado compartido de la aplicación.
- Carga la configuración desde el fichero TOML.

<ApiSection title="API Reference: Métodos y atributos de la estructura 'ApplicationBuilder'">

#### Acceso a la configuración de la aplicación

```rust
pub config: Config
```

Atributo público que permite acceder a la configuración de la aplicación cargada desde el fichero de configuración. Para más detalles, revisa la sección de [Configuración](./configuration).

#### Registro de módulos

Registra un módulo que implementa el trait `Module`. Los módulos agrupan controladores, componentes y proveedores relacionados. [Ver más](./modules)

```rust
pub fn with_module<M: Module>(self) -> Self
```

**Parámetros**

- `M`: un tipo que implementa el trait `Module`.

---

#### Registro de 'Tower Layers'

Registra un `Layer` de Tower de forma global en la aplicación.

```rust
pub fn with_layer<L>(mut self, layer: L) -> Self
```

**Parámetros**

- `layer`: una instancia que implementa el trait `Layer`.

**Ejemplo**

```rust
use tower_http::cors::*;

let cors_layer = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(vec!["GET", "POST"]);

let app = Application::builder()
    .with_layer(cors_layer)
    .build();
```

Para más detalles sobre Tower, revisa [Interceptores en controladores web](/es/practical-guides/web/interceptors).

---

#### Construir desde una ruta de configuración personalizada

Carga la configuración de la aplicación desde un fichero `.toml` ubicado en una ruta personalizada.

```rust
pub fn from_config_path<P: AsRef<Path>>(path: P) -> ApplicationBuilder
```

---

#### Construir desde una instancia de la estructura 'Config'

Carga la configuración de la aplicación a partir de una instancia de `Config` creada manualmente.

```rust
pub fn from_config(config: Config) -> Self
```

---

#### Construir la aplicación

Finaliza la construcción del `ApplicationBuilder` y retorna una instancia de `Application` lista para ejecutarse.

```rust
pub fn build(mut self) -> Application
```

</ApiSection>

## Instancia de la Aplicación

Al construir una instancia de `Application`, con el método `build()`, puedes ejecutarla con el método `run()`:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

<ApiSection title="API Reference: Métodos y atributos de la estructura 'Application'">

#### Iniciar la aplicación

Inicia el núcleo del tipo de aplicación seleccionado y comienza a escuchar solicitudes.

```rust
pub async fn run(&self)
```

Si la opción `graceful-shutdown` está activada, la aplicación maneja las señales de terminación de forma elegante, permitiendo que las solicitudes en curso se completen antes de apagarse.

---

#### Acceso al router interno

Disponible para aplicaciones Web y Socket.IO, devuelve un clon del router (`axum::Router`) interno de la aplicación.

```rust
pub fn router(&self) -> axum::Router
```

Es útil para operaciones avanzadas o para inspeccionar la configuración de rutas.

**Ejemplo**

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router: axum::Router = app.router();
```

</ApiSection>

## La función 'main'

En Rust, la ejecución de un programa comienza en la función `main`. En frameworks asíncronos, esa función debe marcarse con un atributo especial.

Sword provee la macro `#[sword::main]`, que inicializa el runtime interno de la aplicación con `tokio` y ejecuta la función `main` de manera asíncrona:

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

Además, al usar este enfoque no necesitas agregar `tokio` como dependencia en tu proyecto, salvo que lo necesites explícitamente para otras funcionalidades.
