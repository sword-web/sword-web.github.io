# Seguridad

Uno de los objetivos de Sword es facilitar la implementación de herramientas y librerías comunmente utilizadas en el ecosistema `axum`. 

## Helmet

Helmet es una colección de headers HTTP que ayudan a proteger las aplicaciones web de algunas vulnerabilidades conocidas. Para utilizar Helmet en Sword, puedes habilitar el feature flag `helmet`. 

Este feature utiiza el crate [axum-helmet](https://docs.rs/axum-helmet/latest/axum_helmet/)

### Usando Helmet

```rust
use sword::prelude::*;
use sword::web::helmet::*;

#[controller("/")]
struct MyController;

#[routes]
impl MyController {
    #[get("/")]
    async fn index(&self) -> HttpResult {
        Ok(HttpResponse::Ok().message("Hello, Helmet!"))
    }
}

#[sword::main]
async fn main() {
    let helmet = Helmet::builder()
        .with_header(XContentTypeOptions::nosniff())
        .with_header(XXSSProtection::on())
        .build();

    let app = Application::builder()
        .with_controller::<MyController>()
        .with_layer(helmet)
        .build();

    app.run().await;
}
```