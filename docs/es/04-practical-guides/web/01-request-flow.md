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

::: details Comparación de extractores en Axum y Sword

::: code-group

```rust [Axum]
use axum::{
    extract::{FromRequest, Json},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::de::DeserializeOwned;
use validator::Validate;

// Extractor personalizado que valida el body antes de usarlo
pub struct ValidatedBody<T>(pub T);

impl<T, S> FromRequest<S> for ValidatedBody<T>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
{
    type Rejection = Response;

    async fn from_request(
        req: axum::extract::Request,
        state: &S,
    ) -> Result<Self, Self::Rejection> {
        let Json(payload) = Json::<T>::from_request(req, state)
            .await
            .map_err(|err| err.into_response())?;

        payload
            .validate()
            .map_err(|err| (StatusCode::UNPROCESSABLE_ENTITY, err.to_string()).into_response())?;

        Ok(ValidatedBody(payload))
    }
}

// Uso en el handler: el body llega ya validado
async fn create_user(ValidatedBody(body): ValidatedBody<CreateUserDto>) -> impl IntoResponse {
    Json(body)
}
```

```rust [Sword]
use sword::prelude::*;
use sword::web::*;

#[derive(Debug, Deserialize, Validate)]
struct CreateUserDto {
    #[validate(email(message = "Invalid email format"))]
    pub email: String,
}

#[controller(kind = Controller::Web, path = "/users")]
struct UsersController;

impl UsersController {
    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let data = req.validated_body::<CreateUserDto>()?;
        println!("Creating user with data: {data:?}");

        Ok(JsonResponse::Created().message("User created"))
    }
}
```

:::

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

Con este trait, puedes acceder fácilmente a información almacenada en las extensiones de la solicitud. No obstante podrías añadir lógica adicional, como validaciones o transformaciones, para mejorar la funcionalidad de la `Request` base.
