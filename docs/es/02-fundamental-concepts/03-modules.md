---
title: "Módulos"
description: "Organización de aplicaciones Sword mediante módulos."
outline: [2, 3]
---

# Módulos

Un módulo es la unidad que agrupa una capacidad de la aplicación. En Sword, cada módulo es una estructura que implementa el trait `Module` y declara qué controladores, componentes y proveedores aporta. Se basa en el modelo de composición y cohesión de módulos de NestJS, pero con un enfoque más simple y flexible.

Cada módulo declara solo lo que aporta, y la aplicación se construye en base a la composición de esas piezas.

<ApiSection title="API Reference: Métodos del trait Module" :collapsed="false">

El trait `Module` define estos tres métodos, todos con implementación por defecto vacía, así que cada módulo implementa solo los que necesita.

#### Registro de controladores

Registra los controladores definidos en la aplicación, ya sean Web, Socket.IO, gRPC, Events o Jobs. [Ver más](./controllers.md)

```rust
fn register_controllers(controllers: &ControllerRegistry) {}
```

**Parámetros**

- `controllers`: referencia al registro compartido de controladores de la aplicación.

**Ejemplo**

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

---

#### Registro de componentes

Registra estructuras inyectables que el contenedor de dependencias construye automáticamente. [Ver más](./dependency-injection.md)

```rust
fn register_components(components: &ComponentRegistry)
```

**Parámetros**

- `components`: registro donde se declaran los componentes del módulo.

**Ejemplo**

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

---

#### Registro de proveedores

Registra estructuras inyectables con construcción manual denominadas 'proveedores', normalmente conexiones o clientes externos como bases de datos, cachés o servicios remotos. [Ver más](./dependency-injection.md)

```rust
async fn register_providers(config: &Config, providers: &ProviderRegistry)
```

**Parámetros**

- `config`: la configuración cargada, para obtener la configuración del proveedor.
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

::: details Ver ejemplo completo de un módulo de usuarios

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

:::

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

En el archivo `mod.rs` vive la declaración e implementación del módulo que registra cada pieza.

## Registro en la aplicación

Los módulos se registran con el método `with_module` del `ApplicationBuilder`. Por ejemplo, para registrar un módulo de usuarios y un módulo compartido:

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
