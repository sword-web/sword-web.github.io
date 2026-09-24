---
title: "Configuración"
description: "Configuración de una aplicación Socket.IO en Sword: la sección [socketio]."
outline: [2, 3]
---

# Configuración

Además de la configuración común (ver [Configuración](/es/fundamental-concepts/configuration)), una aplicación Socket.IO añade la sección `[socketio]`. Como `socketio` depende de la feature `web`, también se aplica la sección `[web]` de la [guía web](/es/practical-guides/web/configuration).

## Sección `[socketio]`

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
