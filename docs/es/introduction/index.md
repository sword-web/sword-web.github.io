---
title: Introducción a Sword - Framework Web para Rust
description: Sword es un framework web estructurado y opinionado para Rust, construido sobre Axum y Tokio. Aprende sobre su arquitectura modular y características.
keywords: ["sword framework", "rust web framework", "axum", "tokio", "desarrollo web rust", "framework modular"]
---

# Introducción

Sword es un framework web que permite construir aplicaciones del lado del servidor de forma estructurada y opinionada, basado en `Axum` y `Tokio`.

### Motivación

La idea principal de Sword es establecer una estructura de desarrollo basada en módulos, al estilo de frameworks como Spring (Java) o NestJS (Node.js). Además, Sword provee un conjunto de herramientas y utilidades comúnmente necesarias en aplicaciones web con `Axum`, tales como:

- Manejo de configuración y variables de entorno
- Formato estandarizado de respuestas HTTP
- Middlewares integrados (CORS, Timeout, Helmet headers, etc.)
- Inyección de dependencias
- CLI interactiva para creación de proyectos y módulos
- Manejo de cookies
- Validación de schemas

### ¿A qué nos referimos con "estructurada/opinionada"?

Crear aplicaciones web escalables requiere organizar el código en capas bien definidas y mantener una clara separación de responsabilidades.

Si estás aquí, probablemente hayas revisado `Axum`, un framework desarrollado por el equipo de `tokio-rs`. Axum ofrece un conjunto bastante completo de funcionalidades para desarrollar aplicaciones web; sin embargo, a medida que tu proyecto crece, el código puede volverse complejo de mantener, o puedes terminar agregando features para extender o simplificar el framework.
