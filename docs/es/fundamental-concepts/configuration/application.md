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

Sword utiliza un archivo de configuración TOML para gestionar los parámetros principales de su aplicación web. Este archivo se carga automáticamente cuando su aplicación se inicia.

## Ubicación y carga del archivo

Por defecto, Sword busca el archivo de configuración en `config/config.toml` en la raíz de su proyecto. El framework carga este archivo automáticamente durante la inicialización de `ApplicationBuilder`, por lo que no necesita hacer nada especial.

Si el archivo no se encuentra o contiene TOML inválido, la aplicación fallará durante la construcción.

## Estructura del archivo de configuración

La configuración debe definirse bajo la sección `[application]`:

```toml
[application]
# Dirección del host a la que se enlazará el servidor. Por defecto es "0.0.0.0".
host = "0.0.0.0"

# Número de puerto al que se enlazará el servidor. Por defecto es 8080.
port = 8080

# Habilitar el apagado elegante del servidor.
# Por defecto es false.
# Si está habilitado, el servidor terminará de procesar las solicitudes en curso
# antes de apagarse cuando reciba una señal de terminación.
#
# Si desea usar un manejador de señales personalizado, puede deshabilitar esto
# e implementar su propio manejador usando el método `run_with_graceful_shutdown`.
graceful_shutdown = false

# Nombre opcional de la aplicación.
# Se usa principalmente para propósitos de registro y visualización al iniciar.
name = "My Sword App"

# Nombre opcional del entorno (por ejemplo, "development", "production", "staging").
# Puede usar esta variable para condicionar el comportamiento de su aplicación
# según el entorno en el que se esté ejecutando.
environment = "development"
```

## Interpolación de Variables de Entorno

Sword soporta la interpolación de variables de entorno directamente en el archivo de configuración. Esto es útil para mantener información sensible fuera del control de versiones:

```toml
[application]
host = "${HOST:127.0.0.1}" # Usa la variable HOST, o 127.0.0.1 si no está definida
port = "${PORT:8080}" # Usa la variable PORT, o 8080 como valor por defecto
```

La sintaxis es: `${VARIABLE_NAME:default_value}`. Si no especifica un valor por defecto y la variable no existe, la carga de configuración fallará.
