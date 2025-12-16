---
title: Usando Dependencias - Framework Sword
description: Aprende cómo inyectar dependencias en Controllers y Middlewares. Ve ejemplos prácticos de inyección de dependencias en acción.
keywords:
  [
    "usando dependencias",
    "inyección controller",
    "inyección middleware",
    "framework sword",
    "uso de dependencias",
    "inyección de servicios",
  ]
---

# Uso de Dependencias Inyectadas en `Controllers` y `Middlewares`

Una vez que hayas definido y registrado tus `Providers` y `Components`, puedes inyectarlos en `Controllers` y `Middlewares` siguiendo el mismo patrón que en los ejemplos anteriores.

De manera similar a un `Component`, tanto los `Controllers` como los `Middlewares` pueden declarar dependencias en sus campos. Estas dependencias pueden ser cualquier tipo registrado en el contenedor de dependencias, incluyendo otros `Components`, `Providers`, o incluso configuraciones personalizadas (`#[config]`).

## Ejemplo de Inyección en Controller

```rust
#[controller("/tasks")]
pub struct TaskController {
    service: Arc<TaskService>,
    app_config: ApplicationConfig,
}

#[routes]
impl TaskController {
    #[get("/")]
    pub async fn list_tasks(&self) -> HttpResponse {
        let tasks = self.service.get_all_tasks().await;

        HttpResponse::Ok().data(tasks)
    }
}
```

## Middleware Injection Example

```rust
#[middleware]
pub struct AuthMiddleware {
    auth_service: Arc<AuthService>,
}

impl OnRequest for AuthMiddleware {
    async fn on_request(&self, req: Request) -> MiddlewareResult {
        let token = req.headers().get("Authorization");

        if let Some(token) = token {
            if self.auth_service.validate_token(token).await {
                return req.next().await;
            }
        }

        Err(HttpResponse::Unauthorized())
    }
}
```
