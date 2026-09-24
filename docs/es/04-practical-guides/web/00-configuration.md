---
title: "Configuración"
description: "Configuración de una aplicación web en Sword: la sección [web] y sus ajustes adicionales."
outline: [2, 3]
aside: false
---

# Configuración

Además de la configuración común de la aplicación (ver [Configuración](/es/fundamental-concepts/configuration)), una aplicación web se ajusta con la sección `[web]`.

| Key               | Tipo                           | Default     | Descripción                                              |
| ----------------- | ------------------------------ | ----------- | -------------------------------------------------------- |
| `host`            | `String`                       | `"0.0.0.0"` | Host de la aplicación web                                |
| `port`            | `u16`                          | `8000`      | Puerto de la aplicación web                              |
| `router-prefix`   | `Option<String>`               | `None`      | Prefijo global para el enrutador de Axum                 |
| `request-timeout` | `Option<RequestTimeoutConfig>` | `None`      | Timeout para controladores web                           |
| `body-limit`      | `Option<BodyLimitConfig>`      | `10MB`      | Límite de tamaño para extracción de body en requests web |

## Ejemplo en formato TOML

```toml
[web]
host = "0.0.0.0"
port = 8000
router-prefix = "/api"
body-limit = "2MB"
request-timeout = { enabled = true, timeout = "30s" }
```

## Ajustes adicionales

- **Logger de acceso** (`[web.logger]`): ver [Access Logger](/es/practical-guides/web/access-logger).
- **OpenAPI** (`[web.openapi]`): ver [OpenAPI y Swagger UI](/es/practical-guides/web/openapi).
