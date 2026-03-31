---
title: Application Configuration - Sword Framework
description: Configure your Sword application using TOML files. Learn about server settings, CORS, logging, and environment-specific configurations.
keywords:
    [
        "application configuration",
        "toml config",
        "sword settings",
        "environment variables",
        "server configuration",
    ]
---

# Configuración de la Aplicación

Sword utiliza el crate `thisconfig` para cargar uno o múltiples archivos de configuración TOML. Esto permite definir la configuración de su aplicación de manera estructurada y fácil de mantener.

## Ubicación y carga del archivo

Por defecto, Sword busca el archivo de configuración en `config/config.toml` en la raíz de su proyecto. El framework carga este archivo automáticamente durante la inicialización de `ApplicationBuilder`, por lo que no necesita hacer nada especial.

Si el archivo no se encuentra o contiene TOML inválido, la aplicación fallará durante la construcción.

Si desea usar un archivo de configuración con un nombre o ubicación diferente, puede especificarlo al construir la aplicación como se mostró en secciones anteriores.

## Primera sección: `[application]`

Esta sección define atributos generales de la aplicación, como el nombre, el entorno y el comportamiento de apagado.

```toml
[application]
name = "My Sword App"

# Habilitar el apagado elegante del servidor.
# Si está habilitado, el servidor terminará de procesar las solicitudes en curso
# antes de apagarse cuando reciba una señal de terminación.
graceful_shutdown = false

# Nombre opcional del entorno (por ejemplo, "development", "production", "staging").
# Puede usar esta variable para condicionar el comportamiento de su aplicación
# según el entorno en el que se esté ejecutando.
environment = "development"
```

## Segunda sección: `[server]`

Dependiendo del runtime (web / grpc) seleccionado en las `features` de sword, se cargará la sección correspondiente para configurar el servidor. Para ver en detalle las opciones disponibles, consulte la documentación de cada runtime.

## Interpolación de Variables de Entorno

Sword soporta la interpolación de variables de entorno directamente en el archivo de configuración. Esto es útil para mantener información sensible fuera del control de versiones:

```toml
[some-section]
host = "${HOST:127.0.0.1}" # Usa la variable HOST, o 127.0.0.1 si no está definida
port = "${PORT:8080}" # Usa la variable PORT, o 8080 como valor por defecto
```

La sintaxis es: `${VARIABLE_NAME:default_value}`. Si no especifica un valor por defecto y la variable no existe, la carga de configuración fallará.

## Cargar contenido de archivos externos

El crate `thisconfig` permite cargar contenido de archivos directamente como parte de la configuración. Esto es útil para incluir certificados, claves privadas u otros datos que no desea escribir directamente en el archivo de configuración:

```toml
[auth]
jwt_secret = "file:secrets/jwt_secret.txt"
```

Es altamente recomendado usar rutas absolutas o relativas al working directory de ejecución para evitar problemas de carga.
