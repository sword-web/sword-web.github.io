---
title: "Extendiendo las capacidades de `Request`"
description: "Uno de los beneficios de utilizar un extractor centralizado como Request es la capacidad de extender sus funcionalidades para adaptarse a las necesidades específicas de tu aplicación."
outline: [2, 3]
---
# Extendiendo las capacidades de `Request`

Uno de los beneficios de utilizar un extractor centralizado como `Request` es la capacidad de extender sus funcionalidades para adaptarse a las necesidades específicas de tu aplicación.

## Agregando métodos personalizados

En el siguiente ejemplo, se muestra como agregar lógica de extracción personalizada al struct `Request` mediante la implementación de un trait.

Asumiendo estructuras `User` y `SessionClaims` definidas en tu aplicación, puedes crear un trait `RequestExt` para proporcionar métodos convenientes para acceder a esta información desde la solicitud.

```rust
use sword::prelude::*;
use sword::web::*;

pub trait RequestExt {
    fn user(&self) -> Option<&User>;
    fn claims(&self) -> Option<&SessionClaims>;
}

impl RequestExt for Request {
    fn user(&self) -> Option<&User> {
        self.extensions.get::<User>()
    }

    fn claims(&self) -> Option<&SessionClaims> {
        self.extensions.get::<SessionClaims>()
    }
}
```

Con este `trait`, puedes acceder fácilmente a información almacenada en las extenciones de la solicitud. No obstante podrías añadir lógica adicional, como validaciones o transformaciones, para mejorar la funcionalidad de la `Request` base.
