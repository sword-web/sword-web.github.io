---
title: "Eventos NATS"
description: "Publicación y consumo de eventos sobre NATS en Sword: subjects, wildcards, grupos de cola y garantías de entrega."
outline: [2, 3]
aside: false
---

# Eventos NATS

NATS es un sistema de mensajería de código abierto, ligero y de alto rendimiento, diseñado para construir sistemas distribuidos modernos, en cualquier nube o en cualquier entorno perimetral definido por el usuario.

Sword soporta NATS como transporte de eventos. Un servicio puede publicar un evento y otro escucharlo sin conocerse, y ambos pueden estar en procesos distintos, incluso en máquinas distintas.

Antes de leer esta página es recomendable conocer el [modelo compartido de eventos](/es/practical-guides/events/handling-events) en Sword.

## Conectar la aplicación

Agrega la feature `events-nats` a la dependencia de Sword:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["events", "events-nats"] }
```

Configura el servidor en la sección `[events.nats]`:

| Key                        | Tipo     | Default                 | Descripción                                              |
| -------------------------- | -------- | ----------------------- | -------------------------------------------------------- |
| `url`                      | `String` | `nats://127.0.0.1:4222` | Dirección del servidor (no puede estar vacía)            |
| `handler_timeout_ms`       | `u64`    | hereda de `[events]`    | Sobrescribe el timeout del handler para este transporte  |
| `connection_timeout_ms`    | `u64`    | `5000`                  | Tiempo máximo de un intento de conexión                  |
| `retry_on_initial_connect` | `bool`   | `false`                 | Reintenta cuando falla la primera conexión al arrancar   |
| `max_reconnects`           | `usize`  | sin límite              | Intentos antes de rendirse                               |
| `subscription_capacity`    | `usize`  | `65536`                 | Mensajes en buffer por suscripción antes de descartarlos |

```toml
[events.nats]
url = "nats://127.0.0.1:4222"
```

Cuando `[events.nats]` está presente, NATS debe estar disponible al arrancar. Si el servidor no responde, la aplicación no inicia. Habilitar la feature sin esa sección registra el publisher pero no abre una conexión.

`retry_on_initial_connect` sin `max_reconnects` reintenta para siempre. Define `max_reconnects` para acotar el arranque.

## Autenticación

`[events.nats.auth]` acepta uno de dos métodos.

| Método               | Keys               |
| -------------------- | ------------------ |
| Usuario y contraseña | `user`, `password` |
| Token                | `token`            |

```toml
[events.nats.auth]
user = "app"
password = "${NATS_PASSWORD}"
```

```toml
[events.nats.auth]
token = "${NATS_TOKEN}"
```

Los métodos son excluyentes. Un token junto con usuario y contraseña es un error de arranque.

## TLS

Una URL `tls://` cifra la conexión y verifica el certificado del servidor. Para una CA propia, define `ca_file` con el archivo de la CA.

```toml
[events.nats]
url = "tls://nats.example.com:4222"

[events.nats.tls]
ca_file = "/etc/nats/ca.pem"
```

El TLS mutuo agrega un certificado de cliente y su clave.

```toml
[events.nats.tls]
ca_file = "/etc/nats/ca.pem"
client_cert = "/etc/nats/client.pem"
client_key = "/etc/nats/client.key"
```

Una sección `[events.nats.tls]` exige TLS aunque la URL use `nats://`. Los archivos se revisan al arrancar.

## Subjects

El subject es el contrato entre servicios. Al elegir `order.created` estás definiendo la dirección del evento. En Sword se usa bajo el nombre de `key` para unificar la API de publicación y suscripción entre transportes.

En NATS los subjects se organizan comúnmente por puntos, de tal forma que un prefijo agrupa una familia de eventos:

```text
order.created
order.shipped
order.cancelled
```

Si dos suscripciones coinciden con el mismo mensaje, cada una lo recibe por separado, en otras palabras, un handler en `order.created` y otro en `order.*` procesan el mismo evento dos veces.

## Publicar eventos

Para publicar eventos desde un controlador o cualquier estructura bajo el contenedor de dependencias, inyecta `NatsEventPublisher` y llama a `publish` con el evento:

:::code-group

```rust [orders/controllers/web.rs]
use std::sync::Arc;

use sword::events::*;
use sword::prelude::*;
use sword::web::*;

use crate::orders::{CreateOrderDto, OrderCreated};

#[controller(kind = Controller::Web, path = "/orders")]
pub struct OrdersController {
    publisher: Arc<NatsEventPublisher>,
}

impl OrdersController {
    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let body = req.body::<CreateOrderDto>()?;

        let event = OrderCreated {
            order_id: "order-1".to_string(),
            total: body.total,
        };

        self.publisher.publish(event).await.ok();

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

Un `publish` exitoso solo confirma que el evento salió de tu proceso. Por defecto, Sword utiliza el modelo pub/sub de NATS, que no acusa recibo ni garantiza que alguien lo haya leído. Si falla, el error dice por qué:

| Error          | Cuándo aparece                                | Qué revisar                                |
| -------------- | --------------------------------------------- | ------------------------------------------ |
| `NotConnected` | Se publica antes de que la aplicación conecte | Publica después del arranque               |
| `Codec`        | El evento no se puede serializar              | Los campos y los derives de `OrderCreated` |
| `Transport`    | El cliente no puede enviar el evento          | La conexión y los logs                     |

:::info

Puedes inspeccionar el error o bien ignorarlo convirtiéndolo en un `Option` como en el ejemplo anterior.

:::

## Consumir eventos

Para manejar eventos NATS declara un controlador de eventos con `transport = EventTransport::Nats` o bien en el handler si el controlador es agnóstico del transporte.

```rust [billing/controllers/events.rs]
use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[controller(kind = Controller::Events, transport = EventTransport::Nats)]
pub struct BillingEventsHandler;

impl BillingEventsHandler {
    #[subscribe(key = "order.created", group = "billing-workers")]
    async fn on_order_created(&self, event: &OrderCreated) -> EventHandlerResult<()> {
        tracing::info!(
            order_id = %event.order_id,
            total = event.total,
            "billing received order.created"
        );

        Ok(())
    }
}
```

La suscripción recibe como argumento una referencia al tipo concreto del evento, en este caso `&OrderCreated`. En caso de utilizar un [wildcard](#wildcards-y-handlers-dinamicos), el handler recibe `&dyn Event` y debe utilizar el método `cast` para acceder a los atributos de su tipo.

### Decodificación de eventos

Por defecto NATS entrega bytes a los consumidores. Sword tiene un enfoque JSON-first por lo que la decodificación del evento utiliza este formato como intermediario para deserializarlo al tipo concreto. Si el payload no coincide con el tipo, el mensaje se descarta.

## Wildcards y handlers dinámicos

Un wildcard permite que un handler escuche una familia de eventos sin declarar cada tipo. Es una característica de NATS y Sword la soporta en la suscripción:

- **Comodín de token único (\*)**: coincide con un solo token, por ejemplo un subject `order.*` recibe `order.created` y `order.shipped`, pero no `order.item.created` ya que este último tiene tres tokens.

- **Comodín completo (>)**: coincide con cualquier número de tokens, por ejemplo un subject `order.>` recibe `order.created`, `order.shipped` y `order.item.created`.

Un handler que está suscrito a un subject con _wildcards_ puede usar un evento tipado, sin embargo, los mensajes que no coincidan con el tipo se descartan y se pierde información. Por esto SIEMPRE se recomienda el uso de `&dyn Event` en handlers de este tipo.

```rust
use sword::events::*;
use sword::prelude::*;

use crate::orders::OrderCreated;

#[controller(kind = Controller::Events, transport = EventTransport::Nats)]
pub struct AuditEventsHandler;

impl AuditEventsHandler {
    #[subscribe(key = "order.*")]
    async fn on_order_event(&self, event: &dyn Event) -> EventHandlerResult<()> {
        tracing::info!(subject = %event.key(), "order event received");

        if let Some(order) = event.cast::<OrderCreated>() {
            tracing::info!(order_id = %order.order_id, "order created");
        }

        Ok(())
    }
}
```

## Escalar consumidores

Por defecto, cada instancia suscrita a un subject (key) recibe el evento. Con tres instancias de la aplicación, el handler se ejecuta tres veces. Eso encaja cuando cada nodo necesita reaccionar por su cuenta, por ejemplo para invalidar su caché local, pero no cuando el trabajo debe hacerse una sola vez, como emitir una factura.

Los _queue groups_ de NATS permiten repartir el trabajo con balanceo de carga. Varias instancias declaran el mismo subject y el mismo `group`:

```rust
#[subscribe(key = "order.created", group = "billing-workers")]
```

Los grupos son independientes, es decir, si `billing-workers` y `audit-workers` escuchan el mismo subject, cada grupo recibe su propia copia.

:::info
Este mecanismo es útil en entornos donde tu aplicación se escala horizontalmente como en orquestadores de contenedores.
:::
