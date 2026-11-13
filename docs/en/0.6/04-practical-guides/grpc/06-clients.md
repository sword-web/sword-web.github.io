---
title: "Clients"
description: "Consume remote gRPC services from a Sword application as injectable dependencies."
outline: [2, 3]
---

# gRPC Clients

Sword lets you consume a remote gRPC service as an injectable dependency, through the same mechanism it uses for its other providers.

## Configuration

Each client is declared in a `[grpc.clients.<name>]` section:

| Key       | Type            | Default | Description               |
| --------- | --------------- | ------- | ------------------------- |
| `url`     | `String`        | —       | Remote service address    |
| `connect` | `eager \| lazy` | `lazy`  | Channel connection policy |
| `timeout` | `TimeUnit`      | `5s`    | Per-request timeout       |

```toml
[grpc.clients.users]
url = "http://users-service:50051"
connect = "lazy"
timeout = "5s"
```

## Registering in a module

The channel is built with `Channel::from_config` and registered as a provider:

```rust
use sword::grpc::*;
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {
        let grpc = config.get_or_default::<GrpcApplicationConfig>();
        let channel = Channel::from_config(grpc.expect_client("users"))
            .await
            .expect("valid gRPC client channel");

        providers.register(UserServiceClient::new(channel));
    }
}
```

## Using it from a component

The client is injected into any component:

```rust
use std::sync::Arc;

#[injectable]
pub struct UsersService {
    client: Arc<UserServiceClient<Channel>>,
}

impl UsersService {
    pub async fn list(&self) -> Result<Vec<UserItem>, Status> {
        let mut client = self.client.as_ref().clone();

        let response = client.list_users(Request::new(ListUsersRequest {})).await?;
        let users = response.into_inner().users;

        Ok(users)
    }
}
```

## Connection policies

- `lazy`: connects on first use and retries if the service is unavailable. This is the default.
- `eager`: connects while the application starts and fails early if the service is down.

## Errors

`Channel::from_config` returns `GrpcClientError`, with the `MissingUrl`, `InvalidUrl` and `Connect` variants.
