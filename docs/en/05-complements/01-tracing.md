---
title: "Tracing Configuration"
description: "Logging and tracing configuration in Sword through the [tracing] section."
outline: [2, 3]
---
# Tracing Configuration

Sword can configure a global `tracing` subscriber to capture traces across the entire application.

Configuration is loaded from the `[tracing]` section in TOML.

## Automatic initialization

```rust
use sword::prelude::*;

let app = Application::builder(config)
    .with_module::<UsersModule>()
    .build();
```

## Complete example

```toml
[tracing]
enabled = true
use-env-filter = true
filter = "info,sword=info,sqlx=warn"

format = "dev"
time-style = "utc"
time-pattern = "%H:%M:%S"

with-fields = []
```

## Supported fields

| Key              | Type                                                                  | Default      | Description                                                             |
| ---------------- | --------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `enabled`        | `bool`                                                                | `true`       | Enables or disables global subscriber initialization                    |
| `use-env-filter` | `bool`                                                                | `true`       | Tries to read directives from `RUST_LOG` before using `filter`          |
| `filter`         | `String`                                                              | `"info"`     | Fallback filter when `RUST_LOG` is missing or disabled                  |
| `format`         | `full \| pretty \| compact \| dev \| json`                            | `full`       | Subscriber output format                                                |
| `time-style`     | `system \| uptime \| local \| utc \| none`                            | `system`     | Timestamp source and style                                              |
| `time-pattern`   | `String?`                                                             | `None`       | `strftime` pattern used by `local` and `utc`                           |
| `with-fields`    | `target[] \| file[] \| line-number[] \| thread-id[] \| thread-name[]` | `["target"]` | Optional metadata included on each event                               |

## Available formats

### `full` format

Uses the default formatter from `tracing-subscriber`. This is the default format and prioritizes richer metadata.

### `pretty` format

Uses the multi-line formatter from `tracing-subscriber`.

Useful in development when you want clearer event blocks, although it takes more vertical space.

### `compact` format

Uses a denser single-line format, close to the classic `tracing-subscriber` style.

### `dev` format

Sword's own format for development in the terminal.

Example:

```text
INFO  Initialized tracing subscriber
       format: Dev
       filter: info,sword=info
       use_env_filter: true
```

### `json` format

Uses the native JSON formatter from `tracing-subscriber`, flattening event fields at the root level.

This is a solid base for log aggregation and simple observability pipelines.

## Time configuration

Timestamps are controlled by `time-style` and `time-pattern`.

## Optional fields with `with-fields`

Optional log metadata is controlled with a single key: `with-fields`.

Supported values:

- `target`
- `file`
- `line-number`
- `thread-id`
- `thread-name`

Includes target and source location.

### `time-style`

Supported values:

- `system`: uses `tracing-subscriber` default time formatter
- `uptime`: prints elapsed time since subscriber initialization
- `local`: prints local date/time using an `strftime` pattern
- `utc`: prints UTC date/time using an `strftime` pattern
- `none`: does not print timestamps

### `time-pattern`

`time-pattern` only applies to `local` and `utc`.

Sword uses `strftime` syntax, just like `chrono`. Useful examples:

| Pattern                | Approximate output     |
| ---------------------- | ---------------------- |
| `"%H:%M:%S"`           | `14:32:11`             |
| `"%Y-%m-%d %H:%M:%S"`  | `2026-04-02 14:32:11`  |
| `"%Y-%m-%dT%H:%M:%S"`  | `2026-04-02T14:32:11`  |
| `"%Y-%m-%dT%H:%M:%SZ"` | `2026-04-02T17:32:11Z` |

Sword defaults:

- `local`: `"%Y-%m-%d %H:%M:%S"`
- `utc`: `"%Y-%m-%dT%H:%M:%SZ"`

## Env Filter `RUST_LOG` and `filter`

If `use-env-filter = true`, Sword tries to read `RUST_LOG`.

If `RUST_LOG` is missing or invalid, `filter` is used.

If `use-env-filter = false`, `filter` is always used.
