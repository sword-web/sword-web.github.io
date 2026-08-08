---
title: "Interceptores en Controladores gRPC"
description: "Cómo aplicar interceptors a controladores gRPC en Sword: OnRequest y OnRequestWithConfig."
outline: [2, 3]
---

# Interceptores en Controladores gRPC

Sword permite aplicar interceptors a controladores gRPC para validar o transformar la metadata de entrada de las llamadas remotas.

## Interceptors tradicionales

### El Trait `OnRequest`

En gRPC, `OnRequest` permite interceptar la request antes de que llegue al método del servicio.

```rust
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

Aplicación sobre un controlador gRPC:

```rust
#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(AuthInterceptor)]
struct UsersController;
```

En esta variante no existe `next()`: el interceptor valida/transforma metadata de entrada y retorna `Ok(req)` o un `Status` de error.

## Interceptors con configuración

### El Trait `OnRequestWithConfig`

En gRPC puedes usar `OnRequestWithConfig<T>` para inyectar parámetros de configuración en la validación/intercepción.

```rust
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

Aplicación sobre un controlador gRPC:

```rust
#[controller(kind = Controller::Grpc, service = proto::user_service_server::UserServiceServer)]
#[interceptor(ApiKeyInterceptor, config = "dev-key")]
struct UsersController;
```
