# Built-in Middlewares in Sword

Sword provides a series of built-in middlewares, with the goal of facilitating and reducing the "boilerplate" necessary to build robust web applications.

The built-in middlewares in Sword are configured in the `.toml` configuration file under the `[middleware]` section.

## Available Middlewares

- **Compression**: https://docs.rs/tower-http/latest/tower_http/compression/index.html

- **CORS (Cross-Origin Resource Sharing)**: https://docs.rs/tower-http/latest/tower_http/cors/index.html

- **Helmet (Security Headers)**: https://docs.rs/axum-helmet/latest/axum_helmet/

- **Request Body Limit**: https://docs.rs/axum/latest/axum/extract/struct.DefaultBodyLimit.html

- **Request Id**: https://docs.rs/tower-http/latest/tower_http/request_id/index.html

- **Request Timeout**: https://docs.rs/tower/latest/tower/timeout/struct.TimeoutLayer.html

## Future Integrations

- **Rate Limiting**: https://github.com/benwis/tower-governor
- **HTTP Logging**: Custom implementation based on `tower-http` and `tracing`.
