
---
title: Inyección de Dependencias - Sword Framework
description: Domina la inyección de dependencias en Sword. Aprende sobre el DependencyContainer, tipos Injectable, Providers y Components para aplicaciones modulares.
keywords: ["inyección de dependencias", "contenedor DI", "injectable", "providers", "components", "sword framework", "arquitectura modular"]
---

# Inyección de dependencias en Sword

La inyección de dependencias es un patrón de diseño que permite a un objeto recibir sus dependencias de fuentes externas en lugar de crearlas por sí mismo. 

Esto permite una mayor modularidad, facilita las pruebas unitarias y mejora la mantenibilidad del código.

Sword utiliza este enfoque para gestionar componentes y servicios dentro de la aplicación, permitiendo que las dependencias se inyecten automáticamente cuando sea necesario.

## Conceptos clave

### Contenedor de dependencias

La estructura `DependencyContainer` es el núcleo del patrón de inyección de dependencias en Sword. Actúa como un registro centralizado donde se pueden registrar y resolver dependencias.

### `Injectable`

`Injectable` es un concepto general que se refiere a cualquier estructura que puede utilizarse como dependencia. Las estructuras `Injectable` pueden ser inyectadas automáticamente por el contenedor de dependencias cuando se solicitan.

### `Provider`

Un `Provider` es un tipo de estructura `Injectable` que debe ser instanciada y registrada manualmente en el contenedor de dependencias. Los `Providers` son responsables de proveer la lógica de conexiones a servicios externos, como bases de datos o APIs.

### `Component`

Un `Component` es una estructura `Injectable` que se autoconstruye en base a dependencias ya registradas en el contenedor. Los `Components` son ideales para representar partes modulares de la aplicación que dependen de otros servicios o configuraciones.