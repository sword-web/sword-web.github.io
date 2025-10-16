# La función y macro `main`

Como sabrás, en Rust la ejecución de un programa comienza en la función `main`.

Comunmente, en frameworks asíncronos, la función `main` debe ser marcada con un atributo especial para indicar que es asíncrona.

Por ejemplo, en `tokio` se utiliza `#[tokio::main]`, y en `async-std` se usa `#[async_std::main]`.

En sword, proporcionamos la macro `#[sword::main]` que por debajo es en realidad lo mismo que `#[tokio::main]`, sin embargo, se añade una funcionalidad adicional de la que se hablará más adelante, el `hot-reload`.

Además, al utilizar este enfoque, no es necesario añadir `tokio` como dependencia en tu proyecto a menos que lo necesites explícitamente para otras funcionalidades.

## Ejemplo

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<SomeController>()
        .build();

    app.run().await;
}
```
