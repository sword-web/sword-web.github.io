---
title: "Eventos en memoria"
description: "Publicación y consumo de eventos en memoria en Sword: capacidad del canal, reintentos y semántica de entrega."
outline: [2, 3]
aside: false
---

# Eventos en memoria

El transporte en memoria entrega eventos dentro del proceso actual. No requiere un broker externo, serialización ni red. El publicador envía el evento a un canal y el engine de eventos lo despacha a los handlers registrados para su key.

El modelo compartido de eventos y la definición del evento están en [Manejo de eventos](/es/practical-guides/events/handling-events). Los controladores y su registro, en [Controladores](/es/fundamental-concepts/controllers). Esta página cubre lo específico de memoria.

## Habilitar el transporte

Agrega la feature `events-memory` a la dependencia de Sword:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["events", "events-memory"] }
```

## Configuración

Configura el transporte en la sección `[events.memory]`. Todas las keys son opcionales. Una sección ausente usa los valores por defecto:

| Key                            | Tipo    | Default | Descripción                                               |
| ------------------------------ | ------- | ------- | --------------------------------------------------------- |
| `buffer_size`                  | `usize` | `1024`  | Capacidad del canal, en eventos (debe ser mayor que cero) |
| `num_of_event_retry`           | `u8`    | `3`     | Intentos extra tras el primer fallo del handler           |
| `delay_between_event_retry_ms` | `u64`   | `1000`  | Espera entre intentos, en milisegundos                    |

```toml
[events.memory]
buffer_size = 1024
num_of_event_retry = 3
delay_between_event_retry_ms = 1000
```

La cantidad de handlers que corren a la vez no se define acá. Usa `[events] concurrency`, que comparten todos los transportes. Ver [Concurrencia y contrapresión](/es/practical-guides/events/handling-events#concurrencia-y-contrapresion).

## Publicar eventos

El engine registra `MemoryEventPublisher` como provider. Inyéctalo en el controlador y publica con `publish`:

:::code-group

```rust [orders/controllers/web.rs]
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;
use sword::web::*;

use crate::orders::{CreateOrderDto, OrderCreated};

#[controller(kind = Controller::Web, path = "/orders")]
pub struct OrdersController {
    publisher: Arc<MemoryEventPublisher>,
}

impl OrdersController {
    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let body = req.body::<CreateOrderDto>()?;

        let event = OrderCreated {
            order_id: "order-1".to_string(),
            total: body.total,
        };

        self.publisher.publish(event).await.map_err(|error| {
            tracing::error!(%error, "failed to publish order.created");
            JsonResponse::InternalServerError().message("failed to publish event")
        })?;

        Ok(JsonResponse::Created().message("order created"))
    }
}
```

```rust [orders/events.rs]
use serde::{Deserialize, Serialize};
use sword::events::*;

#[event(key = "order.created")]
#[derive(Debug, Serialize, Deserialize)]
pub struct OrderCreated {
    pub order_id: String,
    pub total: f64,
}
```

:::

Un `publish` exitoso solo confirma que el evento quedó en el canal, no que se haya manejado.

El canal tiene una capacidad fija y es compartido por todos los eventos. Cuando está lleno, `publish` espera a que se libere espacio en lugar de descartar el evento.

El único error propio del transporte es `EventPublishError::Closed`, que aparece cuando el engine dejó de recibir, normalmente tras el apagado.

Para la firma de `publish` y el resto de errores, ver [Manejo de eventos](/es/practical-guides/events/handling-events).

## Suscripción a eventos

Selecciona el transporte del controlador con el atributo `source` en la macro `controller` del controlador. Si el controlador maneja eventos de múltiples transportes entonces cada handler puede usar el atributo `source` en la macro `subscribe`.

```rust
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;
use crate::store::EventStore;

#[controller(kind = Controller::Events, source = EventSource::Memory)]
pub struct OrderEventsHandler {
    store: Arc<EventStore>,
}

impl OrderEventsHandler {
    #[subscribe(key = "order.created")]
    async fn on_created(&self, event: &OrderCreated) -> EventHandlerResult<()> {
        self.store.record(&event.order_id);

        Ok(())
    }
}
```

:::info
A diferencia de **NATS**, en este transporte no hay _wildcards_. Los handlers deben suscribirse a la key literal del evento que quieran manejar. Ver [Wildcards de NATS](/es/practical-guides/events/nats/#wildcards-y-handlers-dinamicos).
:::

## Comportamiento ante fallos

| Situación                    | Resultado                                  |
| ---------------------------- | ------------------------------------------ |
| `buffer_size = 0`            | Error al iniciar la aplicación, no arranca |
| El handler devuelve un error | Se reintenta si está configurado           |
| Apagado de la aplicación     | Los pendientes se descartan y se registran |
