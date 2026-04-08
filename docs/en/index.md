---
title: Sword - Web Framework for Rust
description: Sword is an asynchronous and modular web framework for Rust built on top of Axum and Tokio. Ready to scale with dependency injection, interceptors, and reusable layers.
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
    text: "Rust Web Framework"
    tagline: Asynchronous, modular, and opinionated
    image:
        light:
            src: /logo-new-dark.png
            alt: Sword Logo
        dark:
            src: /logo-new.png
            alt: Sword Logo
    actions:
        - theme: brand
          text: What is Sword?
          link: /en/introduction/
        - theme: alt
          text: Getting Started
          link: /en/introduction/getting-started
        - theme: alt
          text: GitHub
          link: "https://github.com/sword-web/"

features:
    - title: Async by default
      details:
          Built on top of Tokio, Sword is an asynchronous framework that leverages the
          well-known Tokio runtime to handle multiple concurrent connections efficiently.

    - title: Module-based architecture
      details: Build server-side applications with a modular architecture, layer separation, and dependency injection.

    - title: Interceptors
      details: Includes typed and trait-based interceptors to handle cross-cutting concerns like authentication, authorization, logging, and more.
---
