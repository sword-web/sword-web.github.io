# Unidades Especiales

Sword usa `thisconfig` para parsear valores legibles por humanos en el `config.toml`. Las dos unidades especiales más importantes son `ByteConfig` y `TimeConfig`.

Estas estructuras no guardan solo el valor parseado, también conservan el valor crudo (`raw`) para logging y display de configuración.

## `ByteConfig`

`ByteConfig` representa tamaños en bytes con formato humano.

```rust
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

- `raw`: string original leída desde TOML (por ejemplo `"10MB"`).
- `parsed`: valor convertido a bytes (`usize`) para uso interno.

### Ejemplos válidos

```toml
max-payload = "100KB"
body-limit = { max-size = "1MB", display = true }
```

También puedes usar formatos binarios como `KiB`, `MiB`, etc.

## `TimeConfig`

`TimeConfig` representa duraciones en formato humano.

```rust
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

- `raw`: string original (por ejemplo `"30s"`, `"1h 30m"`).
- `parsed`: `std::time::Duration` listo para aplicar en timeouts, intervalos, etc.

### Ejemplos válidos

```toml
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

## Formatos

- `ByteConfig` ver [byte-unit](https://docs.rs/byte-unit/latest)
- `TimeConfig` ver [duration_str](https://docs.rs/duration_str/latest/
