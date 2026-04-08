---
title: Tracing Configuration
description: Configuring logging and tracing in Sword using the [tracing] section.
outline: [2, 3]
---

# Tracing Configuration

Sword automatically installs tracing during the application bootstrap when you build the app from a configuration.

The configuration is loaded from the `[tracing]` section of the TOML file.

## Automatic Initialization

```rust
use sword::prelude::*;

let config = Config::builder()
    .add_required_file("config/config.toml")
    .build()
    .expect("Configuration loading error");

let app = Application::from_config(config)
    .with_module::<UsersModule>()
    .build();
```

## Complete Example

```toml
[tracing]
display = false
enabled = true
use-env-filter = true
filter = "info,sword=info,sqlx=warn"

format = "dev"
time-style = "local"
time-pattern = "%H:%M:%S"

with-fields = []
```

## Supported Fields

| Key              | Type                                                                  | Default      | Description                                                               |
| ---------------- | --------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `display`        | `bool`                                                                | `false`      | Shows the initial subscriber event at startup.                            |
| `enabled`        | `bool`                                                                | `true`       | Enables or disables the global initialization of the subscriber.          |
| `use-env-filter` | `bool`                                                                | `true`       | Attempts to read directives from `RUST_LOG` before using `filter`.        |
| `filter`         | `String`                                                              | `"info"`     | Default filter used when `RUST_LOG` is missing or disabled.               |
| `format`         | `full \| pretty \| compact \| dev \| json`                            | `full`       | Subscriber output format.                                                 |
| `time-style`     | `system \| uptime \| local \| utc \| none`                            | `system`     | Timestamp source and style.                                               |
| `time-pattern`   | `String?`                                                             | `None`       | `strftime` pattern used by `local` and `utc`.                             |
| `with-fields`    | `target[] \| file[] \| line-number[] \| thread-id[] \| thread-name[]` | `["target"]` | List of optional metadata to include in each event.                       |

## Available Formats

### `full` Format

Uses the standard `tracing-subscriber` formatter. This is the default format and prioritizes exposing more metadata.

### `pretty` Format

Uses the human-readable multi-line formatter from `tracing-subscriber`.

Useful in development when you want clearer blocks per event, although it consumes more vertical space.

### `compact` Format

Uses a denser single-line variant, close to the classic `tracing-subscriber` style.

### `dev` Format

Sword's own format tailored for console development.

Features:

- Prioritizes human readability in the console.
- Small events can appear on a single line.
- Events with multiple fields or long values expand into multiple lines.
- The main message appears before the fields.
- Fields are displayed as `key: value`.
- When the terminal supports ANSI, `keys` and the level (`INFO`, `WARN`, `ERROR`, etc.) are automatically colored.

Example:

```text
INFO  Initialized tracing subscriber
       format: Dev
       filter: info,sword=info
       use_env_filter: true
```

If `display = false`, this initial event is not printed.

### `json` Format

Uses the native `tracing-subscriber` JSON formatter with event fields flattened at the root level.

Provides a good foundation for log aggregation and simple observability pipelines.

## Time Configuration

The timestamp is controlled by `time-style` and `time-pattern`.

## Optional Metadata with `with-fields`

Optional log metadata is controlled by a single key: `with-fields`.

Supported values:

- `target`
- `file`
- `line-number`
- `thread-id`
- `thread-name`

Examples:

```toml
with-fields = []
```

No extra metadata is included.

```toml
with-fields = ["target"]
```

Includes only the event target. This is the Sword default.

```toml
with-fields = ["target", "file", "line-number"]
```

Includes target and source location.

### `time-style`

Supported values:

- `system`: Uses the default `tracing-subscriber` time formatter.
- `uptime`: Prints time elapsed since subscriber initialization.
- `local`: Prints local date/time using a `strftime` pattern.
- `utc`: Prints UTC date/time using a `strftime` pattern.
- `none`: Does not print timestamps.

### `time-pattern`

`time-pattern` only applies to `local` and `utc`.

Sword uses `strftime` syntax, the same as `chrono`. Some useful examples:

| Pattern                | Approximate Result     |
| ---------------------- | ---------------------- |
| `"%H:%M:%S"`           | `14:32:11`             |
| `"%Y-%m-%d %H:%M:%S"`  | `2026-04-02 14:32:11`  |
| `"%Y-%m-%dT%H:%M:%S"`  | `2026-04-02T14:32:11`  |
| `"%Y-%m-%dT%H:%M:%SZ"` | `2026-04-02T17:32:11Z` |

Defaults used by Sword:

- `local`: `"%Y-%m-%d %H:%M:%S"`
- `utc`: `"%Y-%m-%dT%H:%M:%SZ"`

## Env Filter `RUST_LOG` and `filter`

If `use-env-filter = true`, Sword attempts to read `RUST_LOG`.

If `RUST_LOG` does not exist or cannot be interpreted, `filter` is used.

If `use-env-filter = false`, `filter` is always used.
