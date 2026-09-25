---
title: "Tracing Configuration"
description: "Configure Sword's global logging and tracing subscriber through the [tracing] section."
outline: [2, 3]
---

# Tracing Configuration

Sword can configure a global `tracing` subscriber to capture traces across the entire application. It is configured from the `[tracing]` section of the TOML file. This subscriber is initialized automatically while the application is being built.

## Supported fields

| Key              | Type                                                                  | Default      | Description                                                    |
| ---------------- | --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| `enabled`        | `bool`                                                                | `true`       | Enables or disables global subscriber initialization           |
| `use-env-filter` | `bool`                                                                | `true`       | Tries to read directives from `RUST_LOG` before using `filter` |
| `filter`         | `String`                                                              | `"info"`     | Fallback filter when `RUST_LOG` is missing or disabled         |
| `format`         | `full \| pretty \| compact \| dev \| json`                            | `full`       | Subscriber output format                                       |
| `time-style`     | `system \| uptime \| local \| utc \| none`                            | `system`     | Timestamp source and style                                     |
| `time-pattern`   | `String?`                                                             | `None`       | `strftime` pattern used by `local` and `utc`                   |
| `with-fields`    | `target[] \| file[] \| line-number[] \| thread-id[] \| thread-name[]` | `["target"]` | Optional metadata included on each event                       |

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

## Output format

The format is chosen with the `format` key.

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

Timestamps are controlled by two keys: `time-style` (time source) and `time-pattern` (format pattern).

### Time style

Values accepted by `time-style`:

| Value    | Description                                  |
| -------- | -------------------------------------------- |
| `system` | `tracing-subscriber` default time formatter  |
| `uptime` | Elapsed time since subscriber initialization |
| `local`  | Local date/time using an `strftime` pattern  |
| `utc`    | UTC date/time using an `strftime` pattern    |
| `none`   | Does not print timestamps                    |

### Time pattern

`time-pattern` only applies to `local` and `utc`. Sword uses `strftime` syntax, just like `chrono`; some examples:

| Pattern                | Approximate output     |                 |
| ---------------------- | ---------------------- | --------------- |
| `"%H:%M:%S"`           | `14:32:11`             |                 |
| `"%Y-%m-%d %H:%M:%S"`  | `2026-04-02 14:32:11`  | (Default local) |
| `"%Y-%m-%dT%H:%M:%S"`  | `2026-04-02T14:32:11`  |                 |
| `"%Y-%m-%dT%H:%M:%SZ"` | `2026-04-02T17:32:11Z` | (Default utc)   |

## Event filters

Sword combines two filtering sources: `RUST_LOG` (environment directives) and `filter` (TOML filter).

With `use-env-filter = true`, Sword tries to read `RUST_LOG` and uses `filter` only when it is missing or invalid. With `use-env-filter = false`, Sword always uses `filter`.
