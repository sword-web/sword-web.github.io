# Extendiendo las capacidades de `Request`

Uno de los beneficios de utilizar un extractor centralizado como `Request` es la capacidad de extender sus funcionalidades para adaptarse a las necesidades específicas de tu aplicación.

## Agregando métodos personalizados

En el siguiente ejemplo, se muestra como agregar lógica de extracción personalizada al struct `Request` mediante la implementación de un trait.

```rust
use sword::prelude::*;

#[derive(Clone)]
pub struct User {
    pub id: u32,
    pub name: String,
}

pub trait RequestExt {
    fn authorization(&self) -> Option<String>;
    fn user(&self) -> Option<User>;
    fn set_user(&mut self, user: User);
}

impl RequestExt for Request {
    fn authorization(&self) -> Option<String> {
        self.headers().get("Authorization").map(|s| s.to_string())
    }

    fn user(&self) -> Option<User> {
        self.extensions.get::<User>().cloned()
    }

    fn set_user(&mut self, user: User) {
        self.extensions.insert::<User>(user);
    }
}
```
Con este `trait`, puedes acceder fácilmente al encabezado de autorización y almacenar o recuperar un un usuario asociado a la solicitud.