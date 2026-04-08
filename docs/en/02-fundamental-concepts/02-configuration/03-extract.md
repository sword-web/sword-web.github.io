# Extracting Configuration Structs

Once you have defined your configuration, Sword takes care of automatically registering it in the application state. You can access it in several ways:

## The `Config` Struct

You can access it from an `ApplicationBuilder` or `Application` instance using the `config` field.

### Extraction Methods

#### `get::<T: DeserializeOwned + ConfigItem>()` Method

Extracts a specific configuration struct from the configuration.

Returns `Option<T>`.

<hr/>

#### `get_or_default::<T: DeserializeOwned + ConfigItem + Default>()` Method

Extracts a specific struct or returns its `Default` if not present.

Returns `T`.

<hr/>

#### `expect::<T: DeserializeOwned + ConfigItem>()` Method

Extracts a specific configuration struct or triggers a `panic!` if not present.

Returns `T`.

It is equivalent to calling:

```rust
get::<T>().expect("Expected configuration item not found")
```

This method is useful when you want to ensure a critical configuration is present and do not want to handle its absence.

<hr/>

Additionally, you can extract configuration from other parts of your application, such as controllers or components, using dependency injection. See the [Dependency Injection](/en/application-components/di/) section for more details.
