---
title: "Dependency Injection"
description: "How dependency injection works in Sword: container, injectables, providers, and components."
outline: [2, 3]
---

# Dependency Injection

Dependency injection is a pattern where an object receives its dependencies from external sources instead of creating them itself. That brings more modularity, makes unit testing easier, and improves code maintainability.

Sword uses this approach to manage components and services within the application: dependencies are injected automatically whenever they are needed.

## Key concepts

### Dependency container

The `DependencyContainer` struct is the core of the pattern in Sword. It acts as a centralized registry where dependencies are registered and resolved.

### Injectables

An injectable is any struct that can be used as a dependency. The container can inject it automatically when it is requested.

### Providers

A provider is an injectable that is instantiated and registered **manually** in the container. It usually represents connections to external services, such as databases or APIs.

### Components

A component is an injectable that is **self-constructed** from dependencies already registered in the container. It is ideal for representing modular parts of the application that depend on other services or configurations.

## Providers

### Defining a provider

Use the `#[injectable(provider)]` attribute on the struct definition:

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

### Registering a provider

You can register an instance of the provider in the container, either within a module or globally.

**In a module:**

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

**Globally**, if the provider does not belong to a specific module:

```rust
let db_provider = Database::new(db_conf)
    .await
    .expect("Failed to create Database provider");

Application::builder()
    .with_module::<SomeModule>()
    .with_provider(db_provider)
    .build();
```

## Components

### Defining a component

Use the `#[injectable]` attribute on the struct definition:

:::info Tip
The `#[injectable(component)]` syntax is also valid, but not necessary. Use it only if you want to be explicit about your intention to define a component.
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

`TaskRepository` does not need a specific constructor: the container resolves each field and constructs it automatically.

You probably noticed that `Database` is wrapped in an `Arc` pointer. It is not required, but it is useful for sharing references to the same component or provider in several places without extra clones.

### Multiple injection

A component can depend on multiple providers, components, and structs marked with the `#[config]` attribute. For configurations, you do not need to wrap them in `Arc`:

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
