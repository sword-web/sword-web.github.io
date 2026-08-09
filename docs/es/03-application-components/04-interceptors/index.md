---
title: "¿Qué es un interceptor?"
description: "Un interceptor es un componente que se interpone entre la solicitud/mensaje entrante y el controlador que corresponda."
outline: [2, 3]
---

# ¿Qué es un interceptor?

Un **interceptor** (`Interceptor`) es un componente que se interpone entre la solicitud/mensaje entrante y el controlador en el que se aplique. Permiten leer, modificar y procesar las solicitudes entrantes.

## ¿Por qué usar interceptores?

Los interceptores son útiles para:

- Autenticación y autorización
- Registro y monitoreo de solicitudes
- Validación de solicitudes

## Las tres variantes

Sword provee tres tipos de interceptores:

### Tradicionales

La variante más común. Se declaran como estructuras que derivan el trait `Interceptor` e implementan traits como `OnRequest`, `OnRequestStream` u `OnConnect`, según el tipo de controlador. Por debajo son componentes, por lo que pueden poseer dependencias sin requerir un constructor definido.

### Con configuración

Poseen el mismo comportamiento que los tradicionales, pero añaden un parámetro de tipo `T` extra en la firma del método de intercepción (`OnRequestWithConfig`, `OnConnectWithConfig`, etc.). Ese parámetro permite pasar configuración adicional al interceptor.

### Layers de Tower

Sword se integra con el ecosistema de Tower. Puedes aplicar layers locales en controladores web usando el atributo `#[interceptor(TowerLayer::example())]`.

## Aplicación por tipo de controlador

Cada variante se aplica de forma distinta según el tipo de controlador. Los ejemplos completos viven en las guías prácticas:

- Controladores Web → [Interceptores en controladores web](/es/practical-guides/web/interceptors)
- Controladores Socket.IO → [Interceptores en controladores Socket.IO](/es/practical-guides/socketio/interceptors)
- Controladores gRPC → [Interceptores en controladores gRPC](/es/practical-guides/grpc/interceptors)
