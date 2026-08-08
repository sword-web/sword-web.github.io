---
title: "Estructura de archivos"
description: "Sword sugiere una estructura de desarrollo basada en modulos."
---

# Estructura de archivos

Como se mencionó en la introducción, sword sugiere una estructura de desarrollo basada en módulos.

Un módulo es una unidad de organización que agrupa código relacionado, como controladores, servicios, repositorios, entidades e incluso sub módulos. Esto permite mantener una separación clara de responsabilidades y facilita la escalabilidad del proyecto.

```shell
module_name
├── controller.rs   # Capa de presentación y adaptadores.
├── dtos.rs         # Definición de esquemas de entrada/salida y validación
├── entity.rs       # Capa de dominio (entidades y modelos de negocio)
├── mod.rs          # Punto de entrada del módulo (definición y re-exports)
├── repository.rs   # Capa de persistencia (acceso a datos)
└── service.rs      # Capa de lógica de negocio
```

Probablemente hayas visto o utilizado alguna arquitectura similar en frameworks como Spring en Java o NestJS. Sword toma fuerte inspiración en este último.

Por supuesto, esta estructura es solo una guía, es más, es altamente probable que requieras agregar archivos adicionales como:

- `errors.rs` para definir errores específicos del módulo/dominio.
- `views.rs` para definir vistas y estructuras de cara al cliente.

O incluso directorios adicionales para submódulos, por ejemplo:

```shell
module_name
├── controllers/    # Capas de presentación y adaptadores (web, grpc, socketio, eventos, etc)
├── dtos/           # Definición de esquemas de entrada/salida y validación
├── services/       # Definición de servicios y lógica de negocio asociada al módulo
├── entity.rs       # Capa de dominio (entidades y modelos de negocio)
├── mod.rs          # Punto de entrada del módulo (definición y re-exports)
├── repository.rs   # Capa de persistencia (acceso a datos)
```
