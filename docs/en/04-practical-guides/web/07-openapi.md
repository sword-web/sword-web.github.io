---
title: "OpenAPI & Swagger UI"
description: "Serve OpenAPI specifications and mount Swagger UI with zero code — just add configuration."
outline: [2, 3]
keywords:
    [
        "openapi",
        "swagger",
        "swagger ui",
        "api documentation",
        "spec",
        "yaml",
        "json",
        "sword web",
    ]
---

# OpenAPI & Swagger UI

Sword can serve OpenAPI specification files and mount Swagger UI with **zero code** — just enable the feature and add configuration.

## Enabling the Feature

```toml
[dependencies]
sword = { features = ["swagger-ui"] }
```

## Configuration

Add the `[web.openapi]` section to `config/config.toml`:

```toml
[web.openapi]
title = "My API"
version = "1.0.0"
spec-file-paths = ["config/openapi.yaml", "config/openapi-test.yaml"]
```

## How It Works

- Specs are served at `/openapi/{filename}`
- Swagger UI is mounted at `/docs`
- Supported formats: `.yaml`, `.yml`, `.json`

Once configured, navigate to `/docs` in your browser to explore your API interactively.

## Full Example

```yaml
# config/openapi.yaml
openapi: "3.0.0"
info:
  title: "My API"
  version: "1.0.0"
paths:
  /users:
    get:
      summary: "List users"
      responses:
        "200":
          description: "A list of users"
```

## Multiple Specs

You can serve multiple specification files — each one gets its own entry at `/openapi/{filename}` and is selectable from the Swagger UI dropdown.

## See Also

- [Web Controllers](/en/application-components/controllers/web-controllers)
- [Response Handling](/en/practical-guides/web/response-handling)
