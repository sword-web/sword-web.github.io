# Compression Layer in Sword

The compression middleware in Sword uses the compression layer provided by `tower-http` to compress outgoing HTTP responses. This helps reduce the size of data transferred between the server and client, thereby improving performance and loading speed of web applications.

## Middleware Configuration

To use this middleware, you must enable it in your Sword project's `.toml` configuration file. Below is an example of how to configure the compression middleware:

```toml
[middlewares.compression]
enabled = true
algorithms = ["gzip", "deflate", "brotli", "zstd"]
display = true
```

Where:

- `enabled`: Enables or disables the compression middleware.
- `algorithms`: Specifies the compression algorithms to be used.
- `display`: If set to `true`, information about the middleware will be shown in the prompt when starting the application.
