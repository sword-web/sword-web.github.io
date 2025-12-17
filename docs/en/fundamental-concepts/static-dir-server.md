# Static File Server

Sword provides the capability to serve static files (such as images, CSS files, JavaScript, etc.) through the `ServeDir` middleware from `tower-http`.

## Configuration

To use the static file server middleware, you must enable it in the middlewares section of your `config.toml` configuration file.

```toml
[middlewares.serve-dir]
enabled = true
static_dir = "static"
router_path = "/static"
compression_algorithm = "gzip"
chunk_size = "1MB"
```

Where:

- `enabled`: Enables or disables the static file server middleware.
- `static_dir`: Specifies the directory from which static files will be served.
- `router_path`: Defines the path where static files will be available.
- `compression_algorithm`: (Optional) Defines the compression algorithm to use (`br`, `gzip`, `deflate`, `zstd`).
- `chunk_size`: Controls the size of the internal buffer when ServeDir reads files from the filesystem to send them as HTTP responses. This directly affects the trade-off between:
  - `Memory`: Larger buffers use more RAM
  - `Performance`: Larger buffers reduce filesystem calls
  - `Latency`: Smaller buffers can start transmitting faster
