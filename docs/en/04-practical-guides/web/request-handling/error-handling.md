# Error Handling in `Request`

Many `Request` methods return a `Result` because extraction or deserialization can fail.

For example:

- `req.param::<T>(...)`
- `req.body::<T>()`
- `req.query::<T>()`
- `req.body_validator::<T>()`

## Automatic Error Conversion

Sword automatically converts many `Request` errors into an appropriate `JsonResponse` when the handler returns `WebResult` and you propagate the error using `?`.

## Example

```rust
use serde::{Deserialize, Serialize};
use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/")]
pub struct MyController;
```


If the body cannot be correctly deserialized, Sword will automatically respond with a standardized JSON error response.

## Error Example

### Sent Body

```json
{
  "field1": "example",
  "field2": "not_an_integer"
}
```

### Approximate Response

```json
{
  "code": 400,
  "error": "...",
  "message": "Invalid request body",
  "success": false,
  "timestamp": "2025-10-21T01:52:13Z"
}
```

## Error Customization

If you want to override this behavior, you can avoid using `?` and handle the error manually using `match`, `map_err`, or any other approach you prefer.

## Limitations

Deserialization depends on `serde`, so it won't always be possible to obtain messages as specific as those from structured validation. If you need richer or field-specific errors, it's best to combine extraction with explicit validation.
