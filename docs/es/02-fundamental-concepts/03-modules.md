---
title: "Módulos"
description: "Organización de aplicaciones Sword mediante módulos."
outline: [2, 3]
---

# Módulos

Un módulo agrupa una capacidad de la aplicación: sus controladores, componentes y proveedores. Cada módulo implementa el trait `Module` y registra esas piezas en el contenedor de dependencias, de modo que la aplicación solo necesita declarar los módulos que usa.

<ApiSection title="Métodos del trait Module" :collapsed="false">

El trait `Module` define estos tres métodos, todos con implementación por defecto vacía, así que cada módulo implementa solo los que necesita.

#### Método `register_controllers(controllers)`

```rust
fn register_controllers(controllers: &ControllerRegistry)
```

Registra los puntos de entrada externos del módulo: controladores HTTP, Socket.IO, gRPC y cualquier estructura que implemente `ControllerSpec`.

**Parámetros**

- `controllers`: registro donde se declaran los controladores del módulo.

**Ejemplo**

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

#### Método `register_components(components)`

```rust
fn register_components(components: &ComponentRegistry)
```

Registra estructuras `#[injectable]` que el contenedor construye automáticamente.

**Parámetros**

- `components`: registro donde se declaran los componentes del módulo.

**Ejemplo**

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

#### Método `register_providers(config, providers)`

```rust
async fn register_providers(config: &Config, providers: &ProviderRegistry)
```

Registra estructuras `#[injectable(provider)]`, normalmente conexiones o clientes externos como bases de datos, cachés o servicios remotos.

**Parámetros**

- `config`: la configuración cargada, para leer los valores del proveedor.
- `providers`: registro donde se declaran los proveedores del módulo.

**Ejemplo**

```rust
async fn register_providers(config: &Config, providers: &ProviderRegistry) {
    let db_config = config.expect::<DatabaseConfig>();

    providers.register(
        Database::new(db_config)
            .await
            .expect("Failed to create Database provider"),
    );
}
```

</ApiSection>

## Ejemplo completo

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }

    fn register_components(components: &ComponentRegistry) {
        components.register::<UserRepository>();
        components.register::<UsersService>();
    }

    async fn register_providers(config: &Config, providers: &ProviderRegistry) {
        let db_config = config.expect::<DatabaseConfig>();

        providers.register(
            Database::new(db_config)
                .await
                .expect("Failed to create Database provider"),
        );
    }
}
```

## Estructura de archivos

Un módulo suele corresponder a un directorio o a un grupo de ellos. Por ejemplo, un módulo de usuarios podría tener esta estructura:

```text
users/
  controller.rs
  service.rs
  dtos.rs
  repository.rs
  mod.rs
```

En `mod.rs` vive el `impl Module` que registra cada pieza. Para el detalle de cada tipo de pieza, revisa [Controladores](./controllers) e [Inyección de dependencias](./dependency-injection).

## Registro en la aplicación

Los módulos se registran con `with_module::<M>()` en `ApplicationBuilder`

```rust
#[sword::main]
async fn main() {
    let app = Application::builder()
        .with_module::<SharedModule>()
        .with_module::<UsersModule>()
        .build();

    app.run().await;
}
```
