# Request Body Limit

The request body limit middleware allows restricting the maximum size of incoming request bodies. This is useful to prevent denial of service attacks and to control server resource usage.

## Configuration

To use the middleware you must configure it in your Sword application's configuration file. Here's an example of how to do it:

```toml
[middlewares.body-limit]
max_size = "5MB"
display = true
```

If this configuration is not provided, the middleware will use default values:

- `max_size`: "10MB"
- `display`: true

## Response

If a request is received that exceeds the configured limit, the following response will be returned:

```json
{
  "code": 413,
  "message": "The request body exceeds the maximum allowed size by the server",
  "success": false,
  "timestamp": "2025-12-16T03:14:01Z"
}
```
