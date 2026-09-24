---
title: "Data Validation"
description: "Input data validation is a fundamental aspect of web applications. It ensures that data meets specific rules before being processed or stored."
outline: [2, 3]
---
# Data Validation

Input data validation is a fundamental aspect of web applications. It ensures that data meets specific rules before being processed or stored.

Sword integrates support for the `validator` crate via the `validation-validator` feature.

## Enabling `validator`

To use validation based on the `validator` crate, add the dependencies and enable the corresponding feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["validation-validator"] }
serde = { version = "x.y.z", features = ["derive"] }
validator = { version = "x.y.z", features = ["derive"] }
```

With this enabled, you can use methods such as:

- `req.validated_body::<T>()`
- `req.validated_query::<T>()`
- `req.validated_params::<T>()`

## Example

### Defining DTOs

```rust
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
struct CreateUserDto {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Name must be between 1 and 50 characters"
    ))]
    pub name: String,

    #[validate(email(message = "Invalid email format"))]
    pub email: String,
}

#[derive(Debug, Deserialize, Validate, Default)]
struct GetUsersQuery {
    #[validate(range(min = 1, message = "Page must be at least 1"))]
    pub page: Option<u32>,

    #[validate(range(
        min = 1,
        max = 100,
        message = "Page size must be between 1 and 100"
    ))]
    pub page_size: Option<u32>,
}
```

### Controller Implementation

```rust
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/users")]
struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list(&self, req: Request) -> WebResult {
        let query = req.validated_query::<GetUsersQuery>()?.unwrap_or_default();
        println!("Listing users with query: {query:?}");

        Ok(JsonResponse::Ok().message("User list"))
    }

    #[post("/")]
    async fn create(&self, req: Request) -> WebResult {
        let data = req.validated_body::<CreateUserDto>()?;
        println!("Creating user with data: {data:?}");

        Ok(JsonResponse::Created().message("User created"))
    }
}
```

## Validation Error Response

Sword automatically handles validation errors and responds with an HTTP `400 Bad Request` status, including validation details in the response body.

### Request Body

```json
{
    "name": "",
    "email": "not_a_valid_email"
}
```

### Error Response

```json
{
    "code": 400,
    "errors": {
        "email": [
            {
                "code": "email",
                "message": "Invalid email format"
            }
        ],
        "name": [
            {
                "code": "length",
                "message": "Name must be between 1 and 50 characters"
            }
        ]
    },
    "message": "Invalid request body",
    "success": false,
    "timestamp": "2025-10-21T05:09:16Z"
}
```

## Final Note

This integration corresponds specifically to the `validation-validator` feature. If you decide to use another validation library, you will need to define your own validation logic and the error format you wish to expose.
