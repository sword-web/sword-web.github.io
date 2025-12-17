# Request Timeout Middleware in Sword

The Request Timeout middleware in Sword allows setting a maximum time for a request to be processed by the application. If the request is not completed within the specified time, an error response is returned indicating that the request has exceeded the time limit.

This middleware uses the `timeout` layer provided by `tower-http`.

## Configuration

```toml
[middlewares.request-timeout]
enabled = true
duration = "15s"
display = true
```

Where:

- `enabled`: Enables or disables the timeout middleware.
- `duration`: Specifies the maximum duration allowed to process a request. The value must be in a format recognizable by the [duration_str](https://docs.rs/duration-str/latest/duration_str/) crate.
- `display`: If enabled, information will be shown in the prompt when starting the application about the middleware and its configuration.

## Response

If a request is received that exceeds the configured time, the following response will be returned:

```json
{
  "code": 408,
  "message": "Request Timeout",
  "success": false,
  "timestamp": "2025-12-16T03:18:30Z"
}
```
