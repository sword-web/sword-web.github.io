---
title: "Inversión de dependencias con #[contract] - Framework Sword"
description: "Aprende cómo #[contract] implementa la inversión de dependencias: depende de abstracciones, no de implementaciones concretas."
outline: [2, 3]
keywords:
    [
        "contract",
        "inversión de dependencias",
        "dependency inversion",
        "DI",
        "#[contract]",
        "injectable",
        "sword framework",
    ]
---

# Inversión de dependencias con `#[contract]`

## ¿Qué es la inversión de dependencias?

La inversión de dependencias es un concepto que referencia a la práctica de que el código dependa de **abstracciones** (traits), no de **implementaciones concretas** (structs específicos).

Un ejemplo cotidiano: una laptop funciona con cualquier impresora que siga el estándar USB. A la laptop no le importa la marca de la impresora — solo le importa el **contrato** (USB). Puedes cambiar de impresora sin modificar la laptop.

El mismo principio aplica al código: en lugar de que un controller cree un `DatabaseTaskRepository` directamente, depende de un trait `TaskRepository`. La implementación real puede cambiar sin tocar el controller.

## ¿Cuándo se usa?

- Tienes múltiples fuentes de datos (base de datos, caché, API externa) y quieres cambiarlas sin afectar la lógica de negocio.
- Quieres probar la lógica de negocio sin tener que configurar una base de datos real.
- Trabajas en equipo y quieres separar _qué_ hace algo de _cómo_ lo hace.
- Anticipas que una tecnología podría cambiar en el futuro.

## ¿Qué es un `#[contract]`?

Un `contract` es un trait anotado con `#[contract]`. Define **qué** hace algo, no **cómo** lo hace.

```rust
use sword::prelude::*;

#[contract]
pub trait TaskRepository {
    async fn find_all(&self) -> Vec<Value>;
}
```

Este contrato dice: "cualquier cosa que me implemente puede encontrar todas las tareas". No dice si las tareas vienen de PostgreSQL, Redis o una lista en memoria.

Los contracts soportan métodos `async` y `sync`.

## ¿Cómo se implementa un contract?

La implementación real también usa `#[contract]` en el bloque `impl`:

```rust
#[contract]
impl TaskRepository for DatabaseTaskRepository {
    async fn find_all(&self) -> Vec<Value> {
        // consulta real a la base de datos
        todo!()
    }
}
```

Puedes tener múltiples implementaciones del mismo contract — una para producción, otra para pruebas, otra para una capa de caché.

## ¿Cómo se inyecta un contract?

Inyecta el contract como `Arc<dyn Trait>` en cualquier struct que soporte inyección de dependencias.

### En un Controller

```rust
#[controller(kind = Controller::Web, path = "/tasks")]
pub struct TasksController {
    repo: Arc<dyn TaskRepository>,
}
```

### En un Component (`#[injectable]`)

```rust
#[injectable]
pub struct TasksService {
    repo: Arc<dyn TaskRepository>,
}
```

### En un Provider (`#[injectable(provider)]`)

```rust
#[injectable(provider)]
pub struct TasksQueue {
    repo: Arc<dyn TaskRepository>,
}
```

La inyección funciona igual en los tres casos — el contenedor DI resuelve la implementación correcta automáticamente.

## Ejemplo Completo

**Antes** — fuertemente acoplado, difícil de probar:

```rust
pub struct TasksController {
    repo: DatabaseTaskRepository,
}

impl TasksController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        let tasks = self.repo.find_all().await; // necesita una DB real
        Ok(JsonResponse::Ok().data(tasks))
    }
}
```

**Después** — desacoplado, fácil de intercambiar:

```rust
// 1. Definir el contract
#[contract]
pub trait TaskRepository {
    async fn find_all(&self) -> Vec<Value>;
}

// 2. Implementarlo
#[contract]
impl TaskRepository for DatabaseTaskRepository {
    async fn find_all(&self) -> Vec<Value> {
        todo!()
    }
}

// 3. Usarlo en el controller
#[controller(kind = Controller::Web, path = "/tasks")]
pub struct TasksController {
    repo: Arc<dyn TaskRepository>,
}

impl TasksController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        let tasks = self.repo.find_all().await;
        Ok(JsonResponse::Ok().data(tasks))
    }
}
```

Ahora puedes cambiar la base de datos por una caché sin tocar el controller.

## Véase También

- [Providers](/es/application-components/di/providers)
- [Components](/es/application-components/di/components)
- [Inyectando Dependencias](/es/application-components/di/injecting)
