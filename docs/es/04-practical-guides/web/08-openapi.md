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

Sword puede servir archivos de especificación OpenAPI y montar Swagger UI con **cero código** — solo habilita el feature y agrega configuración.

## Habilitando el Feature

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

## Cómo Funciona

- Las especificaciones se sirven en `/openapi/{filename}`
- Swagger UI se monta en `/docs`
- Formatos soportados: `.yaml`, `.yml`, `.json`

Una vez configurado, navega a `/docs` en tu navegador para explorar tu API interactivamente.

## Ejemplo Completo

```yaml
# config/openapi.yaml
openapi: "3.0.0"
info:
  title: "Mi API"
  version: "1.0.0"
paths:
  /users:
    get:
      summary: "Listar usuarios"
      responses:
        "200":
          description: "Lista de usuarios"
```

## Múltiples Especificaciones

Puedes servir múltiples archivos de especificación — cada uno obtiene su propia entrada en `/openapi/{filename}` y es seleccionable desde el menú desplegable de Swagger UI.

## Véase También

- [Controladores Web](/es/application-components/controllers/web-controllers)
- [Manejo de Respuestas](/es/practical-guides/web/response-handling)
