---
title: "Framework para Aplicaciones de Servidor"
description: "Sword es un framework asíncrono y modular para aplicaciones de servidor en Rust: web, Socket.IO, gRPC, eventos y jobs. Incluye inyección de dependencias, interceptores y layers reutilizables."

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

layout: home

hero:
  text: "Framework de Aplicaciones de Servidor"
  tagline: Progresivo, modular y opinionado
  image:
    light:
      src: /logo-new-dark.png
      alt: Logo de Sword
    dark:
      src: /logo-new.png
      alt: Logo de Sword
  actions:
    - theme: brand
      text: ¿Qué es Sword?
      link: /es/introduction/
    - theme: alt
      text: Iniciando
      link: /es/introduction/getting-started
    - theme: alt
      text: GitHub
      link: "https://github.com/sword-web/"
---

## ¿Por qué Sword?

- Asíncrono por defecto: construido sobre el ecosistema de Tokio.
- Modular: módulos e inyección de dependencias forman parte del núcleo.
- Controladores Web, Socket.IO y gRPC en un solo framework.
- Jobs programados: tareas de fondo cron, repetidas y de una sola ejecución.
- Validación, manejo de errores estandarizado y configuración TOML integrados.

## Inicio rápido

Clona el repositorio y ejecuta el ejemplo `web` para ver Sword en acción:

```bash
git clone https://github.com/sword-web/sword.git
cd sword/examples/web
cargo run
```

Luego abre `http://localhost:3000` en el navegador.

<div class="sword-cta">
<h2>¿Listo para construir con Sword?</h2>
<div class="sword-cta-actions">
<a class="sword-cta-btn brand" href="/es/introduction/getting-started">Empezar</a>
<a class="sword-cta-btn alt" href="https://github.com/sword-web">Star en GitHub</a>
</div>
</div>
