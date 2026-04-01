# Extracción de estructuras de configuración

Una vez que has definido tu configuración, Sword se encarga de registrarla automáticamente en el estado de la aplicación. Puedes acceder a ella de varias formas:

## Estructura `Config`

Puedes acceder a ella desde el una instancia de `ApplicationBuilder` o `Application` usando el campo `config`.

### Métodos de extracción:

- `get::<T: DeserializeOwned + ConfigItem>()`

Extraer una estructura de configuración específica desde la configuración.

Retorna `Option<T>`.

<hr/>

- `get_or_default::<T: DeserializeOwned + ConfigItem + Default>()`

Extraer una estructura específica o retornar su `Default` si no está presente.

Retorna `T`.

<hr/>

- `expect::<T: DeserializeOwned + ConfigItem>()`

Extraer una estructura de configuración específica o lanzar `panic!` si no está presente.

Retorna `T`.

Es equivalente a llamar a:

```rust
get::<T>().expect("Expected configuration item not found")
```

Este método es útil cuando quieres asegurarte de que una configuración crítica esté presente y no quieres manejar el caso de ausencia.

<hr/>

Además, puedes extraer la configuración desde otras partes de tu aplicación, como controladores o componentes, usando inyección de dependencias. Ver la sección de [Inyección de Dependencias](/es/application-components/di/) para más detalles.
