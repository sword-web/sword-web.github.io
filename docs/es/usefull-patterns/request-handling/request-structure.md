
# La estructura `Request`

Como se mencionó en la sección anterior, sword provee una estructura `Request` que encapsula toda la información relevante sobre una solicitud HTTP entrante. 

## Métodos asociados

### `uri()`

Retorna la URI completa de la solicitud en formato `String`.

```rust
pub fn uri(&self) -> String
```

### `method()`
Retorna el método HTTP de la solicitud como una referencia a un valor de tipo `Method`.

```rust
pub fn method(&self) -> &Method
```

### `headers()`
Retorna una referencia a los encabezados HTTP de la solicitud como una referencia a un `HashMap<String, String>`.

```rust
pub fn headers(&self) -> &HashMap<String, String>
```

### `headers_mut()`
Retorna una referencia mutable a los encabezados HTTP de la solicitud como una referencia mutable a un `HashMap<String, String>`.

```rust
pub fn headers_mut(&mut self) -> &mut HashMap<String, String>
```

### `param()`
Retorna el valor de un parámetro de la ruta, convertido al tipo especificado.

```rust
pub fn param<T: FromStr>(&self, key: &str) -> Result<T, RequestError>
```

#### Errores

- `RequestError::ParseError`: Indica que la conversión del valor del parámetro al tipo especificado falló.

### `params()`
Retorna todos los parámetros de la ruta como un `HashMap<String, String>`.

```rust
pub fn params(&self) -> HashMap<String, String>
```

### `body()`
Retorna el cuerpo de la solicitud deserializado al tipo especificado. 

```rust
pub fn body<T: DeserializeOwned>(&self) -> Result<T, RequestError>
```

#### Errores

- `RequestError::BodyIsEmpty`: Indica que el cuerpo de la solicitud está vacío.
- `RequestError::ParseError`: Indica que la deserialización del cuerpo de la solicitud al tipo especificado falló.

### `query()`
Retorna los parámetros de consulta deserializados al tipo especificado.

```rust
pub fn query<T: DeserializeOwned>(&self) -> Result<Option<T>, RequestError>
```

#### Resultados

- `Ok(Some(T))`: Indica que los parámetros de consulta fueron deserializados exitosamente al tipo especificado.

- `Ok(None)`: Indica que no hay parámetros de consulta presentes en la solicitud.

#### Errores

- `RequestError::ParseError`: Indica que la deserialización de los parámetros de consulta al tipo especificado falló.
