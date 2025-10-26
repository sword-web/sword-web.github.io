# Cookies

Para utilizar cookies en Sword, puedes habilitar el feature flag `cookies`. Esto te permitirá gestionar cookies utilizando el layer [Tower Cookies](https://docs.rs/tower-cookies/latest/tower_cookies/).

Sword re-exporta los tipos y funciones necesarios para trabajar con cookies, facilitando su uso en tus aplicaciones.

## Usando Cookies

Para acceder a las cookies se proveen metodos en la estructura `Request` puedes usar el siguiente método:

```rust
pub fn cookies(&self) -> Result<&Cookies, HttpResponse>;
```

Retorna un error interno del servidor (500) si no se encuentra un contenedor de cookies (lo cual es exclusivamente posible si el middleware de cookies no está habilitado).

### Ejemplo

```rust
use sword::prelude::*;

#[controller("/cookies")]
struct CookieController {}

#[routes]
impl CookieController {
    #[get("/set")]
    async fn set_cookie(&self, req: Request) -> HttpResult {
        let cookies = req.cookies()?;

        let cookie = CookieBuilder::new("username", "sword_user")
            .path("/")
            .http_only(true)
            .same_site(SameSite::Lax)
            .build();

        cookies.add(cookie);

        Ok(HttpResponse::Ok())
    }
}
```

## Cookies `Signed` y `Private`

Como se mencionó anteriormente, Sword utiliza el layer [Tower Cookies](https://docs.rs/tower-cookies/latest/tower_cookies/) para gestionar cookies. Tower Cookies ofrece dos tipos adicionales de cookies: `Signed` y `Private`.

- [Documentación Private Cookies](https://docs.rs/tower-cookies/latest/tower_cookies/struct.PrivateCookies.html)

- [Documentación Signed Cookies](https://docs.rs/tower-cookies/latest/tower_cookies/struct.SignedCookies.html)

Para utilizar este tipo de cookies necesitarás configurar una clave secreta, para ello puedes registrarla como `#[config]` e inyectarla en middlewares o controladores. [Ver inyección de dependencias](../key-concepts/dependency-injection/using-dependencies.md)

### Accediendo a `Signed` y `Private` Cookies

```rust
req.cookies()?.signed(key);

req.cookies()?.private(key);
```