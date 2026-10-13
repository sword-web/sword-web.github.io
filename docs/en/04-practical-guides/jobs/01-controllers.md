---
title: "Job Controllers"
description: "Definition and registration of job controllers in Sword."
outline: [2, 3]
aside: false
---

# Job Controllers

In Sword, a job controller is a struct that groups scheduled tasks. Each of its methods is a job that the scheduler runs on a schedule you declare.

Job controllers are built on top of `tokio-cron-scheduler` and integrate with the framework's module system and dependency injection.

## Enabling the feature

Job controllers are enabled with the `jobs` feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["jobs"] }
```

Enabling this feature gives you the `sword::jobs::*` import as a prelude, which exposes the `cron`, `repeated`, and `once` attributes together with `Uuid` and `JobScheduler`.

## Defining a job controller

A job controller is a struct annotated with `#[controller(kind = Controller::JobHandler)]`. Unlike the other controller types, it takes no routing data (`path`, `namespace`, or `service`):

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

## Handler signature

Every job handler must be `async` and receive exactly three parameters:

```rust
async fn job_name(&self, uuid: Uuid, scheduler: JobScheduler)
```

- `&self`: the controller instance, so a job can use injected dependencies.
- `uuid`: the unique id of the running job.
- `scheduler`: the running `JobScheduler`, useful to inspect the job or query its next tick.

The attribute macro validates this signature at compile time and reports a clear error when it does not match.

## Dependency injection

As with any other controller, a job controller can receive dependencies in its fields. The container builds it the same way:

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

## Registration

Like any other controller, a job controller is registered from a module with `register_controllers`:

```rust
impl Module for NotificationModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<NotificationJobs>();
    }
}
```

Only the job controllers registered in a module are built and scheduled. See [Scheduling](/en/practical-guides/jobs/scheduling) for the available schedules and how the scheduler runs.
