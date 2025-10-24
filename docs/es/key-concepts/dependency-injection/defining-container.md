
---
title: Contenedor de Dependencias - Sword Framework
description: Aprende sobre el DependencyContainer en Sword. Comprende el registro de dependencias, uso de Arc y gestión centralizada de dependencias.
keywords: ["contenedor de dependencias", "contenedor DI", "registro de dependencias", "sword framework", "punteros Arc", "seguridad de hilos"]
---

# Contenedor de Dependencias

La estructura `DependencyContainer` es el núcleo del patrón de inyección de dependencias en Sword. Actúa como un registro centralizado donde se pueden registrar y resolver dependencias.

## Registro de Dependencias

```rust
use sword::prelude::*;

#[sword::main]
async fn main() {
    let db = Database::connect("sqlite::memory:").await.unwrap();

    let container = DependencyContainer::builder()
        .register_provider(db)
        .register_component::<UserService>()
        .build();
}
```
En este ejemplo, se crea una instancia de `Database` y se registra un `DbProvider` como un proveedor en el contenedor de dependencias. Además, se registra `UserService` como un componente que puede ser resuelto automáticamente.

## Uso de `Arc`

Cuando se registran dependencias en el contenedor, este utiliza punteros `Arc` internamente, de esta manera se asegura que las dependencias compartidas sean seguras para el acceso entre hilos. Esto significa que no es necesario envolver manualmente las dependencias en `Arc` al registrarlas. 