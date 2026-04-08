---
title: Sword - Framework Web para Rust
description: Sword es un framework web asíncrono y modular para Rust construido sobre Axum y Tokio. Listo para escalar con inyección de dependencias, interceptores y layers reutilizables.
keywords:
    [
        "sword framework",
        "framework web rust",
        "rust async",
        "axum",
        "tokio",
        "desarrollo web",
        "framework modular",
    ]

layout: home

hero:
    name: "Sword"
    text: "Rust Web Framework"
    tagline: Asíncrono, modular y opinionado
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
    - title: Asíncrono por defecto
      details:
          Construido sobre Tokio, Sword es un framework asíncrono que se basa en el
          conocido runtime de Tokio para manejar múltiples conexiones concurrentes de manera eficiente.

    - title: Arquitectura basada en módulos
      details: Construye aplicaciones del lado del servidor con una arquitectura modular, separación de capas e inyección de dependencias.

    - title: Interceptors
      details: Incluye interceptores tipados y basados en traits para manejar la lógica transversal como autenticación, autorización, logging y más.
---
