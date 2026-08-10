---
title: "API Reference gRPC"
description: "Referencia de la API gRPC de Sword: atributos del controlador, tipos base y constructores de respuesta."
outline: false
---

# La API gRPC de Sword

`Sword` expone los tipos y atributos necesarios para implementar controladores gRPC sobre el código generado por `tonic`. Esta es la referencia de esa API.

## Referencia de atributos

### Atributo `#[controller]`

```rust
#[controller(kind = Controller::Grpc, service = UserGrpcServiceServer)]
```

**Parámetros**

- `kind = Controller::Grpc`: marca la estructura como controlador gRPC.
- `service = UserGrpcServiceServer`: servidor generado por tonic para el servicio que implementa.

**Cuándo usarlo**

- En la estructura que implementa el trait del servicio generado por tonic.

### Atributo `#[sword::grpc::async_trait]`

```rust
#[sword::grpc::async_trait]
impl UserGrpcService for UsersController { ... }
```

**Cuándo usarlo**

- En la implementación del trait generado por tonic, para habilitar métodos `async` en traits.

## Tipos base

### Tipo `Request<T>`

```rust
pub use tonic::Request;
```

**Retorna**

- Envoltura de tonic sobre la solicitud entrante, con acceso a `into_inner()` (el mensaje) y `metadata()`.

**Cuándo usarlo**

- Como tipo de entrada en los métodos del servicio (por ejemplo `Request<GetUserRequest>`).

### Tipo `GrpcResult<T>`

```rust
pub type GrpcResult<T> = Result<Response<T>, Status>;
```

**Retorna**

- `Ok(Response<T>)` si la llamada se resuelve correctamente.
- `Err(Status)` si falla la llamada.

**Cuándo usarlo**

- Como tipo de retorno de los métodos del servicio.

### Tipo `GrpcStream<T>`

```rust
pub type GrpcStream<T> = Pin<Box<dyn Stream<Item = Result<T, Status>> + Send + 'static>>;
```

**Retorna**

- Un stream boxeado de mensajes `T` o errores `Status`.

**Cuándo usarlo**

- Como tipo del stream asociado en métodos de server streaming (`Self::StreamUsersStream`).

### Tipo `Status`

```rust
pub use tonic::Status;
```

**Retorna**

- El error gRPC estándar que tonic usa para comunicar fallos.

**Cuándo usarlo**

- Para construir errores directamente o convertir errores de dominio con `#[derive(GrpcError)]`. Ver [Errores gRPC con GrpcError](/es/practical-guides/grpc/errores-grpc).

### Tipo `GrpcStatus`

```rust
GrpcStatus::InvalidArgument()
    .message("invalid request")
    .bad_request("username", "username cannot be empty")
    .into() // -> tonic::Status
```

**Retorna**

- Un builder de `tonic::Status` que implementa el Richer Error Model, con un constructor por código de estado (`InvalidArgument()`, `NotFound()`, ...) y builders encadenables para detalles estandarizados.

**Cuándo usarlo**

- Cuando necesitas devolver una respuesta de error con detalles estructurados (`bad_request`, `localized_message`, `error_info`, `retry_after`, `help`, `debug_info`, `precondition_failure`, `quota_failure`, `request_info`, `resource_info`).

**Notas**

- Requiere la feature `grpc-error-details`.
- Se convierte a `tonic::Status` con `.into()` o `.build()`.
- En el cliente, `GrpcStatus::from_status(&status)` reconstruye el status y lee los detalles con `StatusExt`. Ver [Errores enriquecidos con `GrpcStatus`](/es/practical-guides/grpc/errores-grpc).

## Referencia de métodos

### Método `GrpcResponse::message()`

```rust
pub fn message<T>(value: T) -> tonic::Response<T>
```

**Retorna**

- Una `Response<T>` con un mensaje único.

**Cuándo usarlo**

- En métodos unary y client streaming para devolver una respuesta tipada.

### Método `GrpcResponse::stream()`

```rust
pub fn stream<T, S>(stream: S) -> tonic::Response<GrpcStream<T>>
where
    S: Stream<Item = Result<T, Status>> + Send + 'static,
```

**Retorna**

- Una `Response<GrpcStream<T>>` que envuelve un stream.

**Cuándo usarlo**

- En métodos de server streaming para devolver una secuencia de mensajes.

## Notas operativas

- `GrpcResponse` es una estructura sin estado: sus métodos son constructores estáticos.
- En métodos de server streaming, el trait generado define un tipo asociado (por ejemplo `type StreamUsersStream`) que debe coincidir con `GrpcStream<T>`.
- `Request<T>` y `Response<T>` son los tipos de `tonic` reexportados por `sword::grpc`.
