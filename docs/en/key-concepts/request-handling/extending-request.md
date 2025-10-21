---
title: Extending Request - Sword Framework
description: Extend the Request structure in Sword with custom methods and extractors. Learn to add application-specific request handling logic.
keywords: ["extending request", "custom extractors", "request traits", "sword framework", "request customization"]
---

# Extending `Request` Capabilities

One of the benefits of using a centralized extractor like `Request` is the ability to extend its functionality to suit your application's specific needs.

## Adding Custom Methods

The following example shows how to add custom extraction logic to the `Request` struct by implementing a trait.

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

With this trait, you can easily access the authorization header and store or retrieve a user associated with the request.
