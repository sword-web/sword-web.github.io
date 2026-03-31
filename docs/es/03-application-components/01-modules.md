# Módulos en Sword

En Sword, un módulo es una unidad de organización que agrupa partes relacionadas de la aplicación, como `controllers`, `components` y `providers`.

La idea es estructurar la aplicación por dominio (por ejemplo: `UsersModule`, `AuthModule`, `TasksModule`) para mantener el código escalable y fácil de mantener.

## ¿Qué problema resuelven los módulos?

Cuando una aplicación crece, registrar todo directamente en `main.rs` se vuelve difícil de mantener.

Los módulos permiten:

- Agrupar funcionalidades relacionadas.
- Encapsular el registro de dependencias del módulo.
- Separar responsabilidades por dominio.
- Mantener una arquitectura consistente en proyectos grandes.

## Trait `Module`

Sword define el trait `Module` como contrato de registro:

```rust
pub trait Module {
    fn register_controllers(controllers: &ControllerRegistry) {}
    fn register_components(components: &ComponentRegistry) {}
    async fn register_providers(config: &Config, providers: &ProviderRegistry) {}
}
```

Todos los métodos tienen implementación por defecto vacía, por lo que puedes implementar solo los que necesites.

<hr/>

### Método `register_controllers`

Registra puntos de entrada de la aplicación (controllers), que permiten una comunicación externa (HTTP, WebSocket, gRPC, etc.).

```rust
fn register_controllers(controllers: &ControllerRegistry) {
    controllers.register::<UsersController>();
}
```

<hr/>

### Método `register_components`

Registra estructuras `#[injectable]` que deben autoconstruirse desde el contenedor de dependencias.

```rust
fn register_components(components: &ComponentRegistry) {
    components.register::<UserRepository>();
    components.register::<UsersService>();
}
```

<hr/>

### Método `register_providers`

Registra estructuras `#[injectable(provider)]`, generalmente conexiones o clientes externos (base de datos, cache, APIs, etc.).

Este método es `async`, por lo que puedes inicializar recursos asíncronos.

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

## Definición de un módulo

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

## Registro de módulos en la aplicación

Los módulos se registran usando `with_module::<M>()` en el `ApplicationBuilder`.

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

## ¿Qué ocurre al llamar `with_module`?

Internamente, Sword ejecuta el registro del módulo en este orden:

1. `register_providers(...)`
2. `register_components(...)`
3. `register_controllers(...)`

Esto asegura que las dependencias estén disponibles antes de exponer los puntos de entrada de la aplicación.
