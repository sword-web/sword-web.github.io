---
title: "La función y macro `main`"
description: "Como sabrás, en Rust la ejecución de un programa comienza en la función main."
outline: [2, 3]
---

# La función y macro `main`

Como sabrás, en Rust la ejecución de un programa comienza en la función `main`.

Comúnmente, en frameworks asíncronos, la función `main` debe ser marcada con un atributo especial para indicar que es asíncrona.

En Sword, proporcionamos la macro `#[sword::main]` que se encarga de inicializar el runtime interno de la aplicación con `tokio` y ejecutar la función `main` de manera asíncrona.

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SomeModule>()
        .build();

    app.run().await;
}
```

Además, al utilizar este enfoque, no es necesario añadir `tokio` como dependencia en tu proyecto a menos que lo necesites explícitamente para otras funcionalidades.
