---
title: "Sword - Rust Web Framework"
description: "Sword is an asynchronous, modular Rust web framework built on Axum and Tokio. Ready to scale with dependency injection, interceptors, and reusable layers."
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
    tagline: Asynchronous, modular and opinionated
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
    - title: Asynchronous by default
      icon: "⚡"
      details:
          Built on Tokio, Sword is an asynchronous framework that relies on the
          well-known Tokio runtime to handle multiple concurrent connections efficiently.

    - title: Module-based architecture
      icon: "🧩"
      details: Build server-side applications with a modular architecture, layer separation, and dependency injection.

    - title: Integrated interceptors and layers
      icon: "🛡️"
      details: Includes typed interceptors and reusable Tower layers for CORS, request timeout, security headers, and more.
---

## Quick start

Clone the repository and run the `web` example to see Sword in action:

```bash
git clone https://github.com/sword-web/sword.git
cd sword/examples/web
cargo run
```

Then open `http://localhost:3000` in your browser.

## Why Sword?

- **Async by default** — built on Tokio and Axum for high concurrency.
- **Modular and testable** — modules, dependency injection and interceptors as first-class citizens.
- **Web, Socket.IO and gRPC** — one framework for all your APIs.
- **OpenAPI ready** — generate docs from your controllers out of the box.

<div class="sword-cta">
<h2>Ready to build with Sword?</h2>
<div class="sword-cta-actions">
<a class="sword-cta-btn brand" href="/en/introduction/getting-started">Get Started</a>
<a class="sword-cta-btn alt" href="https://github.com/sword-web">Star on GitHub</a>
</div>
</div>
