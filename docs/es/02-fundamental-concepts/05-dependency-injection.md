---
title: "Inyección de dependencias"
description: "Cómo funciona la inyección de dependencias en Sword: contenedor, inyectables, proveedores y componentes."
outline: [2, 3]
---

# Inyección de dependencias

La inyección de dependencias es un patrón que permite a un elemento recibir sus dependencias desde fuentes externas en lugar de crearlas por sí mismo. Eso da más modularidad, facilita las pruebas unitarias y mejora la mantenibilidad del código.

Sword usa este enfoque para gestionar componentes y servicios dentro de la aplicación: las dependencias se inyectan automáticamente cuando se necesitan.

## Conceptos clave

### Contenedor de dependencias

La estructura `DependencyContainer` es el núcleo del patrón en Sword. Actúa como un registro centralizado donde se registran y resuelven las dependencias.

### Inyectables

Un inyectable (`Injectable`) es cualquier estructura que puede usarse como dependencia. El contenedor puede inyectarla automáticamente cuando se solicita.

### Proveedores

Un proveedor (`Provider`) es un inyectable que se instancia y registra **manualmente** en el contenedor. Suele representar conexiones a servicios externos, como bases de datos o APIs.

### Componentes

Un componente (`Component`) es un inyectable que se **autoconstruye** a partir de dependencias ya registradas en el contenedor. Es ideal para representar partes modulares de la aplicación que dependen de otros servicios o configuraciones.

## Proveedores

### Definir un proveedor

Usa el atributo `#[injectable(provider)]` en la definición de la estructura:

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

### Registrar un proveedor

Puedes registrar una instancia del proveedor en el contenedor, ya sea dentro de un módulo o de forma global.

**En un módulo:**

```rust
struct SomeModule;

impl Module for SomeModule {
    async fn register_providers(
        config: &Config,
        providers: &ProviderRegistry
    ) {
        let db_config = config.expect::<DatabaseConfig>();
        let database = Database::new(db_config)
            .await
            .expect("Failed to create Database provider");

        providers.register(database);
    }
}
```

**De forma global**, si el proveedor no pertenece a un módulo en particular:

```rust
let db_provider = Database::new(db_conf)
    .await
    .expect("Failed to create Database provider");

Application::builder()
    .with_module::<SomeModule>()
    .with_provider(db_provider)
    .build();
```

## Componentes

### Definir un componente

Usa el atributo `#[injectable]` en la definición de la estructura:

:::info Consejo
La sintaxis `#[injectable(component)]` también es válida, pero no es necesaria. Úsala solo si quieres ser explícito sobre tu intención de definir un componente.
:::

```rust
#[injectable]
pub struct TaskRepository {
    db: Arc<Database>,
}

impl TaskRepository {
    pub async fn find_all(&self) -> Vec<Task> {
        sqlx::query_as::<_, Task>("SELECT id, title FROM tasks")
            .fetch_all(self.db.get_pool())
            .await
            .expect("Failed to fetch tasks")
    }

    pub async fn create(&self, task: Task) {
        sqlx::query("INSERT INTO tasks (id, title) VALUES ($1, $2)")
            .bind(task.id)
            .bind(task.title)
            .execute(self.db.get_pool())
            .await
            .expect("Failed to insert task");
    }
}
```

`TaskRepository` no necesita un constructor específico: el contenedor resuelve cada campo y lo construye automáticamente.

Probablemente notaste que `Database` está envuelto en un puntero `Arc`. No es obligatorio, pero es útil para compartir referencias de un mismo componente o proveedor en varios lugares sin clonar de más.

### Inyección múltiple

Un componente puede depender de varios proveedores, componentes y estructuras marcadas con el atributo `#[config]`. En el caso de las configuraciones no hace falta envolverlas en `Arc`:

```rust
#[config(key = "task")]
#[derive(Clone, Deserialize)]
pub struct TaskConfig {
    max_tasks: usize,
}

#[injectable]
pub struct TaskService {
    repo: Arc<TaskRepository>,
    task_conf: TaskConfig,
}
```
