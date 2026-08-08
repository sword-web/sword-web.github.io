---
title: "Introducción a Sword - Framework Web para Rust"
description: "Sword es un framework web estructurado y opinionado para Rust, construido sobre el ecosistema Tokio. Aprende sobre su arquitectura modular y características."

keywords:
    [
        "sword framework",
        "rust web framework",
        "grpc",
        "axum",
        "tokio",
        "desarrollo web rust",
        "framework modular",
    ]
---

# Introducción

Sword es un framework web que permite construir aplicaciones del lado del servidor de forma estructurada y opinionada.

Actualmente se encuentra en una etapa de desarrollo activo, por lo que algunas características pueden cambiar o eliminarse frecuentemente. Hasta alcanzar una versión estable esta documentación puede sufrir modificaciones.

### Motivación

La idea principal de Sword es establecer una estructura de desarrollo basada en módulos, al estilo de frameworks como Spring o NestJS. Además, Sword provee un conjunto de herramientas y utilidades comúnmente necesarias en este tipo de frameworks, como:

- Manejo de configuración y variables de entorno via `toml`
- Formato estandarizado de respuestas HTTP en formato JSON
- Middlewares esenciales incorporados por defecto (Interceptors)
- Inyección de dependencias (Construcción automática de componentes)
- Manejo de errores sencillo e idiomatico
- Soporte para aplicaciones REST y gRPC

### ¿A qué nos referimos con "estructurada/opinionada"?

Crear aplicaciones web escalables requiere organizar el código en capas bien definidas y mantener una clara separación de responsabilidades.

Si estás aquí, probablemente hayas usado `axum`, un framework desarrollado por el equipo de `tokio`. Axum ofrece un conjunto bastante completo de funcionalidades para desarrollar aplicaciones web; sin embargo, a medida que tu proyecto crece, el código puede volverse complejo de mantener, o incluso es posible que comiences a agregar elementos para extender o simplificar las propias funcionalidades de `axum`, lo que puede resultar en una base de código difícil de mantener a largo plazo.

Por esto, Sword toma como base librerías del ecosistema de `tokio` para construir una estructura de desarrollo más organizada y modular, con el objetivo de facilitar la escalabilidad y mantenibilidad de tus proyectos web en Rust.
