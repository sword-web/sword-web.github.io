# Special Units

Sword uses `thisconfig` to parse human-readable values in the `config.toml`. The two most important special units are `ByteConfig` and `TimeConfig`.

These structs do not just store the parsed value; they also preserve the `raw` value for logging and configuration display purposes.

## `ByteConfig` Unit

This struct represents byte sizes in a human-readable format.

```rust
pub struct ByteConfig {
    pub parsed: usize,
    pub raw: String,
}
```

- `raw`: The original string read from the TOML (e.g., `"10MB"`).
- `parsed`: The value converted to bytes (`usize`) for internal use.

### Valid Examples

```toml
max-payload = "100KB"
body-limit = { max-size = "1MB", display = true }
```

You can also use binary prefixes like `KiB`, `MiB`, etc.

## `TimeConfig` Unit

This struct represents time durations in a human-readable format.

```rust
pub struct TimeConfig {
    pub parsed: Duration,
    pub raw: String,
}
```

- `raw`: The original string (e.g., `"30s"`, `"1h 30m"`).
- `parsed`: A `std::time::Duration` ready to be used in timeouts, intervals, etc.

### Valid Examples

```toml
request-timeout = { enabled = true, timeout = "10s", display = true }
ping-timeout = "20s"
ping-interval = "25s"
```

## Formats

- `ByteConfig`: See [byte-unit](https://docs.rs/byte-unit/latest) documentation.
- `TimeConfig`: See [duration_str](https://docs.rs/duration_str/latest/) documentation.
