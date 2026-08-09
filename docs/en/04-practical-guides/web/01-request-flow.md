---
title: "The HTTP Request Flow"
description: "In Sword, unlike Axum, individual extractors are not used in the signature of web controller methods."
outline: [2, 3]
---

# HTTP Request Handling and Extraction

In Sword, unlike Axum, individual extractors are not used in the signature of the controller's methods. Instead, a struct centralizes the request information and exposes a unified API for accessing the body, query, params, headers, cookies, and more.

## The `Request` struct

This struct acts as a central access extractor for the HTTP request, similar to how it is handled in other frameworks.

### Example

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

## Why not use extractors directly?

Focused extractors have advantages, especially when you only want to retrieve the strictly necessary data for each handler. However, they also introduce some drawbacks in larger applications:

- They force you to repeat extractors across many methods.
- The order of the parameters can depend on ownership rules.
- Combining many extractors can affect readability.
- Extending behavior can require more boilerplate (custom extractors).

Sword tries to simplify that experience by grouping access through `Request`.

::: details Comparison of extractors in Axum and Sword

::: code-group

```rust [Axum]
use axum::{
    extract::{FromRequest, Json},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::de::DeserializeOwned;
use validator::Validate;

// Custom extractor that validates the body before using it
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

// Usage in the handler: the body arrives already validated
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

## Extending `Request`

Since `Request` is the central access point for the request, you can also extend it with your own traits to add application-specific helpers.

**Adding custom methods**

Assuming `User` and `SessionClaims` structs defined in your application, you can create a `RequestExt` trait to provide convenient methods to access this information from the request.

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

With this `trait`, you can easily access information stored in the request extensions. However, you could add additional logic, such as validations or transformations, to improve the functionality of the base `Request`.
