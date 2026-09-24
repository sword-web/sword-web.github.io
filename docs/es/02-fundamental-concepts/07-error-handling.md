---
title: "Manejo de errores"
description: "Modelo general para manejar errores en Sword: errores de dominio tipados y su traducción uniforme a cada transporte."
outline: [2, 3]
---

# Manejo de errores

Esta página describe el modelo general para manejar errores en Sword. El detalle de cada transporte está en las guías prácticas de cada uno.

## Principios

- Los errores se tipan como enums, no como cadenas de texto.
- El formato hacia el cliente es uniforme dentro de cada protocolo.
- Solo se expone lo que declara cada variante; los detalles internos no se exponen.

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

El diseño natural de `thiserror` es agnóstico, por lo que Sword provee abstracciones para transformar las variantes a errores de transporte sin acoplar el dominio a ellos.

## Traducción por transporte

Cada transporte aporta una macro que convierte el enum de dominio en la respuesta que le corresponde. Los atributos sobre cada variante declaran cómo se traduce:

| Transporte | Macro       | Resultado       | Documentación                                       |
| ---------- | ----------- | --------------- | --------------------------------------------------- |
| Web        | `HttpError` | `JsonResponse`  | Ver [aquí](/es/practical-guides/web/error-handling) |
| gRPC       | `GrpcError` | `tonic::Status` | Ver [aquí](/es/practical-guides/grpc/grpc-errors)   |

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
