---
title: "Configuración"
description: "Cómo configurar una aplicación Sword: secciones base, configuración por tipo de aplicación, configuración personalizada y extracción."
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

## Configuración por tipo de aplicación

Como se explica en [Tipos de aplicación](/es/fundamental-concepts/application/application-types), Sword tiene tres tipos de aplicación (Web, Socket.IO y gRPC). Cada uno aporta su propia sección de configuración.

### Sección `[web]`

Aplica a aplicaciones `web` y `socketio`.

| Key               | Tipo                           | Default     | Descripción                                                               |
| ----------------- | ------------------------------ | ----------- | ------------------------------------------------------------------------- |
| `host`            | `String`                       | `"0.0.0.0"` | Host o IP de bind de la aplicación web                                    |
| `port`            | `u16`                          | `8000`      | Puerto de la aplicación web                                               |
| `router-prefix`   | `Option<String>`               | `None`      | Prefijo global para rutas web                                             |
| `request-timeout` | `Option<RequestTimeoutConfig>` | `None`      | Configuración de timeout para controladores web                           |
| `body-limit`      | `Option<BodyLimitConfig>`      | `10MB`      | Configuración de límite de tamaño para extracción de body en requests web |

::: details Ejemplo en formato TOML

```toml
[web]
host = "0.0.0.0"
port = 8000
router-prefix = "/api"
body-limit = "2MB"
request-timeout = { enabled = true, timeout = "30s" }
```

:::

### Sección `[socketio]`

En Sword, `socketio` depende de la feature `web`. Al usarla, configuras la aplicación como web y luego agregas la sección propia de Socket.IO.

| Key                   | Tipo                    | Default                    | Descripción                                   |
| --------------------- | ----------------------- | -------------------------- | --------------------------------------------- |
| `ack-timeout`         | `Option<TimeConfig>`    | `5s`                       | Tiempo máximo para ACK saliente               |
| `connect-timeout`     | `Option<TimeConfig>`    | `45s`                      | Límite para completar la conexión inicial     |
| `max-buffer-size`     | `Option<usize>`         | `128`                      | Máximo de paquetes en buffer por conexión     |
| `max-payload`         | `Option<ByteConfig>`    | `100KB`                    | Tamaño máximo de payload saliente             |
| `ping-interval`       | `Option<TimeConfig>`    | `25s`                      | Intervalo de ping del servidor                |
| `ping-timeout`        | `Option<TimeConfig>`    | `20s`                      | Tiempo de espera de pong antes de desconectar |
| `req-path`            | `Option<String>`        | `"/socket.io"`             | Ruta HTTP donde se monta Socket.IO            |
| `transports`          | `Option<Vec<String>>`   | `["polling", "websocket"]` | Transportes permitidos                        |
| `parser`              | `"common" \| "msgpack"` | `"common"`                 | Parser de payloads                            |
| `ws-read-buffer-size` | `Option<usize>`         | `4096`                     | Tamaño del buffer de lectura websocket        |

::: details Ejemplo en formato TOML

```toml
[socketio]
ack-timeout = "5s"
connect-timeout = "45s"
max-buffer-size = 128
max-payload = "100KB"
ping-interval = "25s"
ping-timeout = "20s"
req-path = "/socket.io"
transports = ["polling", "websocket"]
parser = "common"
ws-read-buffer-size = 4096
```

:::

### Sección `[grpc]`

Aplica a aplicaciones gRPC y no se relaciona con aplicaciones web.

| Key                       | Tipo                          | Default     | Descripción                                                                |
| ------------------------- | ----------------------------- | ----------- | -------------------------------------------------------------------------- |
| `host`                    | `String`                      | `"0.0.0.0"` | Host o IP de bind del servidor gRPC                                        |
| `port`                    | `u16`                         | `50051`     | Puerto del servidor gRPC                                                   |
| `enable-tonic-reflection` | `bool`                        | `false`     | Habilita el servicio de reflection de tonic                                |
| `body-limit`              | `Option<GrpcBodyLimitConfig>` | `10MB`      | Configuración de límite de tamaño para mensajes gRPC entrantes y salientes |

::: details Ejemplo en formato TOML

```toml
[grpc]
host = "0.0.0.0"
port = 50051
enable-tonic-reflection = true
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
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

## Configuración adicional por tipo de aplicación

Las secciones anteriores cubren la configuración base. Cada tipo de aplicación suma ajustes propios que se documentan en sus guías prácticas:

- **Web:** logger de acceso (`[web.logger]`) en [Access Logger](/es/practical-guides/web/access-logger) y `[web.openapi]` en [OpenAPI y Swagger UI](/es/practical-guides/web/openapi).
- **gRPC:** logger de acceso (`[grpc.logger]`) en [Access Logger](/es/practical-guides/grpc/access-logger) y reflection de `[grpc]` en [Inspección con grpcurl](/es/practical-guides/grpc/service-inspection-grpcurl).
- **Socket.IO:** sus opciones se cubren en la sección `[socketio]` de esta página.
