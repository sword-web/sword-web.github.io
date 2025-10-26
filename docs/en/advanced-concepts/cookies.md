---
title: Cookies - Sword Framework
description: Work with HTTP cookies in Sword. Learn to read, set, and manage cookies in your Rust web application.
keywords: ["cookies", "http cookies", "session management", "sword framework", "cookie handling"]
---

# Cookies

To use cookies in Sword, you can enable the `cookies` feature flag. This will allow you to manage cookies using the [Tower Cookies](https://docs.rs/tower-cookies/latest/tower_cookies/) layer.

Sword re-exports the necessary types and functions for working with cookies, making them easy to use in your applications.

## Using Cookies

To access cookies, methods are provided on the `Request` structure. You can use the following method:

```rust
pub fn cookies(&self) -> Result<&Cookies, HttpResponse>;
```

Returns an internal server error (500) if no cookie container is found (which is only possible if the cookie middleware is not enabled).

### Example

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

## `Signed` and `Private` Cookies

As mentioned earlier, Sword uses the [Tower Cookies](https://docs.rs/tower-cookies/latest/tower_cookies/) layer to manage cookies. Tower Cookies offers two additional types of cookies: `Signed` and `Private`.

- [Private Cookies Documentation](https://docs.rs/tower-cookies/latest/tower_cookies/struct.PrivateCookies.html)

- [Signed Cookies Documentation](https://docs.rs/tower-cookies/latest/tower_cookies/struct.SignedCookies.html)

To use these types of cookies, you'll need to configure a secret key. You can register it as `#[config]` and inject it into middlewares or controllers. [See dependency injection](../key-concepts/dependency-injection/using-dependencies.md)

### Accessing `Signed` and `Private` Cookies

```rust
req.cookies()?.signed(key);

req.cookies()?.private(key);
```
