---
title: "Sword - Server Application Framework"
description: "Sword is an asynchronous and modular web framework for Rust built on top of Axum and Tokio. Ready to scale with dependency injection, interceptors, and reusable layers."

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
    text: "Server Application Framework"
    tagline: Progressive, modular, and opinionated
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
---

## Why Sword?

- **Async by default** — built on the Tokio ecosystem.
- **Modular** — modules and dependency injection as first-class citizens.
- **Web, Socket.IO, and gRPC** — one framework for all your APIs.
- **Batteries included** — built-in support for validation, standardized error handling, TOML-based configuration, and more.

## Quick start

Clone the repository and run the `web` example to see Sword in action:

```bash
git clone https://github.com/sword-web/sword.git
cd sword/examples/web
cargo run
```

Then open `http://localhost:3000` in your browser.

<div class="sword-cta">
<h2>Ready to build with Sword?</h2>
<div class="sword-cta-actions">
<a class="sword-cta-btn brand" href="/en/introduction/getting-started">Get Started</a>
<a class="sword-cta-btn alt" href="https://github.com/sword-web">Star on GitHub</a>
</div>
</div>
