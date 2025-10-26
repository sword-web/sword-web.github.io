---
title: Security - Sword Framework
description: Implement security best practices in Sword applications. Learn about authentication, authorization, CORS, CSRF protection, and more.
keywords: ["security", "authentication", "authorization", "cors", "csrf", "sword framework", "web security"]
---

# Security

One of Sword's goals is to facilitate the implementation of tools and libraries commonly used in the `axum` ecosystem.

## Helmet

Helmet is a collection of HTTP headers that help protect web applications from some well-known vulnerabilities. To use Helmet in Sword, you can enable the `helmet` feature flag.

This feature uses the [axum-helmet](https://docs.rs/axum-helmet/latest/axum_helmet/) crate.

### Using Helmet

```rust
use sword::prelude::*;
use sword::web::helmet::*;

#[controller("/")]
struct MyController;

#[routes]
impl MyController {
    #[get("/")]
    async fn index(&self) -> HttpResult {
        Ok(HttpResponse::Ok().message("Hello, Helmet!"))
    }
}

#[sword::main]
async fn main() {
    let helmet = Helmet::builder()
        .with_header(XContentTypeOptions::nosniff())
        .with_header(XXSSProtection::on())
        .build();

    let app = Application::builder()
        .with_controller::<MyController>()
        .with_layer(helmet)
        .build();

    app.run().await;
}
```
