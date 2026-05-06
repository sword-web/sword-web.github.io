---
title: "Definición de Components - Framework Sword"
description: "Aprende a definir Components en Sword usando la macro #[injectable]. Comprende la resolución de dependencias y patrones de inyección múltiple."
outline: [2, 3]

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

En este ejemplo, `TaskRepository` no requiere un constructor especifico, ya que, el sistema de inyección de dependencias se encargará de resolver cada campo del `Component` y lo construirá automáticamente.

Probablemente te diste cuenta que `Database` está envuelto en un puntero `Arc`. Esto no es obligatorio, pero puede ser útil para clonar sin mucho costo, de esta forma puedes compartir referencias de un mismo `Component` o `Provider` en diferentes lugares sin generar clones innecesarios.

### Inyección múltiple

Un `Component` puede depender de múltiples `Provider`, `Component` y estructuras marcadas con el atributo `#[config]`, aunque en el caso de estas últimas no es necesario envolverlas en un puntero `Arc`.

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
