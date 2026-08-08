---
title: "Sword - Framework Web para Rust"
description: "Sword es un framework web asíncrono y modular para Rust construido sobre Axum y Tokio. Listo para escalar con inyección de dependencias, interceptores y layers reutilizables."

keywords:
    [
        "sword framework",
        "rust web framework",
        "rust async",
        "axum",
        "tokio",
        "web development",
        "modular framework",
    ]

layout: home

hero:
    name: "Sword"
    text: "Framework Web en Rust"
    tagline: Asíncrono, modular y con opiniones
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

features:
    - title: Asíncrono por defecto
      icon: "⚡"
      details:
          Construido sobre Tokio, Sword es un framework asíncrono que aprovecha
          el conocido runtime de Tokio para manejar múltiples conexiones concurrentes de forma eficiente.

    - title: Arquitectura por módulos
      icon: "🧩"
      details: Construye aplicaciones de servidor con arquitectura modular, separación de capas e inyección de dependencias.

    - title: Interceptores
      icon: "🛡️"
      details: Incluye interceptores tipados y basados en traits para manejar preocupaciones transversales como autenticación, autorización, logging y más.
---

## Inicio rápido

Clona el repositorio y ejecuta el ejemplo `web` para ver Sword en acción:

```bash
git clone https://github.com/sword-web/sword.git
cd sword/examples/web
cargo run
```

Luego abre `http://localhost:3000` en tu navegador.

## ¿Por qué Sword?

- **Asíncrono por defecto** — construido sobre Tokio y Axum para alta concurrencia.
- **Modular y testeable** — módulos, inyección de dependencias e interceptores como ciudadanos de primera clase.
- **Web, Socket.IO y gRPC** — un solo framework para todas tus APIs.
- **Listo para OpenAPI** — genera documentación desde tus controladores sin configuración extra.

<div class="sword-cta">
<h2>¿Listo para construir con Sword?</h2>
<div class="sword-cta-actions">
<a class="sword-cta-btn brand" href="/es/introduction/getting-started">Empezar</a>
<a class="sword-cta-btn alt" href="https://github.com/sword-web">Star en GitHub</a>
</div>
</div>
