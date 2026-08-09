---
title: "Interceptores en Controladores gRPC"
description: "Cómo aplicar interceptores a controladores gRPC en Sword: OnRequest y OnRequestWithConfig."
outline: [2, 3]
---

# Interceptores en Controladores gRPC

Sword permite aplicar interceptores a controladores gRPC para validar o transformar la metadata de entrada de las llamadas remotas.

## Interceptores tradicionales

### El Trait `OnRequest`

En gRPC, `OnRequest` permite interceptar la solicitud antes de que llegue al método del servicio.

::: code-group

```rust [interceptor.rs]
use sword::grpc::*;
use sword::prelude::*;

#[derive(Interceptor)]
struct AuthInterceptor;

#[sword::grpc::async_trait]
impl OnRequest for AuthInterceptor {
    async fn on_request(&self, req: Request<()>) -> GrpcInterceptorResult {
        if req.metadata().get("authorization").is_none() {
            return Err(Status::unauthenticated("missing authorization metadata"));
        }

        Ok(req)
    }
}
```

```rust [controller.rs]
use sword::prelude::*;

#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(AuthInterceptor)]
struct UsersController;
```

:::

::: info Sin `next()`
A diferencia de los interceptores web, en esta variante no existe `next()`: el interceptor valida/transforma metadata de entrada y retorna `Ok(req)` o un `Status` de error.
:::

## Interceptores con configuración

### El Trait `OnRequestWithConfig`

En gRPC puedes usar `OnRequestWithConfig<T>` para inyectar parámetros de configuración en la validación/intercepción.

::: code-group

```rust [interceptor.rs]
use sword::grpc::*;
use sword::prelude::*;

#[derive(Interceptor)]
struct ApiKeyInterceptor;

#[sword::grpc::async_trait]
impl OnRequestWithConfig<&'static str> for ApiKeyInterceptor {
    async fn on_request(
        &self,
        expected_key: &'static str,
        req: Request<()>,
    ) -> GrpcInterceptorResult {
        let Some(value) = req.metadata().get("x-api-key") else {
            return Err(Status::unauthenticated("missing x-api-key"));
        };

        let Ok(value) = value.to_str() else {
            return Err(Status::unauthenticated("invalid x-api-key"));
        };

        if value != expected_key {
            return Err(Status::permission_denied("invalid x-api-key"));
        }

        Ok(req)
    }
}
```

```rust [controller.rs]
use sword::prelude::*;

#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(ApiKeyInterceptor, config = "dev-key")]
struct UsersController;
```

:::
