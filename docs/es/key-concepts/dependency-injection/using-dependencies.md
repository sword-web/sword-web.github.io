---
title: Usando Dependencias - Sword Framework
description: Aprende a inyectar dependencias en Controllers y Middlewares. Ve ejemplos prácticos de inyección de dependencias en acción.
keywords: ["usando dependencias", "inyección en controller", "inyección en middleware", "sword framework", "uso de dependencias", "inyección de servicios"]
---

# Utilizando dependencias inyectadas en `Controllers` y `Middlewares`

Una vez que has definido y registrado tus `Providers` y `Components`, puedes inyectarlos en `Controllers` y `Middlewares` siguiendo el mismo patrón que en los ejemplos anteriores.

## Ejemplo de inyección en un `Controller`

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

## Ejemplo de inyección en un `Middleware`

```rust
#[middleware]
pub struct AuthMiddleware {
    auth_service: Arc<AuthService>,
}

impl OnRequest for AuthMiddleware {
    async fn on_request(&self, req: Request, next: Next) -> MiddlewareResult {
        let token = req.headers().get("Authorization");

        if let Some(token) = token {
            if self.auth_service.validate_token(token).await {
                next!(req, next)
            }
        }

        Err(HttpResponse::Unauthorized())
    }
}
```