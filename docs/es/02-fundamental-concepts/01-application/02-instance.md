---
title: "Application Structure - Sword Framework"
description: "Learn about Sword's Application and ApplicationBuilder structures. Master the Builder pattern for configuring web applications in Rust."

keywords:
    [
        "application structure",
        "builder pattern",
        "sword framework",
        "rust web app",
        "application configuration",
    ]
---
# La estructura `Application`

Una vez que hayas construido una instancia de `Application` utilizando el patrón builder, puedes ejecutarla con el método `run()`:

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

El método `run()` inicia el servidor web y comienza a escuchar las solicitudes HTTP entrantes. Si has habilitado la opción `graceful-shutdown` en tu configuración, la aplicación manejará las señales de terminación de manera elegante, permitiendo que las solicitudes en curso se completen antes de apagarse.

### Métodos y atributos de la estructura

#### Atributo `config`

Atributo público que permite acceder a la configuración de la aplicación cargada desde el fichero de configuración.

<hr/>

#### Método `router()`

Retorna una clon del router (`axum::Router`) interno de la aplicación. Esto es útil si necesitas acceder al enrutador para operaciones avanzadas o para inspeccionar la configuración de rutas.

::: info
Solo disponible si has habilitado los features `web` o `socketio` en tu proyecto.
:::

##### Ejemplo

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router: axum::Router = app.router();
```

<hr/>

#### Método `run()`

Inicia la aplicación sword y los controladores asociados a ella.

Si has habilitado la opción `graceful-shutdown` en tu configuración, la aplicación manejará las señales de terminación de manera elegante, permitiendo que las solicitudes en curso se completen antes de apagarse.

##### Ejemplo

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

<hr/>

#### Apagado elegante

Sword gestiona el apagado elegante mediante la opción `graceful-shutdown` en la configuración de la aplicación.

```toml
[application]
graceful-shutdown = true
```

Cuando esta opción está activada, `app.run().await` inicia el servidor con el manejo de señales integrado del framework.
