---
title: "Auto-registered Layers & Services"
description: "Compression, CORS, and static file serving are configured from config.toml without manual layer registration."
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

Sword can automatically register common Tower layers and services through configuration alone, via `toml`. Each section is optional: when present, its layer is enabled without manual registration.

## Compression

Enable response compression with the `[compression]` section:

```toml
[compression]
algorithms = ["gzip", "br"]
```

The `algorithms` key accepts a list of these algorithms:

| Algorithm | Note                           |
| --------- | ------------------------------ |
| `gzip`    | Widely supported               |
| `br`      | Brotli, best compression ratio |
| `deflate` | Legacy algorithm               |
| `zstd`    | Fast, modern algorithm         |

## CORS

Configure Cross-Origin Resource Sharing with the `[cors]` section:

```toml
[cors]
allow-origins = ["*"]
allow-methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
```

The available options are:

| Option              | Description                                |
| ------------------- | ------------------------------------------ |
| `allow-origins`     | List of allowed origins or `["*"]` for all |
| `allow-methods`     | HTTP methods to allow                      |
| `allow-headers`     | Custom allowed headers                     |
| `allow-credentials` | Enables credentials sharing                |
| `max-age`           | Seconds to cache the preflight response    |

## Static file serving

Serve a directory of static files with the `[serve-dir]` section:

```toml
[serve-dir]
static-dir = "public"
router-path = "/static"
```

| Key           | Description                   | Default     |
| ------------- | ----------------------------- | ----------- |
| `static-dir`  | Directory to serve            | `"public"`  |
| `router-path` | URL path prefix               | `"/static"` |
| `compression` | Pre-compressed file support   | `true`      |
| `chunk-size`  | Streaming chunk size in bytes | `65536`     |
| `not-found`   | Custom 404 fallback path      | —           |

## How they are registered

When Sword loads the configuration, it checks for these sections and automatically registers the corresponding Tower layers or services in the correct order before the application starts, with no manual setup required.
