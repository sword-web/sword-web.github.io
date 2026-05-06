---
title: "Configuración Personalizada"
description: "Sword permite definir configuraciones propias además de la configuración base del framework."
outline: [2, 3]
---
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

## Unidades Especiales

Gracias a `thisconfig`, es posible usar unidades legibles por humanos para configurar tamaños y duraciones. Estas unidades son `ByteConfig` para tamaños en bytes y `TimeConfig` para duraciones temporales.

Estas estructuras no guardan solo el valor parseado, también conservan el valor crudo (`raw`) para logging y display de configuración.

### Unidad `ByteConfig`

Esta estructura representa tamaños en bytes con formato humano.

```rust
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

- `raw`: string original leída desde TOML (por ejemplo `"10MB"`).
- `parsed`: valor convertido a bytes (`usize`) para uso interno.

##### Ejemplos válidos

```toml
max-payload = "100KB"
body-limit = "1MB"
```

También puedes usar formatos binarios como `KiB`, `MiB`, etc.

### Unidad `TimeConfig`

Esta estructura representa duraciones de tiempo con formato humano.

```rust
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

- `raw`: string original (por ejemplo `"30s"`, `"1h 30m"`).
- `parsed`: `std::time::Duration` listo para aplicar en timeouts, intervalos, etc.

#### Ejemplos válidos

```toml
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

### Formatos

- `ByteConfig` ver documentación de [byte-unit](https://docs.rs/byte-unit/latest)
- `TimeConfig` ver documentación de [duration_str](https://docs.rs/duration_str/latest/)
