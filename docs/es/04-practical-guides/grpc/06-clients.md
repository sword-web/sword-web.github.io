---
title: "Clientes"
description: "Consumir servicios gRPC remotos desde una aplicación Sword como dependencias inyectables."
outline: [2, 3]
---

# Clientes gRPC

Sword permite consumir un servicio gRPC remoto como una dependencia inyectable, con el mismo mecanismo que usa para el resto de sus proveedores.

## Configuración

Cada cliente se declara en una sección `[grpc.clients.<nombre>]`:

| Key       | Tipo            | Default | Descripción                    |
| --------- | --------------- | ------- | ------------------------------ |
| `url`     | `String`        | —       | Dirección del servicio remoto  |
| `connect` | `eager \| lazy` | `lazy`  | Política de conexión del canal |
| `timeout` | `TimeUnit`      | `5s`    | Tiempo máximo por solicitud    |

```toml
[grpc.clients.users]
url = "http://users-service:50051"
connect = "lazy"
timeout = "5s"
```

## Registro en un módulo

El canal se construye con `Channel::from_config` y se registra como proveedor:

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

## Uso desde un componente

El cliente llega por inyección a cualquier componente:

```rust
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

## Políticas de conexión

- `lazy`: conecta en el primer uso y reintenta si el servicio no está disponible. Es el valor por defecto.
- `eager`: conecta al arrancar la aplicación y falla temprano si el servicio está caído.

## Errores

`Channel::from_config` devuelve `GrpcClientError`, con las variantes `MissingUrl`, `InvalidUrl` y `Connect`.
