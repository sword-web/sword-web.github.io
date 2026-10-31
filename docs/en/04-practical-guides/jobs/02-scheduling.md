---
title: "Scheduling"
description: "How to schedule jobs in Sword with cron expressions, repeated intervals, and one-shot delays."
outline: [2, 3]
aside: false
---

# Scheduling

Each method of a job controller is scheduled with one of three attributes: `cron`, `repeated`, or `once`. You can combine as many jobs as you want in a single controller.

## Cron schedules

The `#[cron("...")]` macro runs a job following a cron expression:

```rust
#[cron("0 */5 * * * *")]
async fn refresh_cache(&self, _: Uuid, _: JobScheduler) {
    // Runs every 5 minutes.
}
```

The expression has six fields and is interpreted in UTC:

```text
sec   min   hour   day of month   month   day of week
*     *     *      *              *       *
```

The year may be omitted. For example, `"0 0 9 * * *"` runs every day at 09:00 UTC, and `"0 0 * * * *"` runs every hour on the hour.

## Repeated intervals

The `#[repeated(Duration)]` macro runs a job every time the given duration elapses:

```rust
use std::time::Duration;

#[repeated(Duration::from_secs(30))]
async fn poll(&self, _: Uuid, _: JobScheduler) {
    // Runs every 30 seconds.
}
```

## One-shot jobs

The `#[once(Duration)]` macro runs a job a single time, after the given duration:

```rust
use std::time::Duration;

#[once(Duration::from_secs(10))]
async fn warm_up(&self, _: Uuid, _: JobScheduler) {
    // Runs once, 10 seconds after startup.
}
```

## Running and shutdown

The job scheduler is an engine of the application. It starts when `Application::run` is called and runs alongside the rest of the engines (Web, Socket.IO, Events or gRPC). When the application stops, the scheduler stops with it.

The web example includes a jobs module with all three schedules on [GitHub](https://github.com/sword-web/sword/tree/main/examples/web/src/jobs).
