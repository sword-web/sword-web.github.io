---
title: "Tipos de aplicación"
description: "Sword provee múltiples tipos de aplicación que puedes ajustar a tus necesidades."
outline: [2, 3]
---

# Tipos de aplicación

En Sword, un tipo de aplicación es un motor de ejecución que expone un mecanismo de entrada para los [controladores](../02-fundamental-concepts/04-controllers). Cada tipo se habilita con una feature y puede convivir con los demás en la misma aplicación.

No todos los tipos implican comunicación con el exterior. Algunos reciben tráfico externo (Web, Socket.IO, gRPC, Eventos NATs) mientras que otros procesan trabajo dentro del proceso, como las tareas programadas (Jobs) o los eventos en memoria. Lo que comparten es que todos montan controladores como punto de entrada a la lógica de negocio.

Además, cada tipo de aplicación (bajo un feature) puede ser complementada con otras features que habilitan funcionalidades adicionales en su contexto.

## Aplicación Web

El tipo de aplicación Web se construye habilitando la feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["web"] }
```

En este tipo de aplicación puedes desarrollar e implementar la gran mayoría de patrones comunes en `axum`. Para conocer más sobre este tipo de aplicación ve a _Guías Prácticas > Web_.

**Complementos**

Una aplicación web puede ser complementada con estas features:

- `web-multipart`: Habilita soporte para `multipart/form-data` en controladores HTTP.
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

## Aplicación de Tareas Programadas (Jobs)

La feature `jobs` permite declarar controladores que ejecutan tareas programadas con `cron`. Se habilita con:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["jobs"] }
```

Para conocer más, ve a _Guías Prácticas > Jobs_.

## Aplicación de Eventos

Una aplicación de eventos permite manejar eventos en memoria y de fuentes externas como NATS. Se habilita con la feature:

```toml
[dependencies]
sword = { version = "x.y.z", features = ["events"] }
```

**Complementos**

En este tipo de aplicación es obligatorio habilitar al menos un adaptador de eventos. Actualmente, Sword soporta los siguientes adaptadores:

- `events-nats`: Habilita el adaptador de eventos NATS.
- `events-memory`: Habilita el adaptador de eventos en memoria.
