---
title: Configuración de la Aplicación
description: Estructura de la sección [application] para la web app de Sword y separación entre configuración general y configuración web.
outline: [2, 3]
---

# Configuración de la Aplicación

Sword utiliza `thisconfig` para cargar uno o múltiples archivos TOML.

Por defecto, `ApplicationBuilder` carga `config/config.toml` durante la inicialización. Si el archivo no existe o contiene TOML inválido, la aplicación falla durante la construcción.

Si necesitas otra ruta, puedes construir la aplicación con `Application::from_config_path(...)`.

## Sección `[application]`

La configuración principal de la web app se carga desde `[application]`.

Esta sección contiene dos grupos de datos:

- campos generales de `ApplicationConfig`
- configuración web de la aplicación, expuesta en la misma sección mediante `#[serde(flatten)]`

Eso significa que, en TOML, toda esta información vive bajo `[application]`, aunque en código la configuración web esté modelada en un struct separado: `WebApplicationConfig`.

Para la relación entre feature flags y tipo de aplicación, consulta [Tipos de aplicación](/es/fundamental-concepts/application/application-types).

## Ejemplo completo

```toml
[application]
name = "My Sword App"
environment = "development"
graceful-shutdown = false

host = "0.0.0.0"
port = 8080
web-router-prefix = "/api"

[application.request-timeout]
enabled = true
timeout = "15s"
display = true

[application.body-limit]
max-size = "5MB"
display = true
```

## Campos generales

Estos campos pertenecen directamente a `ApplicationConfig`.

| Key | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `name` | `Option<String>` | `None` | Nombre de la aplicación |
| `environment` | `Option<String>` | `None` | Nombre del entorno |
| `graceful-shutdown` | `bool` | `false` | Habilita apagado elegante al recibir señales de terminación |

## Configuración web dentro de `[application]`

Estos campos pertenecen conceptualmente a `WebApplicationConfig`, pero se serializan dentro de `[application]` mediante `flatten`.

| Key | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `host` | `String` | `"0.0.0.0"` | Host o IP de bind de la aplicación web |
| `port` | `u16` | `8000` | Puerto de la aplicación web |
| `web-router-prefix` | `Option<String>` | `None` | Prefijo global para rutas web |

## Subtablas de configuración web

Además de los campos simples anteriores, la configuración web expone dos subtablas bajo la misma sección `[application]`.

### `[application.request-timeout]`

Configura el timeout aplicado a controladores web.

```toml
[application.request-timeout]
enabled = true
timeout = "15s"
display = true
```

### `[application.body-limit]`

Configura el límite de tamaño para extracción de body en requests web.

```toml
[application.body-limit]
max-size = "5MB"
display = true
```

## Nota de implementación

En código, la relación es esta:

- `ApplicationConfig` define los campos generales
- `WebApplicationConfig` define la configuración específica del runtime web
- `ApplicationConfig` incluye `WebApplicationConfig` mediante `#[serde(flatten)]`

Por eso `host`, `port`, `web-router-prefix`, `request-timeout` y `body-limit` forman parte de la configuración de la aplicación en TOML, aunque no sean campos generales del runtime.
