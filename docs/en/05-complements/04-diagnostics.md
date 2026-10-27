---
title: "Diagnostics"
description: "How Sword reports build, startup and shutdown failures, and how to choose between miette and tracing."
outline: [2, 3]

keywords: ["diagnostics", "errors", "miette", "tracing", "startup", "rust"]
---

# Diagnostics

Sword treats build and startup failures as **diagnostics**: structured data with a
stable code, a phase, a reason, optional context and a source span. The renderer
decides how to show that data.

Request and validation errors are not diagnostics. They stay in the HTTP or gRPC
response, or in regular tracing events.

## Renderers

`[application] diagnostics` selects the renderer:

```toml
[application]
diagnostics = "miette"
```

`miette` is the default. It prints a human report with the code, the phase, the
message, a snippet when a span is available, and a `help` block:

```text
sword.build.web — Build error

  × Invalid [web] configuration: host must not be empty

   ╭─[Config.toml:2:8]
 1 │ [web]
 2 │ host = ""
   ·        ─┬
   ·         ╰── must not be empty
   ╰────

  help: Use a valid host such as 0.0.0.0 or 127.0.0.1
```

`tracing` emits one structured event per diagnostic with `code`, `phase`,
`engine`, `source` and `reason`. It requires an active subscriber; if there is
none, Sword reports a configuration error instead of silently dropping the
diagnostic.

## Where diagnostics come from

Each crate validates its own configuration section:

| Section | Owner |
|---|---|
| `[application]` | `sword` |
| `[tracing]` | `sword-layers` |
| `[web]` | `sword-web` |
| `[grpc]` | `sword-grpc` |
| `[events]` | `sword-events` |
| `[socketio]` | `sword-socketio` |

Sections that are absent use their defaults and are not validated. A section that
exists but has the wrong types or invalid values reports every problem it finds,
with one label per key, and stops the bootstrap.

## Reporting once

`#[sword::main]` is the single reporting point:

```rust
#[sword::main]
async fn main() -> Result<(), Error> {
    Application::from_config_path("Config.toml")?.run().await
}
```

Returning `Err` renders the diagnostic once and exits with a failure code. The
same happens when the Tokio runtime cannot be built.

## Codes

Codes follow `sword.<phase>.<subsystem>` and are stable. Each crate documents the
codes it emits in its API docs.
