# Validación de Datos

La validación de los datos de entrada es un aspecto fundamental en aplicaciones web. Esto garantiza que los datos respeten reglas especificas antes de ser procesados o almacenados.

Sword proporciona una `feature-flag` llamada `validator`, que incorpora compatibilidad con el crate `validator`. Sin embargo, es el usuario quien decide si utiliza esta funcionalidad o implementa su propia lógica de validación basada en otros crates.

## Uso del Crate `validator`

Para utilizar el crate `validator` en tu proyecto Sword, primero debes agregarlo a tu archivo `Cargo.toml`:

```toml
[dependencies]
validator = { version = "^0.20.0", features = ["derive"] }
sword = { version = "0.2.0", features = ["validator"] }
serde = { version = "^1.0.228", features = ["derive"] }
```

Con esto, podrás utilizar el trait `ValidatorRequestValidation` que se implementa sobre la estructura `Request` al habilitar la `feature-flag` `validator`.

## Ejemplo

### Definición de DTOs

```rust
use validator::Validate;
use serde::Deserialize;

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

### Implementación del Controlador

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

## Respuesta de Error de Validación

Sword maneja automáticamente los errores de validación y responde con un estado HTTP `400 Bad Request`, incluyendo detalles sobre los errores de validación en el cuerpo de la respuesta. 

### Cuerpo de la Solicitud

```json
{
    "name": "",
    "email": "not_an_valid_email"
}
```

### Respuesta de Error

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

Sin embargo esta estandarización de validación se limita al feature-flag `validator`. Si decides implementar tu propia lógica de validación, serás responsable de manejar y formatear los errores de validación según tus necesidades.

Si deseas que Sword implemente soporte para otro crate de validación, puedes contribuir al proyecto o abrir un `issue` en el repositorio oficial de Sword en GitHub.