# Extendiendo las capacidades de `Request`

Uno de los beneficios de utilizar un extractor centralizado como `Request` es la capacidad de extender sus funcionalidades para adaptarse a las necesidades específicas de tu aplicación.

## Agregando métodos personalizados

En el siguiente ejemplo, se muestra como agregar lógica de extracción personalizada al struct `Request` mediante la implementación de un trait.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Clone)]
```

Con este `trait`, puedes acceder fácilmente al encabezado de autorización y almacenar o recuperar un un usuario asociado a la solicitud.