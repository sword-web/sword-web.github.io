# Defining Controllers

A controller is commonly known as a function that handles an HTTP request and returns an HTTP response. In Sword, we handle controllers as `structs`, and their methods are what actually handle the HTTP requests.

You'll notice this is a different approach from other Rust web frameworks, where controllers are functions. This object-oriented approach allows you to group related functionality within the same controller, making it easier to organize and maintain your code.

## Creating a Controller

To define a controller, you need to create a `struct` and mark it using the `#[controller]` macro.

```rust
use sword::prelude::*;

#[controller("/api")]
struct ApiController;

// ... assuming main function and other imports ...

Application::builder()
    .with_controller::<ApiController>()
    .build()
```

### `#[controller]` Macro Attributes

#### `path`

The `path` attribute defines the route prefix for all routes within the controller. In the example above, all routes defined in `ApiController` will have the `/api` prefix.

### `version`

The `version` attribute allows you to define a version for the controller, which will be included in the route. For example:

```rust
#[controller("/api", version = "v1")]
struct ApiController;
```

This is equivalent to defining the controller with the `/api/v1` prefix. However, it provides additional semantic meaning, indicating that this controller belongs to version 1 of your API.
