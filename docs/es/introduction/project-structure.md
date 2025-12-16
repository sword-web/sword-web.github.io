# Estructura de archivos

Como se mencionó en la introducción, sword sugiere una estructura de desarrollo basada en modulos.

Al inicial una aplicación con `sword-cli`, este generará una estructura similar a la siguiente:

```shell
my-sword-app
├── Cargo.lock
├── Cargo.toml
├── config
│   └── config.toml
└── src
    ├── controller.rs
    ├── main.rs
    └── service.rs
```

Esto te da una idea de como organizar tu proyecto. Sin embargo, a medida que tu aplicación crezca, es recomendable dividir la aplicación en modulos y separar las diferentes capas de la aplicación.

En ese caso, la estructura recomendada es la siguiente:

```shell
module_name
├── controller.rs   # Capa HTTP (Definición del controlado y endpoints)
├── dtos.rs         # Definición de esquemas de entrada/salida y validación
├── entity.rs       # Capa de dominio (entidades y modelos de negocio)
├── mod.rs          # Punto de entrada del módulo (definición y re-exports)
├── repository.rs   # Capa de persistencia (acceso a datos)
└── service.rs      # Capa de lógica de negocio

```

Probablemente hayas visto o utilizado alguna arquitectura similar en frameworks como Spring en Java o NestJS. Sword toma fuerte inspiración en este último.
