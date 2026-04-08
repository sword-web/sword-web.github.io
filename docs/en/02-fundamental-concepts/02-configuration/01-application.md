---
title: Application Configuration
description: Structure of the [application] section for Web and gRPC runtimes in Sword.
outline: [2, 3]
---

# Application Configuration

Sword uses `thisconfig` to load one or multiple TOML files.

By default, `ApplicationBuilder` loads `config/config.toml` during initialization. If the file does not exist or contains invalid TOML, the application will fail to build.

If you need a different path, you can build the application using `Application::from_config_path(...)`.

## The `[application]` Section

The main Sword configuration is loaded from the `[application]` section.

This section contains:

- General fields from `ApplicationConfig`.
- Configuration for the active runtime (Web or gRPC), exposed via `#[serde(flatten)]`.

This means that in the TOML file, all this information lives under `[application]`, even though in the code, each runtime's configuration is modeled as separate structs (`WebApplicationConfig` and `GrpcApplicationConfig`).

For more details on the relationship between feature flags and application types, see [Application Types](/en/fundamental-concepts/application/application-types).

## Complete Example

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

## gRPC Example

```toml
[application]
name = "My Sword gRPC App"
environment = "development"
graceful-shutdown = true

host = "0.0.0.0"
port = 50051
enable-tonic-reflection = true

[application.body-limit]
max-decoding-message-size = "2 MiB"
max-encoding-message-size = "2 MiB"
display = true
```

## General Fields

These fields belong directly to `ApplicationConfig`.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `Option<String>` | `None` | Application name. |
| `environment` | `Option<String>` | `None` | Environment name (e.g., "production", "development"). |
| `graceful-shutdown` | `bool` | `false` | Enables graceful shutdown when receiving termination signals. |

## Web Configuration within `[application]`

These fields conceptually belong to `WebApplicationConfig` but are serialized within `[application]` via `flatten`.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | `String` | `"0.0.0.0"` | Host or IP for the web application bind. |
| `port` | `u16` | `8000` | Port for the web application. |
| `web-router-prefix` | `Option<String>` | `None` | Global prefix for web routes. |

## Web Configuration Subtables

In addition to the simple fields above, the web configuration exposes two subtables under the same `[application]` section.

### `[application.request-timeout]`

Configures the timeout applied to web controllers.

```toml
[application.request-timeout]
enabled = true
timeout = "15s"
display = true
```

### `[application.body-limit]`

Configures the size limit for body extraction in web requests.

```toml
[application.body-limit]
max-size = "5MB"
display = true
```

## gRPC Configuration within `[application]`

These fields conceptually belong to `GrpcApplicationConfig` but are serialized within `[application]` via `flatten`.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | `String` | `"0.0.0.0"` | Host or IP for the gRPC server bind. |
| `port` | `u16` | `50051` | Port for the gRPC server. |
| `enable-tonic-reflection` | `bool` | `false` | Enables the Tonic reflection service. |

### `[application.body-limit]` in gRPC

For gRPC, `body-limit` uses input/output message limits:

```toml
[application.body-limit]
max-decoding-message-size = "2 MiB"
max-encoding-message-size = "2 MiB"
display = true
```

## Implementation Note

In the code, the relationship is as follows:

- `ApplicationConfig` defines general fields.
- `WebApplicationConfig` defines web runtime configuration.
- `GrpcApplicationConfig` defines gRPC runtime configuration.
- `ApplicationConfig` includes the active runtime via `#[serde(flatten)]`.

This is why `host`, `port`, `web-router-prefix`, `request-timeout`, `enable-tonic-reflection`, and `body-limit` are part of the application configuration in TOML, even though they are not "general" fields.
