---
title: "Introducción"
description: "Aprende cómo Sword estructura aplicaciones del lado del servidor: web, Socket.IO, gRPC, eventos y jobs, con inyección de dependencias, interceptores y layers reutilizables."

keywords:
  [
    "sword framework",
    "framework rust servidor",
    "grpc",
    "socket.io",
    "eventos",
    "jobs",
    "inyección de dependencias",
    "axum",
    "tokio",
  ]
---

# Introducción

Sword es un framework estructurado y opinionado que permite construir aplicaciones del lado del servidor.

Actualmente se encuentra en una etapa de desarrollo activo, por lo que algunas características pueden cambiar o eliminarse frecuentemente. Hasta alcanzar una versión estable esta documentación puede sufrir modificaciones.

### Motivación

La idea principal de Sword es establecer una estructura de desarrollo basada en módulos, al estilo de frameworks como Spring o NestJS. Además de proveer un conjunto de herramientas y utilidades comúnmente necesarias en este tipo de frameworks, como:

- Manejo de configuración y variables de entorno vía `toml`
- Formato estandarizado de respuestas HTTP en formato JSON
- Middlewares esenciales incorporados por defecto (interceptores)
- Inyección de dependencias (Construcción automática de componentes)
- Manejo de errores sencillo e idiomático
- Soporte para aplicaciones REST, gRPC, Eventos, Socket.IO y de tareas programadas (cron jobs)

### ¿A qué nos referimos con "estructurado/opinionado"?

Crear aplicaciones web escalables requiere organizar el código en capas bien definidas y mantener una clara separación de responsabilidades.

Si estás aquí, probablemente hayas usado `axum`, un framework desarrollado por el equipo de `tokio`. Axum ofrece un conjunto bastante completo de funcionalidades para desarrollar aplicaciones web, sin embargo, a medida que tu proyecto crece, el código puede volverse complejo de mantener, o incluso es posible que comiences a agregar elementos para extender o simplificar las propias funcionalidades de `axum`, lo que puede resultar en una base de código difícil de mantener a largo plazo.

Por esto, Sword toma como base librerías del ecosistema de `tokio` para construir una estructura de desarrollo más organizada y modular, con el objetivo de facilitar la escalabilidad y mantenibilidad de tus proyectos web en Rust.
