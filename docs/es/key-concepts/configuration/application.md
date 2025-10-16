# Configuración de la aplicación

Sword utiliza un fichero de configuración en formato TOML para gestionar los parámetros principales de tu aplicación web. Este fichero es cargado automáticamente al iniciar la construcción de tu aplicación.

## Ubicación y carga del fichero

Por defecto, Sword busca el fichero de configuración en `config/config.toml` en la raíz de tu proyecto. El framework carga este fichero automáticamente durante la inicialización del `ApplicationBuilder`, por lo que no necesitas hacer nada adicional.

Si el fichero no se encuentra o contiene TOML inválido, la aplicación lanzará un panic durante la construcción.

## Estructura del fichero de configuración

La configuración debe definirse bajo la sección `[application]`:

```toml
[application]
# Dirección del host donde se vinculará el servidor. Por defecto es "0.0.0.0".
host = "0.0.0.0"

# Puerto en el que escuchará el servidor. Por defecto es 8080.
port = 8080

# Tamaño máximo permitido para los cuerpos de las solicitudes HTTP.
# Se especifica como una cadena con unidades (ej: "10MB", "1GB", "100KB").
# Ejemplos: "5MB", "1GB", "512KB"
body_limit = "10MB"

# Timeout opcional para las solicitudes en segundos.
# Si se establece, las solicitudes que tarden más que esta duración serán
# abortadas y devolverán un error de timeout.
# Si no se especifica, no hay timeout aplicado.
request_timeout_seconds = 15

# Habilita el apagado graceful del servidor.
# Por defecto es false.
# Si está habilitado, el servidor finalizará el procesamiento de las solicitudes
# en curso antes de apagarse cuando reciba una señal de terminación.
#
# Si deseas usar un manejador de señal personalizado, puedes deshabilitarlo
# e implementar tu propio manejador usando el método `run_with_graceful_shutdown`.
graceful_shutdown = false

# Nombre opcional de la aplicación.
# Se utiliza principalmente para propósitos de logging y visualización al inicio.
name = "My Sword App"

# Nombre del entorno opcional (ej: "development", "production", "staging").
# Puedes usar esta variable para condicionar el comportamiento de tu aplicación
# según el entorno en el que se esté ejecutando.
environment = "development"
```

## Interpolación de variables de entorno

Sword soporta la interpolación de variables de entorno directamente en el fichero de configuración. Esto es útil para mantener información sensible fuera del control de versiones:

```toml
[application]
host = "${HOST:127.0.0.1}"          # Usa la variable HOST, o 127.0.0.1 si no existe
port = "${PORT:8080}"                # Usa la variable PORT, o 8080 como valor por defecto
database_url = "${DATABASE_URL}"     # Usa la variable DATABASE_URL (required)
```

La sintaxis es: `${VARIABLE_NAME:valor_por_defecto}`. Si no especificas un valor por defecto y la variable no existe, la carga fallará.

## Parámetros de configuración

### `host`

- **Tipo**: String
- **Valor por defecto**: `"0.0.0.0"`
- **Descripción**: Dirección IP o hostname donde se vinculará el servidor. `0.0.0.0` significa que escuchará en todas las interfaces de red disponibles.

### `port`

- **Tipo**: Integer (u16)
- **Valor por defecto**: `8080`
- **Descripción**: Puerto en el que escuchará el servidor para conexiones HTTP.

### `body_limit`

- **Tipo**: String
- **Sin valor por defecto** (requerido)
- **Descripción**: Tamaño máximo permitido para los cuerpos de las solicitudes. Útil para prevenir ataques de negación de servicio (DoS). Ejemplos válidos: `"1MB"`, `"100KB"`, `"5GB"`.

### `request_timeout_seconds`

- **Tipo**: Integer (u64)
- **Valor por defecto**: `null` (sin timeout)
- **Descripción**: Tiempo máximo en segundos que se espera a una solicitud. Si se excede, la solicitud será abortada automáticamente.

### `graceful_shutdown`

- **Tipo**: Boolean
- **Valor por defecto**: `false`
- **Descripción**: Si está habilitado, el servidor permitirá que las solicitudes en curso se completen antes de apagarse cuando reciba una señal de terminación (como Ctrl+C).

### `name`

- **Tipo**: String
- **Valor por defecto**: `null` (opcional)
- **Descripción**: Nombre de la aplicación. Se muestra en los logs de inicio.

### `environment`

- **Tipo**: String
- **Valor por defecto**: `null` (opcional)
- **Descripción**: Nombre del entorno (ej: "development", "production"). Puedes usar esta variable en tu código para adaptar el comportamiento de la aplicación.
