---
title: "Inspección de servicios gRPC con grpcurl"
description: "Cómo habilitar reflection en Sword y usar grpcurl para inspeccionar y probar servicios gRPC."
outline: [2, 3]
---
# Inspección de servicios gRPC con grpcurl

Esta guía explica cómo inspeccionar y probar tus servicios gRPC con `grpcurl` en una aplicación Sword.

Para recomendaciones de diseño del contrato `.proto`, revisa [Ficheros .proto](/es/practical-guides/grpc/ficheros-proto).

## Requisitos mínimos

1. Tener `grpcurl` instalado.
2. Tener al menos un controlador gRPC registrado.
3. Activar reflection en configuración:

```toml
[grpc]
enable-tonic-reflection = true
```

::: tip Reflection se registra desde `build.rs`
Para que reflection exponga tus servicios y tipos, tu `build.rs` debe generar `sword_descriptor_set.bin` en `OUT_DIR`. Ver [Compilando protos](/es/practical-guides/grpc/compilando-proto).
:::

## Comandos básicos con grpcurl

Asumiendo servidor en `127.0.0.1:50051`:

::: details Listar servicios

```bash
grpcurl -plaintext 127.0.0.1:50051 list
```

:::

::: details Describir un servicio

```bash
grpcurl -plaintext 127.0.0.1:50051 describe users.UserService
```

:::

::: details Health check global

```bash
grpcurl -plaintext -d '{"service":""}' 127.0.0.1:50051 grpc.health.v1.Health/Check
```

:::

::: details Ejecutar un método con metadata

```bash
grpcurl -plaintext -H 'authorization: bearer test' -d '{}' 127.0.0.1:50051 users.UserService/ListUsers
```

:::
