---
title: "Configuration"
description: "Configuring a web application in Sword: the [web] section and its additional settings."
outline: [2, 3]
---

# Configuration

On top of the application's common configuration (see [Configuration](/en/fundamental-concepts/configuration)), a web application is tuned with the `[web]` section.

## `[web]` section

This applies to `web` and `socketio` applications.

| Key               | Type                           | Default     | Description                                                             |
| ----------------- | ------------------------------ | ----------- | ----------------------------------------------------------------------- |
| `host`            | `String`                       | `"0.0.0.0"` | Bind host or IP for the web application                                 |
| `port`            | `u16`                          | `8000`      | Web application port                                                    |
| `router-prefix`   | `Option<String>`               | `None`      | Global prefix for web routes                                            |
| `request-timeout` | `Option<RequestTimeoutConfig>` | `None`      | Timeout configuration for web controllers                               |
| `body-limit`      | `Option<BodyLimitConfig>`      | `10MB`      | Body size limit configuration for web request extraction                |

::: details TOML example

```toml
[web]
host = "0.0.0.0"
port = 8000
router-prefix = "/api"
body-limit = "2MB"
request-timeout = { enabled = true, timeout = "30s" }
```

:::

## Additional settings

- **Access logger** (`[web.logger]`): see [Access Logger](/en/practical-guides/web/access-logger).
- **OpenAPI** (`[web.openapi]`): see [OpenAPI & Swagger UI](/en/practical-guides/web/openapi).
