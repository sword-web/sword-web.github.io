---
title: "Auto-registered Layers & Services"
description: "Configure Compression, CORS, and static file serving directly from config.toml without manual layer registration."
outline: [2, 3]
keywords:
    [
        "compression",
        "cors",
        "serve-dir",
        "static files",
        "middleware",
        "tower layers",
        "auto-register",
        "sword configuration",
    ]
---

# Auto-registered Layers & Services

Sword can automatically register common Tower layers and services through configuration alone, via `toml`.

## Compression

Enable response compression via the `[compression]` config section:

```toml
[compression]
algorithms = ["gzip", "br"]
```

### Supported Algorithms

| Algorithm | Note |
|---|---|
| `gzip` | Widely supported |
| `br` | Brotli, best compression ratio |
| `deflate` | Legacy algorithm |
| `zstd` | Fast, modern algorithm |

## CORS

Configure Cross-Origin Resource Sharing:

```toml
[cors]
allow-origins = ["*"]
allow-methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
```

### Available Options

- `allow-origins` — list of allowed origins or `["*"]` for all
- `allow-methods` — HTTP methods to allow
- `allow-headers` — custom allowed headers
- `allow-credentials` — boolean, enable credentials sharing
- `max-age` — seconds to cache preflight response

## Static File Serving

Serve a directory of static files with `[serve-dir]`:

```toml
[serve-dir]
static-dir = "public"
router-path = "/static"
```

### Options

| Key | Description | Default |
|---|---|---|
| `static-dir` | Directory to serve | `"public"` |
| `router-path` | URL path prefix | `"/static"` |
| `compression` | Pre-compressed file support | `true` |
| `chunk-size` | Streaming chunk size in bytes | `65536` |
| `not-found` | Custom 404 fallback path | — |

## How It Works

When Sword loads the configuration, it checks for these sections and automatically registers the corresponding Tower layers or services in the correct order before the application starts. No manual setup required.

## See Also

- [Application Configuration](/en/fundamental-concepts/configuration/application)
- [Interceptors in Web Controllers](/en/practical-guides/web/interceptors)
