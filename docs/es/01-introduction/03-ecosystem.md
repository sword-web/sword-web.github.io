# Ecosistema e integraciones

Sword está construido sobre `Axum` y, por extensión, sobre `Tokio`. Esto significa que puedes utilizar cualquier crate compatible con ambos en una aplicación Sword.

Al igual que Axum, Sword es compatible con `tower` y su ecosistema de middlewares. Sword proporciona middlewares nativos de `tower` y derivados, como manejo de CORS, timeouts, cookies, límites de tamaño en requests, entre otros. Para integrar middlewares de terceros, puedes usar el método `with_layer` en el `ApplicationBuilder`.

En cuanto a servicios externos como bases de datos, caches o colas de mensajes, se recomienda configurarlos mediante `structs` personalizadas que se deserialicen desde el archivo de configuración. Hablaremos más sobre el fichero de configuración en secciones posteriores.

## Crates recomendados

A continuación, se listan algunos crates recomendados para utilizar junto con Sword:

- **Base de datos**: [sqlx](https://docs.rs/sqlx/latest/sqlx/) es un crate asíncrono para interactuar con bases de datos SQL. Soporta PostgreSQL, MySQL, MariaDB y SQLite.
- **Cache**: [redis](https://docs.rs/redis/latest/redis/) es un cliente asíncrono para Redis.
- **SMTP y email**: [lettre](https://lettre.rs/) permite enviar emails de manera agnóstica al proveedor SMTP.
- **Manejo flexible de errores**: [thiserror](https://docs.rs/thiserror/latest/thiserror/)
- **Logging**: [tracing](https://docs.rs/tracing/latest/tracing/) y [tracing-subscriber](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/)
- **Templating**: [askama](https://docs.rs/askama/latest/askama/) o [tera](https://keats.github.io/tera/docs/)
- **HTTP client**: [reqwest](https://docs.rs/reqwest/latest/reqwest/)
