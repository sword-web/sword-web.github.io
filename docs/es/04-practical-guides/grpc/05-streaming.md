---
title: "Streaming en gRPC"
description: "Cómo implementar RPC con streaming de servidor, cliente y bidireccional en controladores gRPC de Sword usando GrpcStream y GrpcResponse::stream."
outline: [2, 3]
---

# Streaming en gRPC

Los RPC de streaming permiten transferir secuencias de mensajes en lugar de un único mensaje. En [Fundamentos y contratos gRPC](/es/practical-guides/grpc/protocol-buffers) se listan los tres tipos: server streaming, client streaming y bidireccional. Esta guía muestra cómo implementarlos en un controlador de Sword.

## Streaming de servidor

En server streaming el cliente envía una solicitud y el servidor responde con un stream de mensajes. El trait generado por `tonic` define un tipo asociado por método (por ejemplo `type StreamUsersStream`) al que asignas `GrpcStream<T>`, y debes retornar `GrpcResult<Self::XxxStream>`.

Puedes construir el stream con `async_stream::try_stream` y envolverlo con `GrpcResponse::stream()`:

```rust
use async_stream::try_stream;
use std::sync::Arc;
use tokio::time::{self, Duration};

use sword::grpc::*;
use sword::prelude::*;

#[controller(kind = Controller::Grpc, service = UserServiceServer)]
pub struct UsersController {
    users: Arc<UserRepository>,
}

#[sword::grpc::async_trait]
impl UserService for UsersController {
    type StreamUsersStream = GrpcStream<UserItem>;

    async fn stream_users(
        &self,
        _: Request<StreamUsersRequest>,
    ) -> GrpcResult<Self::StreamUsersStream> {
        let users = self.users.find_all().await;

        let output = try_stream! {
            for user in users {
                yield UserItem::from(&user);

                time::sleep(Duration::from_secs(1)).await;
            }
        };

        Ok(GrpcResponse::stream(output))
    }
}
```

`GrpcResponse::stream()` caja y envuelve el stream en una `Response<GrpcStream<T>>`, lista para que el servidor la envíe al cliente.

## Streaming de cliente

En client streaming el cliente envía un stream de mensajes y el servidor responde con un único mensaje. El método recibe `Request<tonic::Streaming<T>>`; con `into_inner()` obtienes el stream y lo iteras por mensajes:

```rust
use tonic::Streaming;

use sword::grpc::*;
use sword::prelude::*;

#[sword::grpc::async_trait]
impl UserService for UsersController {
    async fn upload_users(&self, req: Request<Streaming<UserItem>>) -> GrpcResult<UploadReply> {
        let mut stream = req.into_inner();

        let mut count = 0u32;
        while let Some(item) = stream.message().await? {
            // ... procesar cada item ...
            count += 1;
        }

        Ok(GrpcResponse::message(UploadReply { count }))
    }
}
```

`stream.message().await` devuelve `Result<Option<T>, tonic::Status>`: `Some` por cada mensaje recibido y `None` cuando el cliente cierra el stream.

## Streaming bidireccional

En bidi streaming ambos lados envían y reciben streams de forma concurrente. Recibes `Request<tonic::Streaming<T>>` y retornas `GrpcResult<Self::XxxStream>`, así que puedes combinar la iteración del stream entrante con `async_stream` para la respuesta:

```rust
use async_stream::try_stream;
use tonic::Streaming;

use sword::grpc::*;
use sword::prelude::*;

#[sword::grpc::async_trait]
impl UserService for UsersController {
    type ChatStream = GrpcStream<ChatReply>;

    async fn chat(&self, req: Request<Streaming<ChatMessage>>) -> GrpcResult<Self::ChatStream> {
        let mut incoming = req.into_inner();

        let output = try_stream! {
            while let Some(message) = incoming.message().await? {
                // ... construir una respuesta por mensaje ...
                yield ChatReply { text: message.text };
            }
        };

        Ok(GrpcResponse::stream(output))
    }
}
```

<ApiSection title="Tipos en streaming gRPC" :collapsed="false">

#### Tipo `GrpcStream<T>`

```rust
pub type GrpcStream<T> = Pin<Box<dyn Stream<Item = Result<T, Status>> + Send + 'static>>;
```

**Retorna**

- Un stream boxeado de mensajes `T` o errores `Status`.

**Cuándo usarlo**

- Como tipo del stream asociado en métodos de server streaming (`type StreamUsersStream = GrpcStream<T>`) y como resultado de `GrpcResponse::stream()`.

#### Método `GrpcResponse::stream()`

```rust
pub fn stream<T, S>(stream: S) -> tonic::Response<GrpcStream<T>>
where
    S: Stream<Item = Result<T, Status>> + Send + 'static,
```

**Retorna**

- Una `Response<GrpcStream<T>>` que envuelve un stream.

**Cuándo usarlo**

- En métodos de server streaming y bidireccionales para devolver una secuencia de mensajes.

</ApiSection>

## Notas

- `GrpcResponse` es una estructura sin estado: sus métodos son constructores estáticos.
- El tipo asociado que define el trait generado debe coincidir con `GrpcStream<T>`; si no, la implementación no compila.
- `async_stream` es una dependencia opcional pero cómoda para construir streams; también puedes implementar `Stream` a mano si lo prefieres.
