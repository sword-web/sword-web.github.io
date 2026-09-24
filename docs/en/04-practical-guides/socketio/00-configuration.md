---
title: "Configuration"
description: "Configuring a Socket.IO application in Sword: the [socketio] section."
outline: [2, 3]
---

# Configuration

On top of the common configuration (see [Configuration](/en/fundamental-concepts/configuration)), a Socket.IO application adds the `[socketio]` section. Since `socketio` depends on the `web` feature, the `[web]` section from the [web guide](/en/practical-guides/web/configuration) also applies.

| Key                   | Type                    | Default                    | Description                               |
| --------------------- | ----------------------- | -------------------------- | ----------------------------------------- |
| `ack-timeout`         | `Option<TimeConfig>`    | `5s`                       | Maximum time for outgoing ACKs            |
| `connect-timeout`     | `Option<TimeConfig>`    | `45s`                      | Time limit to complete initial connection |
| `max-buffer-size`     | `Option<usize>`         | `128`                      | Max buffered packets per connection       |
| `max-payload`         | `Option<ByteConfig>`    | `100KB`                    | Maximum outgoing payload size             |
| `ping-interval`       | `Option<TimeConfig>`    | `25s`                      | Server ping interval                      |
| `ping-timeout`        | `Option<TimeConfig>`    | `20s`                      | Pong timeout before disconnect            |
| `req-path`            | `Option<String>`        | `"/socket.io"`             | HTTP path where Socket.IO is mounted      |
| `transports`          | `Option<Vec<String>>`   | `["polling", "websocket"]` | Allowed transports                        |
| `parser`              | `"common" \| "msgpack"` | `"common"`                 | Payload parser                            |
| `ws-read-buffer-size` | `Option<usize>`         | `4096`                     | WebSocket read buffer size                |

### TOML example

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
