---
title: "Access Logger"
description: "Log one line per request on response with the configurable [web.logger] section."
outline: [2, 3]
---

# Access Logger

Sword can log one line per request once the response is sent: method, uri, status, latency and a truncated request id. This is separate from the global `[tracing]` subscriber and is driven entirely by the `[web.logger]` section.

The logger is off unless the section is present.

## Configuration

```toml
[web.logger]
enabled = true
level = "auto"
skip-paths = ["/api/health"]
log-query = false
```

| Key          | Type           | Default | Description                                           |
| ------------ | -------------- | ------- | ----------------------------------------------------- |
| `enabled`    | `bool`         | `true`  | Enables or disables the logger                        |
| `level`      | `auto \| info` | `auto`  | Log level policy. See [Levels](#levels)               |
| `skip-paths` | `String[]`     | `[]`    | Paths to exclude from logging (exact or prefix match) |
| `log-query`  | `bool`         | `false` | Include the query string in the logged uri            |

## Levels

- `info` logs every request at `INFO` regardless of the status.
- `auto` picks the level from the response status:

| Status        | Level   |
| ------------- | ------- |
| `2xx` / `3xx` | `INFO`  |
| `4xx`         | `WARN`  |
| `5xx`         | `ERROR` |

## Request ID

The logger reuses the `x-request-id` header set by the built-in `RequestIdLayer`. When present, the logger logs only the first 8 characters; otherwise it uses a `-` placeholder.
