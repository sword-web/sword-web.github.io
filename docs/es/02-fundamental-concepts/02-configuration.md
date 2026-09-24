---
title: "Configuración"
description: "Configuración común de una aplicación Sword: carga, sección [application], configuración personalizada y extracción."
outline: [2, 3]
---

# Configuración

Sword usa `thisconfig` para cargar uno o varios archivos TOML. Por defecto, el patrón constructor carga `config/config.toml` durante la inicialización. Si el archivo no existe o contiene TOML inválido, la aplicación falla al construirse.

Si necesitas otra ruta, puedes construir la aplicación con `Application::from_config(...)` o `Application::from_config_path(...)`.

## Sección `[application]`

Contiene los valores generales de la aplicación:

| Key                 | Tipo             | Default | Descripción                                                 |
| ------------------- | ---------------- | ------- | ----------------------------------------------------------- |
| `name`              | `Option<String>` | `None`  | Nombre de la aplicación                                     |
| `environment`       | `Option<String>` | `None`  | Nombre del entorno                                          |
| `graceful-shutdown` | `bool`           | `false` | Habilita apagado elegante al recibir señales de terminación |

::: details Ejemplo en formato TOML

```toml
[application]
name = "My Sword App"
environment = "development"
graceful-shutdown = true
```

:::

## Configuración personalizada

Sword permite definir configuraciones propias además de la configuración base del framework. Es útil cuando la aplicación necesita parámetros específicos de dominio o de integración. El sistema también soporta interpolación de variables de entorno y carga de contenido desde archivos.

### Usando la macro `#[config]`

Marca tu struct con la macro `#[config]` e indica la clave TOML donde se cargará:

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

Para que un struct se use como configuración personalizada, debe derivar o implementar:

- `Debug`
- `Clone`
- `Deserialize`

La macro `#[config(key = "...")]` genera automáticamente:

- la implementación de `ConfigItem`;
- la implementación de `TryFrom<&State>` para inyección de dependencias;
- el registro automático en el estado durante la inicialización.

### Estructura en el archivo TOML

La configuración personalizada debe existir bajo la clave indicada en `#[config(key = "...")]`.

```toml
[application]
host = "0.0.0.0"
port = 8080

[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

### Interpolación de variables de entorno

La carga de configuración soporta interpolación directa de variables de entorno.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

La sintaxis es `${VARIABLE_NAME:default_value}`. Si no se especifica un valor por defecto y la variable no existe, la carga falla.

### Cargar contenido desde archivos

`thisconfig` permite cargar contenido de archivos dentro del TOML mediante el prefijo `file:`.

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

Esto es útil para secretos, certificados o claves privadas.

### Unidades especiales

Gracias a `thisconfig`, puedes usar unidades legibles por humanos para tamaños y duraciones: `ByteConfig` para tamaños en bytes y `TimeConfig` para duraciones. No guardan solo el valor parseado; también conservan el valor crudo (`raw`) para logging y display.

**`ByteConfig`** representa tamaños en bytes:

```rust
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

- `raw`: string original leída desde TOML (por ejemplo `"10MB"`).
- `parsed`: valor convertido a bytes (`usize`) para uso interno.

```toml
max-payload = "100KB"
body-limit = "1MB"
```

También puedes usar formatos binarios como `KiB`, `MiB`, etc.

**`TimeConfig`** representa duraciones:

```rust
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

- `raw`: string original (por ejemplo `"30s"`, `"1h 30m"`).
- `parsed`: `std::time::Duration` listo para timeouts, intervalos, etc.

```toml
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

Formatos:

- `ByteConfig`: ver la documentación de [byte-unit](https://docs.rs/byte-unit/latest).
- `TimeConfig`: ver la documentación de [duration_str](https://docs.rs/duration_str/latest/).

## Extracción de configuración

Una vez definida, Sword registra la configuración automáticamente en el estado de la aplicación. Puedes acceder a ella desde una instancia de `ApplicationBuilder` o `Application` con el campo `config`:

- `get::<T>()`: extrae una estructura de configuración y devuelve `Option<T>`.
- `get_or_default::<T>()`: extrae la estructura o devuelve su `Default` si no está presente. Devuelve `T`.
- `expect::<T>()`: extrae la estructura o lanza un `panic!` si no está presente. Devuelve `T`.

`expect::<T>()` equivale a `get::<T>().expect("Expected configuration item not found")`, y es útil cuando una configuración crítica debe estar presente y no quieres manejar su ausencia.

Además, puedes extraer la configuración desde otras partes de la aplicación, como controladores o componentes, mediante inyección de dependencias. Ver la sección de [Inyección de dependencias](/es/fundamental-concepts/dependency-injection).

## Configuración por tipo de aplicación

La configuración específica de cada tipo de aplicación vive en su guía práctica:

- [Configuración de una aplicación web](/es/practical-guides/web/configuration)
- [Configuración de una aplicación Socket.IO](/es/practical-guides/socketio/configuration)
- [Configuración de una aplicación gRPC](/es/practical-guides/grpc/configuration)
