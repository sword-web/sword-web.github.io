# Definición de Controladores Web

Un controlador web en Sword es una `struct` marcada con `#[controller(kind = Controller::Web, path = "...")]`. Está basado en los handlers de `axum`, pero añade una capa de integración con el sistema de módulos, inyección de dependencias e interceptors del framework.

Sus métodos manejan rutas HTTP mediante atributos como `#[get("...")]`, `#[post("...")]`, `#[put("...")]`, `#[delete("...")]` y `#[patch("...")]`.

## Definir un controlador web

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/")]
    async fn list(&self) -> WebResult {
        Ok(JsonResponse::Ok().message("Users list"))
    }
}
```

## Registrar el controlador en un módulo

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

## Acceder a la request

Puedes recibir `req: Request` como parámetro y extraer params, body, query, headers, cookies y otros datos relacionados con la solicitud HTTP.

```rust
use sword::prelude::*;

#[controller(kind = Controller::Web, path = "/users")]
pub struct UsersController;

impl UsersController {
    #[get("/{id}")]
    async fn get_by_id(&self, req: Request) -> WebResult {
        let id = req.param::<u64>("id")?;

        Ok(JsonResponse::Ok().data(id))
    }
}
```

Para más detalles sobre extracción, revisa [Manejo de Requests](/es/usefull-patterns/request-handling/explanation).

## Métodos HTTP soportados

Sword soporta los métodos más comunes:

- `#[get("...")]`
- `#[post("...")]`
- `#[put("...")]`
- `#[delete("...")]`
- `#[patch("...")]`

## Sobre `&self`

Los handlers reciben `&self` porque el controlador puede tener dependencias inyectadas en sus campos.

Ese flujo se explica en [Inyección de Dependencias](/es/application-components/di/).

## Tipo de retorno

Sword busca simplificar y estandarizar las respuestas HTTP hacia un formato JSON común, por lo que el tipo de retorno recomendado es `JsonResponse` o `WebResult`, un alias de `Result<JsonResponse, JsonResponse>`.

Sin embargo, los métodos del controlador también pueden retornar cualquier tipo que implemente `IntoResponse`, ya que la capa web de Sword se apoya en `axum`.
