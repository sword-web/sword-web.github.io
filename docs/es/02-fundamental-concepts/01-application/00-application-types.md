---
title: "Tipos de aplicación"
description: "Sword distingue dos tipos de aplicación que se pueden ajustar a tus necesidades."
outline: [2, 3]
---

# Tipos de aplicación

Sword distingue dos tipos de aplicación que se pueden ajustar a tus necesidades.

## Aplicación web

La aplicación web se basa en axum y se construye a partir de estas features:

- `web`: Habilita controladores HTTP. Requiere importar `sword::web::*`.
- `socketio`: Habilita controladores de tiempo real. Requiere importar `sword::socketio::*`.

Puedes elegir una o ambas, dependiendo de si quieres construir una aplicación web tradicional o una aplicación en tiempo real con Socket.IO.

:::info
Dado que `socketioxide` es un complemento de `axum`, la feature `web` se habilita automáticamente al habilitar `socketio`.
:::

### Complementos

Una aplicación web puede ser complementada con estas features:

- `multipart`: Habilita soporte para `multipart/form-data` en controladores HTTP.
- `validation-validator`: Habilita validación de datos de entrada en controladores web y socketio.

## Aplicación gRPC

La aplicación gRPC se basa en tonic y se construye a partir de estas features:

- `grpc`: Habilita controladores gRPC basados en `tonic`. Requiere importar `sword::grpc::*`.

### Complementos

Una aplicación gRPC puede ser complementada con estas features:

- `grpc-reflection` (Opcional): Habilita la reflexión gRPC. (Habilitar introspección de servicios gRPC para clientes como grpcurl).
