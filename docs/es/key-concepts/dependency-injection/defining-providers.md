---
title: Definiendo Providers - Sword Framework
description: Aprende a definir Providers en Sword usando la macro `#[injectable(provider)]`. Comprende el registro manual y conexiones a servicios externos.
keywords: ["providers", "injectable provider", "inyección de dependencias", "sword framework", "servicios externos", "conexiones base de datos"]
---

# Definiendo y registrando `Providers`

Un `Provider` es un tipo de estructura `Injectable` que debe ser instanciada y registrada manualmente en el contenedor de dependencias. 

Este tipo de estructuras son responsables de proveer la lógica de conexiones a servicios externos, como bases de datos o APIs.

## Definiendo un `Provider`

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
Luego, puedes registrar una instancia de este `Provider` en el contenedor de dependencias usando el método `register_provider`.

```rust
let db_provider = Database::new(db_conf).await;

DependencyContainer::builder()
    .register_provider(db_provider)
    .build();
```

Ejemplo completo en [GitHub](https://github.com/sword-web/sword/tree/main/examples/dependency-injection/).

En las siguientes secciones verás como inyectar este `Provider` en componentes, controladores o middlewares.

