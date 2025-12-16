---
title: Definición de Providers - Framework Sword
description: Aprende a definir Providers en Sword usando la macro #[injectable(provider)]. Comprende el registro manual y conexiones a servicios externos.
keywords:
  [
    "providers",
    "injectable provider",
    "inyección de dependencias",
    "framework sword",
    "servicios externos",
    "conexiones base de datos",
  ]
---

# Definición y Registro de `Providers`

Un `Provider` es un tipo de estructura `Injectable` que debe ser instanciada y registrada manualmente en el contenedor de dependencias.

Este tipo de estructura es responsable de proporcionar lógica de conexión a servicios externos, como bases de datos o APIs.

## Definir un `Provider`

Para definir un `Provider` debes usar el atributo `#[injectable(provider)]` en la definición de la estructura.

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
