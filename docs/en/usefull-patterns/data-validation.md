---
title: Data Validation - Sword Framework
description: Implement robust data validation in Sword applications using the validator crate. Learn validation patterns and custom validation logic.
keywords: ["data validation", "validator crate", "rust validation", "input validation", "sword framework", "form validation"]
---

# Data Validation

Data validation is a fundamental aspect of web applications. It ensures that incoming data meets specific rules before being processed or stored.

Sword provides a feature flag called `validator`, which includes compatibility with the `validator` crate. However, it's up to you to decide whether to use this functionality or implement your own validation logic based on other crates.

## Using the `validator` Crate

To use the `validator` crate in your Sword project, first add it to your `Cargo.toml` file:

```toml
[dependencies]
validator = { version = "^0.20.0", features = ["derive"] }
sword = { version = "0.2.0", features = ["validator"] }
serde = { version = "^1.0.228", features = ["derive"] }
```

With this, you'll be able to use the `ValidatorRequestValidation` trait that is implemented on the `Request` structure when the `validator` feature flag is enabled.

## Example

### Defining DTOs

```rust
use validator::Validate;
use serde::Deserialize;

#[derive(Debug, Deserialize, Validate)]
struct CreateUserDto {
    #[validate(length(
        min = 1,
        max = 50,
        message = "Name must be between 1 and 100 characters"
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

#[controller("/")]
struct UsersController;

#[routes]
impl UsersController {
    #[get("/")]
    async fn list(&self, req: Request) -> HttpResult {
        let query = req.query_validator::<GetUsersQuery>()?;
        println!("Listing users with query: {query:?}");

        Ok(HttpResponse::Ok().message("User list"))
    }

    #[post("/")]
    async fn create(&self, req: Request) -> HttpResult {
        let data = req.body_validator::<CreateUserDto>()?;
        println!("Creating user with data: {data:?}");

        Ok(HttpResponse::Created().message("User created"))
    }
}
```

## Validation Error Response

Sword automatically handles validation errors and responds with an HTTP `400 Bad Request` status, including details about the validation errors in the response body.

### Request Body

```json
{
    "name": "",
    "email": "not_an_valid_email"
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
        "message": "Name must be between 1 and 100 characters"
      }
    ]
  },
  "message": "Invalid request body",
  "success": false,
  "timestamp": "2025-10-21T05:09:16Z"
}
```

However, this standardized validation is limited to the `validator` feature flag. If you decide to implement your own validation logic, you'll be responsible for handling and formatting validation errors according to your needs.

If you'd like Sword to implement support for another validation crate, you can contribute to the project or open an issue in Sword's official GitHub repository.
