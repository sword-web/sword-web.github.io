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

You can serve OpenAPI specification files and mount Swagger UI with **zero code**, just enable the feature and add configuration.

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

Once configured, navigate to `/docs` in your browser to explore your API interactively.

:::details Note on the specification path
If you have a `router-prefix` configured, it will affect the specification path.
:::

## Multiple Specs

You can serve multiple specification files — each one gets its own entry in the URL and is selectable from the Swagger UI dropdown.
