# Configuración Personalizada

Sword permite crear tus propias configuraciones personalizadas más allá de la configuración de aplicación por defecto. Esto es útil cuando tu aplicación necesita parámetros adicionales específicos de tu lógica de negocio.

## Usando la macro `#[config]`

Para crear una configuración personalizada, debes marcar tu struct con la macro `#[config]` y especificar la clave TOML donde se encontrará esa configuración:

```rust
use serde::Deserialize;
use sword::prelude::*;

#[config(key = "database")]
#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    database_url: String,
    max_connections: u32,
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

[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```
