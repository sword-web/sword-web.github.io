---
title: "Extending `Request` Capabilities"
description: "One of the main benefits of using a centralized extractor like Request is that you can extend it to match your app's specific needs."
outline: [2, 3]
---
# Extending `Request` Capabilities

One of the main benefits of using a centralized extractor like `Request` is that you can extend it to match your app's specific needs.

## Adding Custom Methods

The example below shows how to add custom extraction logic to the `Request` struct by implementing a trait.

Assuming your application defines `User` and `SessionClaims`, you can create a `RequestExt` trait to expose convenient methods for accessing that data from the request.

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

With this trait, you can easily access data stored in request extensions. You can also add extra logic, such as validations or transformations, to expand what the base `Request` provides.
