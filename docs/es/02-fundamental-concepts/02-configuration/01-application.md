---
title: "Configuración de la Aplicación"
description: "Estructura de la sección [application] para runtimes web y gRPC en Sword."
outline: [2, 3]
---

# Configuración de la Aplicación

Sword utiliza `thisconfig` para cargar uno o múltiples archivos TOML.

Por defecto, `ApplicationBuilder` carga `config/config.toml` durante la inicialización. Si el archivo no existe o contiene TOML inválido, la aplicación falla durante la construcción.

Si necesitas otra ruta, puedes construir la aplicación con:

- `Application::from_config(...)`.
- `Application::from_config_path(...)`.

## Sección `[application]`

Esta sección contiene valores generales de la aplicación:

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

## Configuración especifica para tipos de Aplicación

Como habrás visto en la sección de [Tipos de aplicación](/es/fundamental-concepts/application/application-types), Sword tiene 2 tipos de aplicación: Web y gRPC. Cada tipo tiene su propia configuración.

### Configuración `[web]`

Esta configuración aplica a aplicaciones web y sus extensiones, como `socketio`.

| Key               | Tipo                           | Default     | Descripción                                                               |
| ----------------- | ------------------------------ | ----------- | ------------------------------------------------------------------------- |
| `host`            | `String`                       | `"0.0.0.0"` | Host o IP de bind de la aplicación web                                    |
| `port`            | `u16`                          | `8000`      | Puerto de la aplicación web                                               |
| `router-prefix`   | `Option<String>`               | `None`      | Prefijo global para rutas web                                             |
| `request-timeout` | `Option<RequestTimeoutConfig>` | `None`      | Configuración de timeout para controladores web                           |
| `body-limit`      | `Option<BodyLimitConfig>`      | `10MB`      | Configuración de límite de tamaño para extracción de body en requests web |

:::details Ejemplo en formato TOML

```toml
[web]
host = "0.0.0.0"
port = 8000
router-prefix = "/api"
body-limit = "2MB"
request-timeout = { enabled = true, timeout = "30s" }
```

:::

### Configuración `[socketio]`

En Sword, `socketio` es una extensión de aplicación web. Por lo tanto, al usarla, debes configurar la aplicación como web, y luego agregar la sección propia para configurar el servidor Socket.IO.

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

```

:::details Ejemplo en formato TOML

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
````

### Configuración `[grpc]`

Esta configuración aplica a aplicaciones gRPC y no se relaciona con aplicaciones web.

| Key                       | Tipo                          | Default     | Descripción                                                                |
| ------------------------- | ----------------------------- | ----------- | -------------------------------------------------------------------------- |
| `host`                    | `String`                      | `"0.0.0.0"` | Host o IP de bind del servidor gRPC                                        |
| `port`                    | `u16`                         | `50051`     | Puerto del servidor gRPC                                                   |
| `enable-tonic-reflection` | `bool`                        | `false`     | Habilita el servicio de reflection de tonic                                |
| `body-limit`              | `Option<GrpcBodyLimitConfig>` | `10MB`      | Configuración de límite de tamaño para mensajes gRPC entrantes y salientes |

:::details Ejemplo en formato TOML

```toml
[grpc]
host = "0.0.0.0"
port = 50051
enable-tonic-reflection = true
body-limit = { max-decoding-message-size = "4MB", max-encoding-message-size = "4MB" }
```

:::
