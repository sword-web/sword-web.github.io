---
title: Sword - Rust Web Framework
description: Sword is an asynchronous, modular Rust web framework built on Axum and Tokio. Ready to scale with dependency injection, interceptors, and reusable layers.
keywords:
    [
        "sword framework",
        "rust web framework",
        "async rust",
        "axum",
        "tokio",
        "web development",
        "modular framework",
    ]

layout: home

hero:
    name: "Sword"
    text: "Rust Web Framework"
    tagline: Asynchronous, modular and ready to scale.
    image:
        light:
            src: /logo-new-dark.png
            alt: Sword Logo
        dark:
            src: /logo-new.png
            alt: Sword Logo

    actions:
        - theme: brand
          text: ¿Qué es Sword?
          link: /es/introduction/
        - theme: alt
          text: Empezar
          link: /es/introduction/getting-started
        - theme: alt
          text: GitHub
          link: "https://github.com/sword-web/"

features:
    - title: Asynchronous by default
      details:
          Built on Tokio, Sword is an asynchronous framework that relies on the
          well-known Tokio runtime to handle multiple concurrent connections efficiently.

    - title: Module-based architecture
      details: Build server-side applications with a modular architecture, layer separation, and dependency injection.

    - title: Integrated interceptors and layers
      details: Includes typed interceptors and reusable Tower layers for CORS, request timeout, security headers, and more.
---
