---
title: "Configuración"
description: "Configuración común de una aplicación Sword: la estructura Config, la sección [application] y la configuración personalizada."
outline: [2, 3]
---

# Configuración

Sword usa el crate `thisconfig` para cargar archivos TOML como configuración. Por defecto, el patrón constructor carga `config/config.toml` durante la inicialización. Si el archivo no existe o contiene TOML inválido, la aplicación falla al construirse.

## La estructura `Config`

La estructura `Config` representa la configuración cargada de la aplicación. Se accede a ella desde el campo `config` de una instancia de `ApplicationBuilder` o `Application`, y desde otros componentes mediante inyección de dependencias.

<ApiSection title="Métodos y atributos de la estructura Config">

#### Método `get::<T>()`

```rust
pub fn get<T>(&self) -> Option<T>
where
    T: DeserializeOwned + ConfigItem,
```

Extrae una estructura de configuración y devuelve `Option<T>`.

**Ejemplo**

```rust
let database = config.get::<DatabaseConfig>();
```

#### Método `get_or_default::<T>()`

```rust
pub fn get_or_default<T>(&self) -> T
where
    T: DeserializeOwned + ConfigItem + Default,
```

Extrae la estructura o devuelve su `Default` si no está presente.

**Ejemplo**

```rust
let database = config.get_or_default::<DatabaseConfig>();
```

#### Método `expect::<T>()`

```rust
pub fn expect<T>(&self) -> T
where
    T: DeserializeOwned + ConfigItem,
```

Extrae la estructura o lanza un `panic!` si no está presente. Equivale a `get::<T>().expect("Expected configuration item not found")`.

**Ejemplo**

```rust
let database = config.expect::<DatabaseConfig>();
```

</ApiSection>

## Configuración de la aplicación

Sword establece una configuración general compartida para cualquier tipo de aplicación:

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

Sword permite definir configuraciones propias además de la configuración base del framework. Es útil cuando la aplicación necesita parámetros específicos de dominio o de integración.

Marca una struct con la macro `#[config]` e indica la clave TOML donde se cargará:

:::code-group

```rust [database.rs]
use serde::Deserialize;
use sword::prelude::*;

#[config(key = "database")]
#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    database_url: String,
    max_connections: u32,
}
```

```toml [config.toml]
[database]
database_url = "postgres://user:password@localhost/mydb"
max_connections = 50
```

:::

**Traits requeridos**

Para que un struct se use como configuración personalizada, debe derivar o implementar:

- `Debug`
- `Clone`
- `Deserialize`

La macro genera automáticamente la implementación del trait `ConfigItem` así como el registro de la configuración en el estado de la aplicación.

## Variables de entorno

La carga de configuración soporta interpolación directa de variables de entorno.

```toml
[database]
database_url = "${DATABASE_URL:postgres://localhost/app}"
max_connections = "${DB_MAX_CONNECTIONS:20}"
```

La sintaxis es `${VARIABLE_NAME:default_value}`. Si no se especifica un valor por defecto y la variable no existe, la carga falla.

## Cargar contenido desde archivos

Se permite cargar contenido de archivos dentro del TOML mediante el prefijo `file:`

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

Esto es útil para secretos, certificados o claves privadas.

## Unidades especiales

Gracias a `thisconfig`, puedes usar unidades legibles por humanos para tamaños y duraciones. Estas unidades no solo guardan el valor parseado; también conservan el valor crudo para logging y display.

### Representación de bytes

`ByteConfig` representa tamaños en bytes:

- `raw`: string original leída desde TOML (por ejemplo `"10MB"`).
- `parsed`: valor convertido a bytes (`usize`) para uso interno.

::: code-group

```rust [Rust]
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

```toml [TOML]
max-payload = "100KB"
body-limit = "1MB"
```

:::

También puedes usar formatos binarios como `KiB`, `MiB`, etc. Consulta los formatos disponibles en [`byte-unit`](https://docs.rs/byte-unit/latest/).

### Representación de tiempo

`TimeConfig` representa duraciones:

- `raw`: string original (por ejemplo `"30s"`, `"1h 30m"`).
- `parsed`: `std::time::Duration` listo para timeouts, intervalos, etc.

::: code-group

```rust [Rust]
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

```toml [TOML]
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

:::

Consulta los formatos disponibles en [`duration-str`](https://docs.rs/duration-str/latest/).

## Configuración por tipo de aplicación

La configuración específica de cada tipo de aplicación vive en su guía práctica:

- [Configuración de una aplicación web](/es/practical-guides/web/configuration)
- [Configuración de una aplicación Socket.IO](/es/practical-guides/socketio/configuration)
- [Configuración de una aplicación gRPC](/es/practical-guides/grpc/configuration)
