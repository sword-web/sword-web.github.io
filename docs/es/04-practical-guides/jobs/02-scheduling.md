---
title: "Programación"
description: "Cómo programar jobs en Sword con expresiones cron, intervalos repetidos y retrasos de una sola ejecución."
outline: [2, 3]
aside: false
---

# Programación

Cada método de un controlador de jobs se programa con uno de tres atributos: `cron`, `repeated` u `once`. Puedes combinar tantos jobs como quieras en un mismo controlador.

## Programaciones cron

La macro `#[cron("...")]` ejecuta un job siguiendo una expresión cron:

```rust
#[cron("0 */5 * * * *")]
async fn refresh_cache(&self, _uuid: Uuid, _scheduler: JobScheduler) {
    // Se ejecuta cada 5 minutos.
}
```

La expresión tiene seis campos y se interpreta en UTC:

```text
sec   min   hour   day of month   month   day of week
*     *     *      *              *       *
```

El año puede omitirse. Por ejemplo, `"0 0 9 * * *"` se ejecuta todos los días a las 09:00 UTC, y `"0 0 * * * *"` se ejecuta cada hora en punto.

## Intervalos repetidos

La macro `#[repeated(Duration)]` ejecuta un job cada vez que transcurre la duración indicada:

```rust
use std::time::Duration;

#[repeated(Duration::from_secs(30))]
async fn poll(&self, _uuid: Uuid, _scheduler: JobScheduler) {
    // Se ejecuta cada 30 segundos.
}
```

## Jobs de una sola ejecución

La macro `#[once(Duration)]` ejecuta un job una única vez, tras la duración indicada:

```rust
use std::time::Duration;

#[once(Duration::from_secs(10))]
async fn warm_up(&self, _uuid: Uuid, _scheduler: JobScheduler) {
    // Se ejecuta una vez, 10 segundos después del arranque.
}
```

## Ejecución y apagado

El scheduler de jobs es un engine de la aplicación: arranca cuando se llama a `Application::run` y corre junto al resto de engines (web, Socket.IO o gRPC). Al apagarse, el scheduler se detiene de forma ordenada con la aplicación.
