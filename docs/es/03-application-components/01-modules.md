---
title: "Módulos"
description: "Organización de aplicaciones Sword mediante Module, controllers, components y providers."
outline: [2, 3]

prev:
    text: Configuración personalizada
    link: /es/fundamental-concepts/configuration/custom
next:
    text: Controladores
    link: /es/application-components/controllers
---

# Módulos en Sword

En Sword, un módulo agrupa piezas relacionadas de una misma capacidad de la aplicación, como controllers, components y providers.

## Qué problema resuelven

Cuando una aplicación crece, registrar todo directamente en `main.rs` deja de ser mantenible. Los módulos permiten:

- agrupar funcionalidad relacionada
- encapsular el registro de dependencias
- separar responsabilidades por dominio
- mantener una arquitectura estable a medida que la app crece

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

## Qué registra cada método

::: details `register_controllers(...)`

Registra puntos de entrada externos: HTTP, Socket.IO y otros tipos de controller soportados por el framework.

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

Registra estructuras `#[injectable(provider)]`, normalmente conexiones o clientes externos: base de datos, cache o servicios remotos.

Este método es `async`.

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

## Comportamiento de `with_module`

Cada llamada a `with_module::<M>()` ejecuta el registro del módulo en este orden:

1. `register_providers(...)`
2. `register_components(...)`
3. `register_controllers(...)`

Ese orden describe el registro interno del módulo, no la resolución final de dependencias.

La construcción efectiva de components y la resolución del contenedor ocurren después, durante `build()`, cuando Sword ejecuta el proceso global de construcción del contenedor con todos los módulos ya registrados.

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
    // registro del dominio users
}
```

## Ver también

- [Controladores](/es/application-components/controllers/)
- [Providers](/es/application-components/di/providers)
- [Componentes](/es/application-components/di/components)
- [Inyectando dependencias](/es/application-components/di/injecting)
