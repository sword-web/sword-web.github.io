---
title: "Iniciando con Sword"
description: "Examples disponibles en el repositorio para comenzar a usar Sword."
outline: [2, 3]

next:
    text: Estructura del proyecto
    link: /es/introduction/file-structure
---

# Iniciando con Sword

::: info Estado del CLI
La linea de comandos `sword-cli` está en desarrollo. Por ahora, la forma recomendada de empezar con Sword es revisar y ejecutar los ejemplos del repositorio en Github.
:::

## Ejemplos

Puedes encontrar los ejemplos en el repositorio en [Github](https://github.com/sword-web/sword/tree/main/examples)

Cada ejemplo está pensado para mostrar una parte concreta del framework. Si es tu primer contacto con Sword, lo normal es empezar por `web`.

### Ejemplo `web`

Es el ejemplo más directo para entender el flujo base de una aplicación REST basada en axum con Sword.

### Ejemplo `socketio`

Ejemplo centrado en la integración Socket.IO con Sword, tomando como base el crate `socketioxide`.

### Ejemplo `interceptors`

Ejemplo centrado en interceptors aplicados a controladores web y Socket.IO.

### Ejemplo `grpc`

Ejemplo centrado en la integración gRPC con Sword, tomando como base el crate `tonic`.
