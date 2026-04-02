# Configuración Personalizada

Sword permite definir configuraciones propias además de la configuración base del framework. Esto es útil cuando la aplicación necesita parámetros específicos de dominio o de integración.

Además, el sistema de configuración soporta capacidades generales como interpolación de variables de entorno y carga de contenido desde archivos.

## Usando la macro `#[config]`

Para crear una configuración personalizada, debes marcar tu struct con la macro `#[config]` e indicar la clave TOML donde se cargará esa configuración:

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

## Traits requeridos

Para que un struct pueda usarse como configuración personalizada, debe derivar o implementar estos traits:

- `Debug`
- `Clone`
- `Deserialize`

La macro `#[config(key = "...")]` genera automáticamente:

- la implementación de `ConfigItem`
- la implementación de `TryFrom<&State>` para inyección de dependencias
- el registro automático en el estado durante la inicialización

## Estructura en el archivo TOML

La configuración personalizada debe existir bajo la clave indicada en `#[config(key = "...")]`.

```toml
[application]
host = "0.0.0.0"
port = 8080

[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

## Interpolación de variables de entorno

La carga de configuración soporta interpolación directa de variables de entorno.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

La sintaxis es `${VARIABLE_NAME:default_value}`.

Si no se especifica un valor por defecto y la variable no existe, la carga falla.

## Cargar contenido desde archivos

`thisconfig` permite cargar contenido de archivos dentro del TOML mediante el prefijo `file:`.

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

Esto es útil para secretos, certificados o claves privadas.

## Alcance de estas capacidades

La interpolación de variables de entorno y la carga con `file:` pertenecen al sistema de configuración basado en `thisconfig`, no a una sección concreta del TOML.

Por eso pueden utilizarse tanto en configuraciones personalizadas como en la configuración base del framework.
