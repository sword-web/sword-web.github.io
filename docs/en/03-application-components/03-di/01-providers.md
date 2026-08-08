---
title: "Defining Providers - Sword Framework"
description: "Learn how to define Providers in Sword using the #[injectable(provider)] macro. Understand manual registration and connections to external services."
outline: [2, 3]

keywords:
    [
        "providers",
        "injectable provider",
        "dependency injection",
        "sword framework",
        "external services",
        "database connections",
    ]
---
# Defining and Registering `Providers`

A `Provider` is a type of injectable struct that must be manually instantiated and registered in the dependency container.

This type of struct is responsible for providing connection logic to external services, such as databases or APIs.

## Defining a `Provider`

To define a `Provider`, use the `#[injectable(provider)]` attribute on the struct definition.

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

    pub fn get_pool(&self) -> &PgPool {
        &self.pool
    }
}
```

Then, you can register an instance of this `Provider` in the dependency container either within a module or globally.

## Registering a `Provider`

### Registration in a `Module`

```rust
impl Module for SomeModule {
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {
        let db_config = config.expect::<DatabaseConfig>();
        let database = Database::new(db_config)
            .await
            .expect("Failed to create Database provider");

        providers.register(database);
    }
}
```

### Global Registration

If a `Provider` doesn't belong to a specific module, or if you prefer to keep it separate for any other reason, you can register it directly in the `ApplicationBuilder`.

```rust
let db_provider = Database::new(db_conf)
    .await
    .expect("Failed to create Database provider");

Application::builder()
    .with_module::<SomeModule>()
    .with_provider(db_provider)
    .build();
```
