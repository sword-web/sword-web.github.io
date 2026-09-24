---
title: "Manejo de errores"
description: "Modelo general para manejar errores en Sword: errores de dominio tipados y su traducción uniforme a cada transporte."
outline: [2, 3]
---

# Manejo de errores

Esta página describe el modelo general para manejar errores en Sword. El detalle de cada transporte está en las [guías prácticas](#por-transporte).

## Errores de dominio, no de transporte

Los servicios, repositorios y demás componentes de un módulo no deberían devolver errores HTTP ni `Status` de gRPC. En su lugar, cada módulo define sus propios errores como un enum tipado. Lo habitual es describir cada variante con `thiserror`:

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum UserError {
    #[error("Usuario no encontrado")]
    NotFound,

    #[error("El usuario ya existe")]
    AlreadyExists,
}
```

Ese enum no sabe nada del protocolo que lo va a exponer. Gracias a eso puedes reutilizarlo en controladores HTTP, gRPC o Socket.IO, y probar la lógica del dominio sin levantar un servidor.

## Traducción por transporte

Cada transporte aporta una macro que convierte el enum de dominio en la respuesta que le corresponde. Los atributos sobre cada variante declaran cómo se traduce:

| Transporte | Macro | Resultado |
|---|---|---|
| Web | `HttpError` | `JsonResponse` con su status HTTP |
| gRPC | `GrpcError` | `tonic::Status` |

En los dos casos el procedimiento es el mismo: derivas la macro sobre el enum y anotas cada variante con el código y el mensaje que quieres exponer.

## Propagación y composición

Dentro de tus funciones puedes propagar el error con `?`. Un controlador puede combinar errores de varios módulos usando variantes `transparent`, que delegan el mapeo en el error interno, y `#[from]`, que convierte entre tipos al encadenarlos:

```rust
#[derive(Debug, Error, HttpError)]
pub enum AppError {
    #[error("User error: {0}")]
    #[http(transparent)]
    User(#[from] UserError),
}
```

Así el error de un módulo conserva su mapeo aunque cruce el borde de otro.

## Trazabilidad

Cada variante puede declarar su propio nivel de `tracing` (`trace`, `debug`, `info`, `warn` o `error`). Si no lo indicas, el nivel se deriva del código de respuesta del transporte. De ese modo el registro refleja la severidad real del error sin que tengas que repetirla en cada handler.

## Principios

- Los errores se tipan como enums, no como cadenas de texto.
- El dominio no conoce el transporte; el mapeo ocurre en el borde.
- El formato hacia el cliente es uniforme dentro de cada protocolo.
- Solo se expone lo que declara cada variante; los detalles internos no se filtran.

## Por transporte

- [Manejo de errores en aplicaciones web](/es/practical-guides/web/error-handling)
- [Manejo de errores en aplicaciones gRPC](/es/practical-guides/grpc/grpc-errors)
