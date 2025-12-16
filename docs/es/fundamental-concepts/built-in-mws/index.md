# Middlewares integrados en Sword

Sword provee una serie de middlewares integrados, esto con el objetivo de facilitar y reducir el "boilerplate" necesario para construir aplicaciones web robustas.

Los middlewares integrados en Sword se configuran en el fichero de configuración `.toml` bajo la sección `[middleware]`.

## Middlewares disponibles

- **Compression**: https://docs.rs/tower-http/latest/tower_http/compression/index.html

- **CORS (Cross-Origin Resource Sharing)**: https://docs.rs/tower-http/latest/tower_http/cors/index.html

- **Helmet (Security Headers)**: https://docs.rs/axum-helmet/latest/axum_helmet/

- **Request Body Limit**: https://docs.rs/axum/latest/axum/extract/struct.DefaultBodyLimit.html

- **Request Id**: https://docs.rs/tower-http/latest/tower_http/request_id/index.html

- **Request Timeout**: https://docs.rs/tower/latest/tower/timeout/struct.TimeoutLayer.html

## Futuras integraciones

- **Rate Limiting**: https://github.com/benwis/tower-governor
- **HTTP Logging**: Implementación propia basada en `tower-http` y `tracing`.
