---
title: Application Structure - Sword Framework
description: Learn about Sword's Application and ApplicationBuilder structures. Master the Builder pattern for configuring web applications in Rust.
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

#### `config`

Atributo público que permite acceder a la configuración de la aplicación cargada desde el fichero de configuración.

<hr/>

#### `router()`

Devuelve una copia del enrutador interno de la aplicación. Esto es útil si necesitas acceder al enrutador para operaciones avanzadas o para inspeccionar la configuración de rutas.

##### Ejemplo

```rust
let app = Application::builder()
    .with_module::<SomeModule>()
    .build();

let router = app.router();
```

<hr/>

#### `run()`

Inicia el servidor web y comienza a escuchar las solicitudes HTTP entrantes.

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

#### `run_with_graceful_shutdown()`

Este método te permite ejecutar la aplicación con una señal de apagado personalizada.

Por ejemplo, si quieres escuchar una señal de Ctrl+C para apagar tu aplicación de manera elegante (permitiendo que las solicitudes en curso se completen):

Si quieres usar la señal de `graceful-shutdown` predeterminada proporcionada por Sword, habilita la opción `graceful-shutdown` en tu archivo de configuración. (Ver [Configuración](/es/fundamental-concepts/configuration/application))

Si quieres usar una señal personalizada en su lugar, puedes hacerlo así:

Primero, deshabilita la opción `graceful_shutdown` en tu archivo de configuración.

```rust
use tokio::signal;
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
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
