---
title: "Configuration"
description: "Configuring a web application in Sword: the [web] section and its additional settings."
outline: [2, 3]
aside: false
---

# Configuration

On top of the application's common configuration (see [Configuration](/en/fundamental-concepts/configuration)), a web application is tuned with the `[web]` section.

| Key               | Type                           | Default     | Description                                        |
| ----------------- | ------------------------------ | ----------- | -------------------------------------------------- |
| `host`            | `String`                       | `"0.0.0.0"` | Host of the web application                        |
| `port`            | `u16`                          | `8000`      | Port of the web application                        |
| `router-prefix`   | `Option<String>`               | `None`      | Global prefix for the Axum router                  |
| `request-timeout` | `Option<RequestTimeoutConfig>` | `None`      | Timeout for web controllers                        |
| `body-limit`      | `Option<BodyLimitConfig>`      | `10MB`      | Size limit for body extraction in web requests     |

## TOML example

```toml
[web]
host = "0.0.0.0"
port = 8000
router-prefix = "/api"
body-limit = "2MB"
request-timeout = { enabled = true, timeout = "30s" }
```

## Additional settings

- **Access logger** (`[web.logger]`): see [Access Logger](/en/practical-guides/web/access-logger).
- **OpenAPI** (`[web.openapi]`): see [OpenAPI & Swagger UI](/en/practical-guides/web/openapi).
