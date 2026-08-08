---
title: "Definición de Providers - Framework Sword"
description: "Aprende a definir Providers en Sword usando la macro #[injectable(provider)]. Comprende el registro manual y conexiones a servicios externos."
outline: [2, 3]

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

Un `Provider` es un tipo de estructura inyectable que debe ser instanciada y registrada manualmente en el contenedor de dependencias.

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

Luego, puedes registrar una instancea de este `Provider` en el contenedor de dependencias en un módulo o bien de forma global.

## Registrando un `Provider`

### Registro en un `Module`

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

### Registro Global

Si un `Provider` no pertenece a un módulo o en especifico, o por alguna otra razón quieres mantenerlo separado, puedes registrarlo directamente en el `ApplicationBuilder`.

```rust
let db_provider = Database::new(db_conf)
    .await
    .expect("Failed to create Database provider");

Application::builder()
    .with_module::<SomeModule>()
    .with_provider(db_provider)
    .build();
```
