# Controladores

En Sword, un controlador es un punto de entrada a tu aplicación.

En la práctica, un `controller` recibe eventos o solicitudes externas y los transforma en llamadas a la lógica interna de tus módulos.

Algunos ejemplos:

- Un controlador web que recibe una request HTTP.
- Un controlador Socket.IO que escucha eventos en tiempo real.

## ¿Cómo se registran?

Los controladores se registran desde un módulo usando `register_controllers`.

```rust
impl Module for UsersModule {
    fn register_controllers(controllers: &ControllerRegistry) {
        controllers.register::<UsersController>();
    }
}
```

Ese es el flujo estándar: cada módulo declara sus controladores y `Application::builder().with_module::<...>()` se encarga del resto.

## Tipos de controladores disponibles

- Controladores web
- Controladores Socket.IO
- Controladores gRPC
