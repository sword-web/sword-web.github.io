---
title: "Controladores de Jobs"
description: "Definición y registro de controladores de jobs en Sword."
outline: [2, 3]
aside: false
---

# Controladores de Jobs

En Sword, un controlador de jobs es una estructura que agrupa tareas programadas. Cada uno de sus métodos es un job que el scheduler ejecuta según la programación que declares.

Estos controladores están construidos sobre `tokio-cron-scheduler` y se integran con el sistema de módulos y la inyección de dependencias del framework.

## Habilitar la feature

Los controladores de jobs se habilitan con la feature `jobs`:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["jobs"] }
```

Habilitando esta feature puedes usar el import `sword::jobs::*` como prelude, que expone los atributos `cron`, `repeated` y `once` junto con `Uuid` y `JobScheduler`.

## Definir un controlador de jobs

Un controlador de jobs es una estructura anotada con `#[controller(kind = Controller::JobHandler)]`. A diferencia de los demás tipos de controlador, no recibe datos de enrutamiento (`path`, `namespace` ni `service`):

```rust
use std::time::Duration;
use sword::prelude::*;
use sword::jobs::*;

#[controller(kind = Controller::JobHandler)]
pub struct CleanupJobs;

impl CleanupJobs {
    #[repeated(Duration::from_secs(60))]
    async fn cleanup(&self, _uuid: Uuid, _scheduler: JobScheduler) {
        tracing::info!("Running periodic cleanup");
    }
}
```

## Firma del handler

Todo handler de un job debe ser `async` y recibir exactamente tres parámetros:

```rust
async fn job_name(&self, uuid: Uuid, scheduler: JobScheduler)
```

- `&self`: la instancia del controlador, para que un job pueda usar dependencias inyectadas.
- `uuid`: el identificador único del job en ejecución.
- `scheduler`: el `JobScheduler` en ejecución, útil para inspeccionar el job o consultar su próximo tick.

La macro valida esta firma en tiempo de compilación y reporta un error claro cuando no coincide.

## Inyección de dependencias

Como cualquier otro controlador, un controlador de jobs puede recibir dependencias en sus campos. El contenedor lo construye de la misma forma:

```rust
use std::sync::Arc;
use sword::prelude::*;
use sword::jobs::*;

#[injectable]
pub struct EmailService;

#[controller(kind = Controller::JobHandler)]
pub struct NotificationJobs {
    email: Arc<EmailService>,
}

impl NotificationJobs {
    #[cron("0 0 9 * * *")]
    async fn send_digest(&self, _uuid: Uuid, _scheduler: JobScheduler) {
        self.email.send_digest().await;
    }
}
```

## Registro

Igual que cualquier otro controlador, un controlador de jobs se registra desde un módulo con `register_controllers`:

```rust
impl Module for NotificationModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<NotificationJobs>();
    }
}
```

Solo los controladores de jobs registrados en un módulo se construyen y se programan. Consulta [Programación](/es/practical-guides/jobs/scheduling) para ver las programaciones disponibles y cómo se ejecuta el scheduler.
