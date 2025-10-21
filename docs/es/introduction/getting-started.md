# ¿Cómo empezar?

Hay dos formas de empezar a usar sword, la primera es configurando todo manualmente, y la segunda es usando `sword-cli`, una herramienta que provee un conjunto de utilidades para crear proyectos y generar código.

## Usando sword-cli

Para usar esta forma es necesario instalar `sword-cli` primero. Este binario provee un conjunto de herramientas para crear y generar código de forma interactiva.

```shell
cargo install sword-cli
sword create my-sword-app
```

Esto iniciará un menu interactivo para configurar tu proyecto. Una vez finalizado, navega al directorio del proyecto y ejecuta:

```shell
cargo run
```

## Configuración manual

Crea un nuevo proyecto con cargo:

```shell
cargo new my-sword-app
```

Y luego añade sword y serde como dependencias en tu `Cargo.toml`:

```toml
[dependencies]
sword =  "0.1.8"
serde = "*"
serde_json = "*"
```

Finalmente crea un archivo `src/main.rs` con el siguiente contenido:

```rust
use sword::prelude::*;

#[controller("/")]
struct AppController {}

#[routes]
impl AppController {
    #[get("/hello")]
    async fn hello(&self) -> HttpResponse {
        HttpResponse::Ok().message("Hello, World!")
    }
}

#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_controller::<AppController>()
        .build();

    app.run().await;
}
```
