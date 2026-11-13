---
title: "Server Application Framework"
description: "Sword is an asynchronous, modular Rust framework for server applications: web, Socket.IO, gRPC, events and jobs. It includes dependency injection, interceptors and reusable layers."

keywords:
  [
    "sword framework",
    "rust server framework",
    "grpc",
    "socket.io",
    "events",
    "jobs",
    "dependency injection",
    "axum",
    "tokio",
  ]

layout: home

hero:
  text: "Server-side Application\nFramework"
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
      link: /en/0.6/introduction/
    - theme: alt
      text: Getting Started
      link: /en/0.6/introduction/getting-started
    - theme: alt
      text: GitHub
      link: "https://github.com/sword-web/"
---

## Why Sword?

- Async by default: built on the Tokio ecosystem.
- Modular: modules and dependency injection are part of the core.
- Web, Socket.IO and gRPC controllers in one framework.
- Scheduled jobs: cron, repeated and one-shot background tasks.
- Validation, standardized error handling and TOML configuration built in.

## Quick start

Clone the repository and run the `web` example to see Sword in action:

```bash
git clone https://github.com/sword-web/sword.git
cd sword/examples/web
cargo run
```

Then open `http://localhost:3000` in the browser.

<div class="sword-cta">
<h2>Ready to build with Sword?</h2>
<div class="sword-cta-actions">
<a class="sword-cta-btn brand" href="/en/0.6/introduction/getting-started">Get Started</a>
<a class="sword-cta-btn alt" href="https://github.com/sword-web">Star on GitHub</a>
</div>
</div>
