---
title: "Access Logger"
description: "Log one line per request on response with the configurable [web.logger] section."
outline: [2, 3]
---

# Access Logger

Sword can log one line per request once the response is sent. The line includes the method, the URI, the status, the latency and the request id. This is separate from the global `[tracing]` subscriber and is driven entirely by the `[web.logger]` section.

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
- `auto` picks the level from the response status.

| Status        | Level   |
| ------------- | ------- |
| `2xx` / `3xx` | `INFO`  |
| `4xx`         | `WARN`  |
| `5xx`         | `ERROR` |

## Log fields

| Field        | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `status`     | HTTP status code.                                                            |
| `latency`    | Time spent handling the request, formatted from `Duration` (e.g. `1.234ms`). |
| `request_id` | First 8 characters of `x-request-id`, or `-` when the header is missing.     |
| message      | `METHOD URI`, including the query string only when `log-query = true`.       |

Requests matching `skip-paths` are neither measured nor logged.

## Request ID

The logger reuses the `x-request-id` header set by the built-in `RequestIdLayer`. When present, it logs only the first 8 characters. Otherwise it uses a `-` placeholder.
