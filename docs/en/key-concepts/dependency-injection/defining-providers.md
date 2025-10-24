---
title: Defining Providers - Sword Framework
description: Learn to define Providers in Sword using the #[injectable(provider)] macro. Understand manual registration and external service connections.
keywords: ["providers", "injectable provider", "dependency injection", "sword framework", "external services", "database connections"]
---

# Defining and Registering `Providers`

A `Provider` is a type of `Injectable` structure that must be instantiated and manually registered in the dependency container.

This type of structure is responsible for providing connection logic to external services, such as databases or APIs.

## Defining a `Provider`

To define a `Provider` you must use the `#[injectable(provider)]` attribute in the structure definition.

```rust
#[injectable(provider)]
pub struct Database {
    pool: Arc<PgPool>,
}

impl Database {
    pub async fn new(db_conf: DatabaseConfig) -> Self {
        let pool = PgPool::connect(&db_conf.uri)
            .await
            .expect("Failed to create Postgres connection pool");

        Self {
            pool: Arc::new(pool),
        }
    }

    pub fn get_pool(&self) -> PgPool {
        &self.pool
    }
}
```
Then, you can register an instance of this `Provider` in the dependency container using the `register_provider` method.

```rust
let db_provider = Database::new(db_conf).await;

DependencyContainer::builder()
    .register_provider(db_provider)
    .build();
```

Complete example on [GitHub](https://github.com/sword-web/sword/tree/main/examples/dependency-injection/).

In the following sections you will see how to inject this `Provider` into components, controllers or middlewares.