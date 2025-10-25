---
title: Using Dependencies - Sword Framework
description: Learn how to inject dependencies in Controllers and Middlewares. See practical examples of dependency injection in action.
keywords: ["using dependencies", "controller injection", "middleware injection", "sword framework", "dependency usage", "service injection"]
---

# Using Injected Dependencies in `Controllers` and `Middlewares`

Once you have defined and registered your `Providers` and `Components`, you can inject them into `Controllers` and `Middlewares` following the same pattern as in the previous examples.

## Controller Injection Example

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