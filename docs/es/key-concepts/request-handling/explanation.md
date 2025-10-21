
# Manejo de solicitudes HTTP y extracción

En Sword, a diferencia de axum, no se utilizan extractores indivuduales en los parámetros de los métodos de los controladores. En su lugar, se utiliza un estructura Request que proporciona una API similar a otros frameworks web populares.

## Objeto general `Request`
Esto consiste en un objeto que contiene la información de la solicitud, junto con métodos para acceder a diferentes partes de la misma. Por ejemplo, en Express.js, el objeto `req`.

### Ejemplo

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

#[routes]
impl ApiController {
    #[post("/data")]
    async fn data(&self, req: Request) -> HttpResult {
        let body = req.body::<Value>()?;
        let user = req.extensions.get::<User>()?;

        // ... Do something ...

        Ok(HttpResponse::Ok().json(vec![]))
    }
}
```

## ¿Por qué no usar extractores directamente?

El uso de extractores directamente en los parámetros de los métodos otorga ventajas, principalmente en términos de simplicidad, al usar extractores, literalmente se extraen solo los datos necesarios que el usuario necesite, pero esto también tiene desventajas.

### Ejemplo

```rust
async fn axum_controller_example(
    Extension(user): Extension<User>,
    State(state): State<AppState>,
    Json(body): Json<Value>, 
) -> Json<Vec<Value>> {

    // ... Do something ...

    Json(vec![])
}
```

En el ejemplo anterior se muestra un `handler` de axum que utiliza tres extractores diferentes: Extension, State y Json. Sin embargo, esto puede traer problemas de formateo y que código repetido si múltiples métodos necesitan los mismos extractores, ejemplo, el de estado.

En el apartado de Inyección de Dependencias se explica cómo Sword maneja este problema.

Otro problema es que el orden de los parámetros importa, y puede ser confuso para los desarrolladores.

Finalmente, la creación de extractores personalizados puede ser más compleja y requerir más código boilerplate.

Al usar `Request`, puedes extender la funcionalidad de esta mediante `traits` y agregar métodos personalizados para manejar casos específicos de tu aplicación, lo que puede simplificar el código y mejorar la mantenibilidad.