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

- Inicializa el runtime interno del tipo de aplicación seleccionada.
- Inicializa el estado compartido de la aplicación.
- Carga la configuración desde el fichero `.toml`.

<ApiSection title="Métodos y atributos de la estructura ApplicationBuilder">

#### Atributo `config`

```rust
pub config: Config
```

Atributo público que permite acceder a la configuración de la aplicación cargada desde el fichero de configuración. Para más detalles, revisa la sección de [Configuración](./configuration).

#### Método `with_module::<M>()`

```rust
pub fn with_module<M>(self) -> Self
where
    M: Module,
```

Registra un módulo que implementa el trait `Module`. Los módulos agrupan controladores, componentes y proveedores relacionados.

**Parámetros**

- `M`: un tipo que implementa el trait `Module`.

Aprende más en la sección de [Módulos](./modules).

#### Método `with_layer::<L>(layer: L)`

```rust
pub fn with_layer<L>(mut self, layer: L) -> Self
```

Registra un `Layer` de Tower de forma global en la aplicación.

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

#### Método `from_config_path::<P>(path: P)`

```rust
pub fn from_config_path<P: AsRef<Path>>(path: P) -> ApplicationBuilder
```

Carga la configuración de la aplicación desde un fichero `.toml` ubicado en una ruta personalizada.

#### Método `from_config(config: Config)`

```rust
pub fn from_config(config: Config) -> Self
```

Carga la configuración de la aplicación a partir de una instancia de `Config` creada manualmente.

#### Método `build()`

```rust
pub fn build(mut self) -> Application
```

Finaliza la construcción del `ApplicationBuilder` y devuelve una instancia de `Application` lista para ejecutarse.

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

<ApiSection title="Métodos y atributos de la estructura Application">

#### Método `run()`

```rust
pub async fn run(&self)
```

Inicia el núcleo del tipo de aplicación seleccionado y comienza a escuchar solicitudes.

Si la opción `graceful-shutdown` está activada, la aplicación maneja las señales de terminación de forma elegante, permitiendo que las solicitudes en curso se completen antes de apagarse.

#### Método `router()`

```rust
pub fn router(&self) -> axum::Router
```

Devuelve un clon del router (`axum::Router`) interno de la aplicación. Es útil para operaciones avanzadas o para inspeccionar la configuración de rutas.

Solo está disponible si habilitaste las features `web` o `socketio`.

**Ejemplo**

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router: axum::Router = app.router();
```

</ApiSection>

## La función `main`

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
