---
title: Usando Dependencias - Framework Sword
description: Aprende cómo inyectar dependencias en Controllers y Middlewares. Ve ejemplos prácticos de inyección de dependencias en acción.
keywords:
    [
        "usando dependencias",
        "inyección controller",
        "inyección middleware",
        "framework sword",
        "uso de dependencias",
        "inyección de servicios",
    ]
---

# Inyección de dependencias en `Controllers` e `Interceptors`

Una vez que hayas definido y registrado tus `Providers` y `Components`, puedes inyectarlos en `Controllers` e `Interceptors` siguiendo el mismo patrón que en los ejemplos anteriores.

Esto es posible debido que por debajo estos son tambien `Components`, o sea que se auto construyen en base a a sus dependencias.

Sin embargo, no puedes inyectar controladores o interceptores en otros controladores o interceptores.
