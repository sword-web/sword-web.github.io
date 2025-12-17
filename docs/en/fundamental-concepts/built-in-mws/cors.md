# CORS Layer in Sword

The CORS (Cross-Origin Resource Sharing) middleware in Sword uses the CORS layer provided by `tower-http` to manage resource sharing policies between different origins.

## Middleware Configuration

To use this middleware, you must enable it in your Sword project's `.toml` configuration file. Below is an example of how to configure the CORS middleware:

```toml
[middlewares.cors]
enabled = true
allow_credentials = true
display = false
allow_headers = ["Content-Type", "Authorization"]
allow_methods = ["GET", "POST", "PUT", "DELETE"]
allow_origins = ["http://localhost:3000", "https://example.com"]
```

Where:

- `enabled`: Enables or disables the CORS middleware.
- `allow_credentials`: Indicates whether credentials (cookies, authentication headers, etc.) are allowed in CORS requests.
- `allow_headers`: Specifies the HTTP headers allowed in CORS requests.
- `allow_methods`: Defines the HTTP methods allowed for CORS requests.
- `allow_origins`: List of origins allowed to make CORS requests.
- `display`: If set to `true`, information about the middleware will be shown in the prompt when starting the application.
