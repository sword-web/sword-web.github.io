---
title: Definición de Components - Framework Sword
description: Aprende a definir Components en Sword usando la macro #[injectable]. Comprende la resolución de dependencias y patrones de inyección múltiple.
keywords:
  [
    "components",
    "injectable",
    "inyección de dependencias",
    "framework sword",
    "auto construcción",
    "patrón repository",
  ]
---

# Definición y Registro de `Components`

Un `Component` es una estructura `Injectable` que se construye automáticamente basándose en las dependencias ya registradas en el contenedor.

Este tipo de estructura es ideal para representar partes modulares de la aplicación que dependen de otros servicios o configuraciones. Por ejemplo, repositorios de datos, servicios de negocio, etc.

## Definir un `Component`

Para definir un `Component` debes usar el atributo `#[injectable(component)]` en la definición de la estructura.

Sin embargo, dado que es más frecuente definir components, el atributo `component` es el valor por defecto de la macro `#[injectable]`.

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

In this example, `TaskRepository` does not require an explicit constructor, since the dependency injection system will take care of resolving and injecting the `Database` dependency automatically.

You probably noticed that `Database` is wrapped in an `Arc` pointer. This is not mandatory, but it can be useful for sharing instances across multiple components without incurring unnecessary cloning costs. If you want to clone the instance, you can use just `Database` directly.

```rust
#[injectable]
pub struct TaskRepository {
    db: Database,
}
```

This will cause the registered `Database` instance in the container to be cloned when building `TaskRepository`.

### Multi-dependency injection example

A `Component` can depend on multiple `Providers`, `Components` and structures marked with the `config` macro. In the case of configurations, it is not necessary to wrap them in `Arc`.

```rust

#[derive(Clone, Deserialize)]
#[config(key = "task")]
pub struct TaskConfig {
    max_tasks: usize,
}

#[injectable]
pub struct TaskService {
    repo: Arc<TaskRepository>,
    task_conf: TaskConfig,
}
```

Complete example on [GitHub](https://github.com/sword-web/sword/tree/main/examples/dependency-injection/).

In the following sections you will see how to inject this `Provider` into components, controllers or middlewares.
