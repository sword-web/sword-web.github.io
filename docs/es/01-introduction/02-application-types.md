---
title: "Tipos de aplicación"
description: "Sword distingue tres tipos de aplicación que puedes ajustar a tus necesidades."
outline: [2, 3]
---

# Tipos de aplicación

En Sword, un tipo de aplicación es una forma de comunicación con el exterior. Dependiendo del tipo, una aplicación puede englobar a otras, porque varios protocolos y metodologías comparten crates. Axum es el ejemplo más claro.

Sword distingue tres tipos de aplicación que puedes ajustar a tus necesidades.

## Aplicación Web

El tipo de aplicación Web se construye habilitando la feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["web"] }
```

En este tipo de aplicación puedes desarrollar e implementar la gran mayoría de patrones comunes en `axum`

Habilitando esta feature puedes usar el import `sword::web::*` como prelude. Para conocer más sobre este tipo de aplicación ve a _Guías Prácticas > Web_.

**Complementos**

Una aplicación web puede ser complementada con estas features:

- `multipart`: Habilita soporte para `multipart/form-data` en controladores HTTP.
- `validation-validator`: Habilita validación de datos de entrada en controladores web de la mano del crate `validator`.

## Aplicación Socket.IO

El tipo de aplicación Socket.IO se construye usando la feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["socketio"] }
```

En este tipo de aplicación puedes desarrollar e implementar la gran mayoría de patrones comunes en `socketioxide`

:::info
Dado que `socketioxide` requiere del router de `axum`, la feature `web` se habilita automáticamente al usar este tipo de aplicación.
:::

Habilitando esta feature puedes usar el import `sword::socketio::*` como prelude. Para conocer más sobre este tipo de aplicación ve a _Guías Prácticas > Socket.IO_.

:::warning
De momento solo es posible usar el `Adapter Local` de `socketioxide` en sword.

[Ver Documentación](https://docs.rs/socketioxide/latest/socketioxide/#adapters)
:::

**Complementos**

Una aplicación Socket.IO puede ser complementada con estas features:

- `validation-validator`: Habilita validación de datos de entrada en controladores Socket.IO de la mano del crate `validator`.

## Aplicación gRPC

El tipo de aplicación gRPC se construye usando la feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["grpc"] }
```

Este tipo de aplicación permite aplicar la gran mayoría de patrones comunes en `tonic`.

Habilitando esta feature puedes usar el import `sword::grpc::*` como prelude. Para conocer más sobre este tipo de aplicación ve a _Guías Prácticas > gRPC_.

**Complementos**

Una aplicación gRPC puede ser complementada con estas features:

- `grpc-error-details`: Habilita el acceso a la estructura `GrpcStatus` para crear errores gRPC detallados.

- `grpc-reflection`: Habilita la reflexión gRPC. Útil para realizar introspección de servicios gRPC para clientes como grpcurl.
