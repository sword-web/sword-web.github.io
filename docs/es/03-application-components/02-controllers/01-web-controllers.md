---
title: "Definición de Controladores Web"
description: "En Sword un controlador web es una estructura que actúa como un grupo de methods relacionados a una ruta base, y cada método representa un endpoint HTTP específico."
outline: [2, 3]
---
# Definición de Controladores Web

En Sword un controlador web es una estructura que actúa como un grupo de methods relacionados a una ruta base, y cada método representa un endpoint HTTP específico. Se definen usando el atributo
`#[controller(kind = Controller::Web, path = "...")]`.

Estos controladores están basado en los handlers de `axum`, pero añadiendo una capa de integración con el sistema de módulos, inyección de dependencias e interceptors del framework.

## Definir un controlador web

```rust
use sword::prelude::*;
use sword::web::*;

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
use sword::web::*;

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

Para más detalles sobre extracción, revisa [Manejo de Requests](/es/practical-guides/web/request-handling/explanation).

## Métodos HTTP soportados

Sword soporta los métodos HTTP estándar que provee `axum`:

- GET: `#[get("...")]`
- POST: `#[post("...")]`
- PUT: `#[put("...")]`
- DELETE: `#[delete("...")]`
- PATCH: `#[patch("...")]`
- HEAD: `#[head("...")]`
- OPTIONS: `#[options("...")]`
- CONNECT: `#[connect("...")]`
- TRACE: `#[trace("...")]`

Todos los métodos reciben la ruta de la misma forma, por ejemplo: `#[get("/")]`, `#[post("/api/users")]`, etc.

## Sobre `&self`

Los handlers reciben `&self` porque el controlador puede tener dependencias inyectadas en sus campos.

Ese flujo se explica en [Inyección de Dependencias](/es/application-components/di/).

## Tipo de retorno

Sword busca simplificar y estandarizar las respuestas HTTP hacia un formato JSON común, por lo que el tipo de retorno recomendado es `JsonResponse` o `WebResult`, un alias de `Result<JsonResponse, JsonResponse>`.

También puedes usar `WebResult<JsonResponse>` explícitamente para mayor claridad:

```rust
#[get("/")]
async fn get_users(&self, req: Request) -> WebResult<JsonResponse> {
    let data = req.body::<Vec<User>>()?;
    Ok(JsonResponse::Ok().data(data).request_id(req.id()))
}
```

Para todos los patrones de respuesta — auto-wrap con `Result<T, E>`, manejo de errores y construcción de payload — consulta [Manejo de Respuestas](/es/practical-guides/web/response-handling).

Sin embargo, los métodos del controlador también pueden retornar cualquier tipo que implemente `IntoResponse`, ya que la capa web de Sword se apoya en `axum`.
