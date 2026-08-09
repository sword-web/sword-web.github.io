---
title: "Inyección de Dependencias - Sword Framework"
description: "Domina la inyección de dependencias en Sword. Aprende sobre el `DependencyContainer`, los tipos inyectables, los proveedores y los componentes para aplicaciones modulares."
outline: [2, 3]

keywords:
    [
        "inyección de dependencias",
        "contenedor DI",
        "injectable",
        "providers",
        "components",
        "sword framework",
        "arquitectura modular",
    ]
---

# Inyección de dependencias

La inyección de dependencias es un patrón que permite a un elemento recibir sus dependencias de fuentes externas en lugar de crearlas por sí mismo.

Esto permite una mayor modularidad, facilita las pruebas unitarias y mejora la mantenibilidad del código.

**Sword** utiliza este enfoque para gestionar componentes y servicios dentro de la aplicación, permitiendo que las dependencias se inyecten automáticamente cuando sea necesario.

## Conceptos clave

### Contenedor de dependencias

La estructura `DependencyContainer` es el núcleo del patrón de inyección de dependencias en Sword. Actúa como un registro centralizado donde se pueden registrar y resolver dependencias.

### Inyectables

Un **inyectable** (`Injectable`) se refiere a cualquier estructura que puede utilizarse como dependencia. Las estructuras inyectables pueden ser inyectadas automáticamente por el contenedor de dependencias cuando se solicitan.

### Proveedores

Un **proveedor** (`Provider`) es un tipo de estructura inyectable que debe ser instanciado y registrado manualmente en el contenedor de dependencias. Los proveedores son responsables de proveer la lógica de conexiones a servicios externos, como bases de datos o APIs.

### Componentes

Un **componente** (`Component`) es una estructura inyectable que se autoconstruye en base a dependencias ya registradas en el contenedor. Los componentes son ideales para representar partes modulares de la aplicación que dependen de otros servicios o configuraciones.
