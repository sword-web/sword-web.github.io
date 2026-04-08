# Extending `Request` Capabilities

One of the benefits of using a centralized extractor like `Request` is the ability to extend its functionality to suit your application's specific needs.

## Adding Custom Methods

In the following example, we show how to add custom extraction logic to the `Request` struct by implementing a trait.

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Clone)]
```


With this `trait`, you can easily access the authorization header and store or retrieve a user associated with the request.
