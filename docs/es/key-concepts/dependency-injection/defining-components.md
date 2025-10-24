---
title: Definiendo Components - Sword Framework
description: Aprende a definir Components en Sword usando la macro #[injectable]. Comprende la resolución de dependencias y patrones de inyección múltiple.
keywords: ["components", "injectable", "inyección de dependencias", "sword framework", "auto construcción", "patrón repository"]
---

# Definiendo y registrando `Components`

Un `Component` es una estructura `Injectable` que se autoconstruye en base a dependencias ya registradas en el contenedor. 

Este tipo de estructuras son ideales para representar partes modulares de la aplicación que dependen de otros servicios o configuraciones. Ejemplo, repositorios de datos, servicios de negocio, etc.

## Definiendo un `Component`

Para definir un `Component` debes usar el atributo `#[injectable(component)]` en la definición de la estructura.

Sin embargo, dado que es más frecuente definir componentes, el atributo `component` es el valor por defecto de la macro `#[injectable]`. 

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

En este ejemplo, `TaskRepository` no requiere un constructor explícito, ya que el sistema de inyección de dependencias se encargará de resolver e inyectar la dependencia `Database` automáticamente.

Seguramente habrás notado que `Database` está envuelto en un puntero `Arc`. Esto no es obligatorio, pero puede ser de utilidad para compartir instancias a tráves de múltiples componentes sin incurrir en costos de clonación innecesarios. Si quieres clonar la instancia, puedes utilizar solo `Database` directamente.

```rust
#[injectable]
pub struct TaskRepository {
    db: Database,
}
```
Esto hará que al construir `TaskRepository`, se clone la instancia de `Database` registrada en el contenedor.

### Ejemplo de inyección de múltiples dependencias

Un `Component` puede depender de múltiples `Providers`, `Components` y estructururas marcadas con la macro `config`. En el caso de las configuraciones, no es necesario envolverlas en `Arc`.

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

Ejemplo completo en [GitHub](https://github.com/sword-web/sword/tree/main/examples/dependency-injection/).

En las siguientes secciones verás como inyectar este `Provider` en componentes, controladores o middlewares.
