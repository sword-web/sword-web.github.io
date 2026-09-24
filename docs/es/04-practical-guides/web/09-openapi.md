---
title: "OpenAPI y Swagger UI"
description: "Sirve especificaciones OpenAPI y monta Swagger UI con cero código — solo agrega configuración."
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

# OpenAPI y Swagger UI

Puedes servir archivos de especificación OpenAPI y montar Swagger UI con **cero código**, solo habilita el feature y agrega la configuración.

```toml
[dependencies]
sword = { features = ["swagger-ui"] }
```

## Configuración

Agrega la sección `[web.openapi]` en `config/config.toml`:

```toml
[web.openapi]
title = "My API"
version = "1.0.0"
spec-file-paths = ["config/openapi.yaml", "config/openapi-test.yaml"]
```

Una vez configurado, navega a `/docs` en tu navegador para explorar tu API interactivamente.

:::details Nota sobre la ruta de la especificación
Si tienes un `router-prefix` configurado este afectará la ruta de la especificación.
:::

## Múltiples Especificaciones

Puedes servir múltiples archivos de especificación — cada uno obtiene su propia entrada en la url y es seleccionable desde el menú desplegable de Swagger UI.
