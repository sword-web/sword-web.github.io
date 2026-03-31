# Manejo de solicitudes HTTP y extracción

En Sword, a diferencia de Axum, no se utilizan extractores individuales en la firma de los métodos del controlador web. En su lugar, se usa una estructura `Request` que concentra la información de la solicitud y expone una API unificada para acceder a body, query, params, headers, cookies y extensiones.

## Objeto general `Request`

`Request` actúa como un objeto de acceso central a la solicitud HTTP, de forma similar al `req` de otros frameworks web.

### Ejemplo

```rust
use serde_json::Value;
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/api")]
struct ApiController;

impl ApiController {
    #[post("/data")]
    async fn data(&self, req: Request) -> WebResult {
        let body = req.body::<Value>()?;

        Ok(JsonResponse::Ok().data(body))
    }
}
```

## ¿Por qué no usar extractores directamente?

Los extractores de Axum tienen ventajas, especialmente cuando quieres obtener solo los datos estrictamente necesarios en cada handler. Sin embargo, también introducen algunas desventajas en aplicaciones grandes:

- obligan a repetir extractores en muchos métodos
- el orden de los parámetros puede resultar menos evidente
- combinar muchos extractores puede afectar la legibilidad
- extender el comportamiento puede requerir más boilerplate

Sword intenta simplificar esa experiencia agrupando el acceso a la solicitud dentro de `Request`.

## Relación con Axum

Internamente, Sword sigue apoyándose en Axum. El objetivo no es reemplazar su modelo HTTP, sino ofrecer una API más uniforme para controladores web dentro del estilo del framework.

## Extender `Request`

Como `Request` es el punto central de acceso a la solicitud, también puedes extenderlo con traits propios para añadir helpers específicos de tu aplicación.

Ese enfoque se explica en [Extender Request](/es/practical-guides/web/request-handling/extending-request).
