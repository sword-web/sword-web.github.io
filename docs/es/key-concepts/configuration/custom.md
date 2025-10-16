# Configuración Personalizada

Sword permite crear tus propias configuraciones personalizadas más allá de la configuración de aplicación por defecto. Esto es útil cuando tu aplicación necesita parámetros adicionales específicos de tu lógica de negocio.

## Usando la macro `#[config]`

Para crear una configuración personalizada, debes marcar tu struct con la macro `#[config]` y especificar la clave TOML donde se encontrará esa configuración:

```rust
use serde::{Deserialize};
use sword::prelude::*;

#[derive(Debug, Clone, Deserialize)]
#[config(key = "my-custom-section")]
pub struct MyConfig {
    database_url: String,
    max_connections: u32,
    debug_mode: bool,
}
```

### Traits requeridos

Para que un struct pueda ser usado como configuración personalizada, debe derivar (o implementar) los siguientes traits:

- **`Debug`**: Necesario si deseas imprimir o registrar la configuración para depuración.
- **`Clone`**: La configuración se clona en el estado de la aplicación.
- **`Deserialize`**: De `serde`. Permite deserializar el struct desde el TOML.

La macro `#[config(key = "...")]` genera automáticamente:

- La implementación del trait `ConfigItem`
- La implementación de `TryFrom<&State>` para inyección de dependencias
- El registro automático en el estado de la aplicación durante la inicialización

## Estructura en el fichero de configuración

La configuración personalizada debe estar en el fichero `config/config.toml` bajo la clave especificada:

```toml
[application]
host = "0.0.0.0"
port = 8080
# ... otra configuración de aplicación ...

[my-custom-section]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
debug_mode = true
```

## Obtener valores desde la configuración

Una vez que has definido tu configuración personalizada, Sword se encarga de registrarla automáticamente en el estado de la aplicación. Puedes acceder a ella de varias formas:

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder();
    let my_app_conf = app.config::<ApplicationConfig>()
        .expect("Failed to get app config");

    dbg!(my_app_conf);

    let app = app
        .with_controller::<AppController>()
        .build();

    app.run().await;
}
```

Además, puedes extraer la configuración desde otras partes de tu aplicación, como controladores o servicios, usando inyección de dependencias. Ver la sección de [Inyección de Dependencias](../dependency-injection.md) para más detalles.
