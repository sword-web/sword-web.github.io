---
title: "Interceptors in gRPC Controllers"
description: "How to apply interceptors to gRPC controllers in Sword: OnRequest and OnRequestWithConfig."
outline: [2, 3]
---

# Interceptors in gRPC Controllers

Sword lets you apply interceptors to gRPC controllers to validate or transform the incoming metadata of remote calls.

## Traditional interceptors

### The `OnRequest` Trait

In gRPC, `OnRequest` lets you intercept the request before it reaches the service method.

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

::: info No `next()`
Unlike web interceptors, there is no `next()` in this variant: the interceptor validates/transforms the incoming metadata and returns `Ok(req)` or an error `Status`.
:::

## Interceptors with configuration

### The `OnRequestWithConfig` Trait

In gRPC you can use `OnRequestWithConfig<T>` to inject configuration parameters into the validation/interception.

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
