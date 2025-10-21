---
title: Ecosystem and Integrations - Sword Framework
description: Explore Sword's ecosystem built on Axum and Tokio. Learn about Tower middleware integration and recommended crates for databases and services.
keywords: ["sword ecosystem", "axum integration", "tokio", "tower middleware", "rust crates", "database integration"]
---

# Ecosystem and Integrations

Sword is built on top of `Axum` and, by extension, on `Tokio`. This means you can use any crate compatible with both in a Sword application.

Just like Axum, Sword is compatible with `tower` and its ecosystem of middlewares. Sword provides native `tower` middlewares and derivatives, such as CORS handling, timeouts, cookies, request size limits, among others. To integrate third-party middlewares, you can use the `with_layer` method on the `ApplicationBuilder`.

Regarding external services like databases, caches, or message queues, it's recommended to configure them through custom `structs` that deserialize from the configuration file. We'll talk more about the configuration file in later sections.

## Recommended Crates

Below is a list of some recommended crates to use alongside Sword:

- **Database**: [sqlx](https://docs.rs/sqlx/latest/sqlx/) is an asynchronous crate for interacting with SQL databases. It supports PostgreSQL, MySQL, MariaDB, and SQLite.
- **Cache**: [redis](https://docs.rs/redis/latest/redis/) is an asynchronous client for Redis.
- **SMTP and email**: [lettre](https://lettre.rs/) allows sending emails in an SMTP provider-agnostic way.
- **Flexible error handling**: [thiserror](https://docs.rs/thiserror/latest/thiserror/)
- **Logging**: [tracing](https://docs.rs/tracing/latest/tracing/) and [tracing-subscriber](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/)
- **Templating**: [askama](https://docs.rs/askama/latest/askama/) or [tera](https://keats.github.io/tera/docs/)
- **HTTP client**: [reqwest](https://docs.rs/reqwest/latest/reqwest/)
