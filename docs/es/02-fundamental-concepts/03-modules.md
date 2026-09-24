---
title: "Módulos"
description: "Organización de aplicaciones Sword mediante módulos."
outline: [2, 3]
---

# Módulos

Un módulo agrupa una capacidad de la aplicación: sus controladores, componentes y proveedores. Cada módulo implementa el trait `Module` y registra esas piezas en el contenedor de dependencias, de modo que la aplicación solo necesita declarar los módulos que usa.

## El trait `Module`

El contrato base es:

```rust
pub trait Module {
    fn register_controllers(controllers: &ControllerRegistry) {}
    fn register_components(components: &ComponentRegistry) {}
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {}
}
```

Todos los métodos tienen implementación por defecto vacía, así que cada módulo implementa solo los que necesita.

<ApiSection title="Métodos del trait Module">

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

Registra estructuras `#[injectable(provider)]`, normalmente conexiones o clientes externos como bases de datos, cachés o servicios remotos. Es asíncrono porque inicializar esos recursos puede requerir operaciones async.

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

**Notas**

- Se ejecuta una sola vez, durante la construcción de la aplicación, no en cada request.

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

## Registro en la aplicación

Los módulos se registran con `with_module::<M>()` en `ApplicationBuilder` (ver [Aplicación](./application)). La aplicación no necesita conocer el interior del módulo: solo lo declara.

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

Los módulos son independientes entre sí: no se referencian ni se registran unos a otros. El orden en que se declaran determina el orden en que se registran sus piezas.

## Estructura de archivos

Un módulo suele corresponder a un directorio:

```text
users/
  controller.rs
  service.rs
  repository.rs
  mod.rs
```

En `mod.rs` vive el `impl Module` que registra cada pieza. Para el detalle de cada tipo de pieza, revisa [Controladores](./controllers) e [Inyección de dependencias](./dependency-injection).
