---
title: Iniciando con Sword
description: Examples disponibles en el repositorio para comenzar a usar Sword.
outline: [2, 3]
next:
    text: Estructura del proyecto
    link: /es/introduction/project-structure
---

# Iniciando con Sword

::: info Estado del CLI
La linea de comandos `sword-cli` está en desarrollo. Por ahora, la forma recomendada de empezar con Sword es revisar y ejecutar los examples del repositorio.
:::

## Ejemplos

Puedes encontrar los ejemplos en el repositorio en [Github](https://github.com/sword-web/sword/tree/main/examples)

Cada example está pensado para mostrar una parte concreta del framework. Si es tu primer contacto con Sword, lo normal es empezar por `web`.

### Ejemplo `web`

Es el ejemplo más directo para entender el flujo base de una aplicación HTTP basada en Axum con Sword.

Incluye:

- Registro de módulos
- Controllers web
- Components y providers
- Configuración desde archivo

### Ejemplo `socketio`

Ejemplo centrado en la integración Socket.IO con Sword, tomando como base el crate `socketioxide`.

Incluye:

- Registro de módulos
- Controllers Socket.IO
- Eventos
- Configuración `[socketio]`

### Ejemplo `interceptors`

Example centrado en interceptors aplicados a controladores web y Socket.IO.

Incluye:

- Interceptors web
- Interceptors de conexión Socket.IO
- Uso combinado con layers y configuración
