---
title: "Manejo de eventos"
description: "Cómo Sword publica y consume eventos: definición de eventos, controladores de eventos y transportes disponibles."
outline: [2, 3]
aside: false
---

# Manejo de eventos

Los eventos permiten que una parte de la aplicación notifique a otras partes u otras aplicaciones sin llamarlas directamente. El publicador entrega un evento a un transporte, y el transporte lo entrega a cada handler suscrito a la key de ese evento.

Sword soporta dos transportes:

- Memoria vía `tokio::sync::mpsc`
- NATS vía `async_nats`

Ambos comparten la misma definición de evento, el mismo modelo de controladores y la misma API de publicación. Se diferencian en dónde se aloja el evento y en las garantías de entrega que ofrece cada transporte.

Esta página cubre el modelo compartido y cómo elegir un transporte.

## Cómo fluye un evento

Un evento es una struct con una key que identifica al evento. Publicarlo envía el valor a través del transporte seleccionado, de existir handlers suscritos a esa key serán invocados con el valor del evento.

<EventFlowDiagram />

Un handler es un método asíncrono que forma parte de un controlador el cual recibe y procesa un evento. La key es el contrato de enrutamiento.

## Habilitar eventos

Los eventos se dividen en la API base y una feature por transporte:

| Feature         | Habilita                                                     |
| --------------- | ------------------------------------------------------------ |
| `events`        | Definición de eventos, controladores y traits de publicación |
| `events-memory` | El transporte en memoria.                                    |
| `events-nats`   | El transporte NATS.                                          |

Para habilitar eventos, agrega la dependencia con las features requeridas, por ejemplo:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["events", "events-memory"] }
```

Una aplicación puede usar ambos transportes, pero cada handler solo puede usar uno. La feature `events` es obligatoria, y al menos una de las otras dos es necesaria.

## Definir un evento

Un evento es una struct anotada con una macro de atributo, por ejemplo:

```rust
use serde::{Deserialize, Serialize};
use sword::events::*;

#[event(key = "order.created")]
#[derive(Debug, Serialize, Deserialize)]
pub struct OrderCreated {
    pub order_id: String,
    pub total: u64,
}
```

La macro implementa `Event` para la struct y la registra, así el tipo se puede publicar y decodificar. Alrededor del atributo:

- La serialización es obligatoria. El evento se codifica con `serde_json`, así que el tipo debe implementar `Serialize` y `Deserialize`.

- La key debe ser única en la aplicación. Registrar dos eventos con la misma key falla en el inicio de la aplicación.

- La key no puede estar vacía y no puede contener la siguiente lista de caracteres:

  `#`, `>`, `<`, `*`, `!`, `?`, `=`, `~`, `&`, `|`, `^`, `$`, `@`, `%`, `` ` ``, `\`, `/`, `{`, `}`, `[`, `]`, `(`, `)`, `,`.

La macro implementa el trait `Event`, que expone la key y la codificación del evento:

<ApiSection title="API Reference: Trait 'Event'" :collapsed="true">

#### Obtener la key

```rust
fn key(&self) -> &'static str
```

**Retorna**

- La key con la que se registró el evento.

**Cuándo usarlo**

- Para enrutar o identificar un evento recibido como `&dyn Event`.

---

#### Serializar el evento

```rust
fn to_vec(&self) -> Result<Vec<u8>, EventCodecError>
```

**Retorna**

- `Ok(Vec<u8>)` con el evento en JSON.
- `Err(EventCodecError::Json)` si la serialización falla.

**Cuándo usarlo**

- Para inspeccionar o reenviar el payload crudo de un evento.

---

#### Recuperar el tipo concreto

```rust
pub fn cast<T: Event>(&self) -> Option<&T>
```

**Retorna**

- `Some(&T)` si el evento es del tipo `T`.
- `None` si es de otro tipo.

**Cuándo usarlo**

- Dentro de un handler que recibe `&dyn Event`. Se explica en [Wildcards de NATS](/es/practical-guides/events/nats/#wildcards-y-handlers-dinamicos).

</ApiSection>

## Publicar eventos

El publicador se inyecta como cualquier otro provider en la aplicación. El tipo concreto depende del transporte:

- En Memoria: `MemoryEventPublisher`
- En NATS: `NatsEventPublisher`.

```rust
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[injectable]
pub struct OrderService {
    publisher: Arc<MemoryEventPublisher>,
}

impl OrderService {
    pub async fn create_order(&self, order: OrderCreated) -> Result<(), EventPublishError> {
        self.publisher.publish(order).await
    }
}
```

Cambia `MemoryEventPublisher` por `NatsEventPublisher` si publicas por NATS. Ambos implementan el mismo trait:

<ApiSection title="API Reference: Trait 'EventPublish'" :collapsed="true">

#### Publicar un evento

```rust
fn publish(
    &self,
    event: impl Event + 'static,
) -> impl Future<Output = Result<(), EventPublishError>> + Send
```

**Parámetros**

- `event`: el evento a publicar. Debe implementar `Event`.

**Retorna**

- `Ok(())` cuando el transporte acepta el evento.
- `Err(EventPublishError)` según la siguiente tabla.

**Cuándo usarlo**

- Desde controladores, servicios o interceptores que necesiten emitir un evento.

**Errores de publicación**

| Error          | Cuándo se emite                                                   |
| -------------- | ----------------------------------------------------------------- |
| `Closed`       | El canal en memoria dejó de recibir (normalmente tras el apagado) |
| `NotConnected` | Se publica antes de que NATS conecte                              |
| `Codec`        | El evento no se puede serializar                                  |
| `Transport`    | El cliente no puede enviar el evento                              |

</ApiSection>

## Declarar controladores de eventos

Declara los handlers en un controlador cuyo atributo `kind` es `Controller::Events`.

El atributo `source` selecciona qué transporte consume sus suscripciones:

```rust
use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[controller(kind = Controller::Events, source = EventSource::Memory)]
pub struct OrderEventsHandler;

impl OrderEventsHandler {
    #[subscribe(key = "order.created")]
    async fn on_created(&self, event: &OrderCreated) -> EventHandlerResult<()> {
        tracing::info!(order_id = %event.order_id, "order created");

        Ok(())
    }
}
```

Cada método anotado con `#[subscribe(key = "...")]` se convierte en un handler para un evento con la key indicada.

El atributo `source` se puede declarar en el controlador o en handlers individuales, pero no en ambos. Las reglas son:

- Declarado en el controlador, todos los `#[subscribe]` de ese controlador usan ese transporte.

- Declarado en un handler con `#[subscribe(key = "...", source = ...)]`, solo ese handler lo usa, y el controlador no debe declarar uno.

- Sin declararlo en ninguno de los dos, la compilación falla.

El valor debe ser `EventSource::Memory` o `EventSource::Nats`, y la feature correspondiente debe estar habilitada.

## Elegir un transporte

| Comportamiento          | En memoria                         | NATS                                  |
| ----------------------- | ---------------------------------- | ------------------------------------- |
| Alcance                 | El proceso actual                  | Todo proceso conectado al servidor    |
| Serialización           | Ninguna, se entrega el mismo valor | Payload JSON                          |
| Entrega                 | At-most-once                       | At-most-once (core NATS)              |
| Reintentos              | Configurables, con espera          | Ninguno                               |
| Orden                   | No garantizado                     | No garantizado                        |
| Suscripciones wildcard  | No, las keys coinciden exactamente | Sí, `*` y `>`                         |
| Grupos de cola          | No                                 | Sí, con balanceo entre instancias     |
| Persistencia            | No                                 | No (JetStream planeado)               |
| Dependencia de arranque | Ninguna                            | El servidor NATS debe estar accesible |

Usa eventos en memoria para desacoplar partes de un mismo proceso, no necesita infraestructura, entrega el valor sin serializarlo y permite reintentar un handler que falla. Usa NATS cuando el productor y el consumidor son procesos distintos, o cuando varias instancias deben repartirse el trabajo.
