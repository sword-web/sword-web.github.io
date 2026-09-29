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

Sword can automatically register common Tower layers and services through configuration alone, via `toml`. When the corresponding feature is compiled, the layer is registered automatically: it uses the values from its section when present, and the defaults otherwise. No manual registration is needed.

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

| Key                     | Description                                                   | Default     |
| ----------------------- | ------------------------------------------------------------- | ----------- |
| `static-dir`            | Directory to serve                                            | `"public"`  |
| `router-path`           | URL path prefix                                               | `"/static"` |
| `compression-algorithm` | Pre-compressed file support (`br`, `gzip`, `deflate`, `zstd`) | —           |
| `chunk-size`            | Streaming chunk size (e.g. `"64KB"`)                          | —           |
| `not-found-file`        | Custom 404 fallback file                                      | —           |

## How they are registered

When Sword loads the configuration, it automatically registers the corresponding Tower layers or services in the correct order before the application starts, using each section's values when present and its defaults otherwise. No manual setup is required.
