---
title: "Módulos"
description: "Organización de aplicaciones Sword mediante módulos"
outline: [2, 3]

prev:
    text: Configuración personalizada
    link: /es/fundamental-concepts/configuration/custom
next:
    text: Controladores
    link: /es/application-components/controllers
---

# Módulos en Sword

En Sword, un módulo agrupa piezas relacionadas de una misma capacidad de la aplicación, como controllers, components, providers, dtos e incluso otros módulos. Cada módulo implementa el trait `Module` y registra sus piezas en el contenedor de dependencias.

## Trait `Module`

El contrato base es:

```rust
pub trait Module {
    fn register_controllers(controllers: &ControllerRegistry) {}
    fn register_components(components: &ComponentRegistry) {}
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {}
}
```

Todos los métodos tienen implementación por defecto vacía.

## ¿Qué registra cada método?

::: info `register_controllers(...)`

Registra puntos de entrada externos: HTTP, Socket.IO y otros tipos de estructuras que implementan `ControllerSpec`.

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

:::

::: details `register_components(...)`

Registra estructuras `#[injectable]` que deben construirse desde el contenedor de dependencias.

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

:::

::: details `register_providers(...)`

Registra estructuras `#[injectable(provider)]`, normalmente conexiones o clientes externos: base de datos, cache o servicios remotos. Este método es asíncrono por defecto, ya que la inicialización de recursos externos puede requerir operaciones async.

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

:::

## Ejemplo de módulo

```rust
use sword::prelude::*;

pub struct UsersModule;

impl Module for UsersModule {
    fn register_components(components: &ComponentRegistry) {
        components.register::<UserRepository>();
        components.register::<UsersService>();
    }

    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

## Registro en la aplicación

Los módulos se registran con `with_module::<M>()` en `ApplicationBuilder`.

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

## Separación de responsabilidades

::: code-group

```text [Controller]
Expone una interfaz externa.
Ejemplos: endpoint HTTP, namespace Socket.IO.
```

```text [Component]
Lógica interna autoconstruida por DI.
Ejemplos: servicio de dominio, repositorio, hasher.
```

```text [Provider]
Recurso externo o inicialización async.
Ejemplos: base de datos, cliente Redis, SDK externo.
```

:::

## Estructura habitual

Una estructura habitual es:

```text
users/
  controller.rs
  service.rs
  repository.rs
  mod.rs
```

Y en `mod.rs`:

```rust
pub struct UsersModule;

impl Module for UsersModule {
    // registro de los elementos del módulo
}
```
