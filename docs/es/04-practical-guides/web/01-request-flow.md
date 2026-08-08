---
title: "El flujo de una petición HTTP"
description: "En Sword, a diferencia de Axum, no se utilizan extractores individuales en la firma de los métodos del controlador web."
outline: [2, 3]
---

# Manejo de solicitudes HTTP y extracción

En Sword, a diferencia de axum, no se utilizan extractores individuales en la firma de los métodos del controlador. En su lugar, se usa una estructura que concentra la información de la solicitud y expone una API unificada para acceder a body, query, params, headers, cookies y más.

## La estructura `Request`

Esta estructura actúa como un extractor de acceso central a la solicitud HTTP, de forma similar a como se maneja en otros frameworks.

### Ejemplo

```rust
use serde_json::Value;
use sword::prelude::*;
use sword::web::*;

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

Los extractores focalizados tienen ventajas, especialmente cuando quieres obtener solo los datos estrictamente necesarios en cada handler. Sin embargo, también introducen algunas desventajas en aplicaciones grandes:

- Obligan a repetir extractores en muchos métodos
- El orden de los parámetros puede depender de reglas de ownership
- Combinar muchos extractores puede afectar la legibilidad
- Extender el comportamiento puede requerir más boilerplate (extractores personalizados)

Sword intenta simplificar esa experiencia agrupando el acceso mediante `Request`.

## Extender `Request`

Como `Request` es el punto central de acceso a la solicitud, también puedes extenderlo con traits propios para añadir helpers específicos de tu aplicación.

**Añadiendo métodos personalizados**

Asumiendo estructuras `User` y `SessionClaims` definidas en tu aplicación, puedes crear un trait `RequestExt` para proporcionar métodos convenientes para acceder a esta información desde la solicitud.

```rust
use sword::prelude::*;
use sword::web::*;

pub trait RequestExt {
    fn user(&self) -> Option<&User>;
    fn claims(&self) -> Option<&SessionClaims>;
}

impl RequestExt for Request {
    fn user(&self) -> Option<&User> {
        self.extensions.get::<User>()
    }

    fn claims(&self) -> Option<&SessionClaims> {
        self.extensions.get::<SessionClaims>()
    }
}
```

Con este `trait`, puedes acceder fácilmente a información almacenada en las extenciones de la solicitud. No obstante podrías añadir lógica adicional, como validaciones o transformaciones, para mejorar la funcionalidad de la `Request` base.
