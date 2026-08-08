---
title: "Defining Components - Sword Framework"
description: "Learn how to define Components in Sword using the #[injectable] macro. Understand dependency resolution and multiple injection patterns."
outline: [2, 3]

keywords:
    [
        "components",
        "injectable",
        "dependency injection",
        "sword framework",
        "auto construction",
        "repository pattern",
    ]
---
# Defining and Registering `Components`

A `Component` is an injectable struct that is automatically constructed based on dependencies already registered in the container.

This type of struct is ideal for representing modular parts of the application that depend on other services or configurations, such as data repositories, business services, and so on.

## Defining a `Component`

To define a `Component`, use the `#[injectable(component)]` attribute on the struct definition.

However, since defining components is very common, `component` is the default value for the `#[injectable]` macro.

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

In this example, `TaskRepository` does not require a specific constructor. The dependency injection system will resolve each field of the `Component` and construct it automatically.

You probably noticed that `Database` is wrapped in an `Arc` pointer. While not strictly mandatory, this is useful for low-cost cloning, allowing you to share references to the same `Component` or `Provider` in multiple places without creating unnecessary clones.

### Multiple Injection

A `Component` can depend on multiple `Providers`, `Components`, and structs marked with the `#[config]` attribute. In the case of config structs, it is not necessary to wrap them in an `Arc` pointer.

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
