---
title: Application Configuration - Sword Framework
description: Configure your Sword application using TOML files. Learn about server settings, CORS, logging, and environment-specific configurations.
keywords: ["application configuration", "toml config", "sword settings", "environment variables", "server configuration"]
---

# Application Configuration

Sword uses a TOML configuration file to manage the main parameters of your web application. This file is loaded automatically when your application starts up.

## File Location and Loading

By default, Sword looks for the configuration file at `config/config.toml` in your project root. The framework loads this file automatically during `ApplicationBuilder` initialization, so you don't need to do anything special.

If the file is not found or contains invalid TOML, the application will panic during construction.

## Configuration File Structure

Configuration must be defined under the `[application]` section:

```toml
[application]
# Host address to bind the server to. Default is "0.0.0.0".
host = "0.0.0.0"

# Port number to bind the server to. Default is 8080.
port = 8080

# Maximum size allowed for HTTP request bodies.
# Specified as a string with units (e.g., "10MB", "1GB", "100KB").
# Examples: "5MB", "1GB", "512KB"
body_limit = "10MB"

# Optional timeout for requests in seconds.
# If set, requests that take longer than this duration will be
# aborted and return a timeout error.
# If not specified, no timeout is applied.
request_timeout_seconds = 15

# Enable graceful shutdown of the server.
# Default is false.
# If enabled, the server will finish processing in-flight requests
# before shutting down when it receives a termination signal.
#
# If you want to use a custom signal handler, you can disable this
# and implement your own handler using the `run_with_graceful_shutdown` method.
graceful_shutdown = false

# Optional application name.
# Used mainly for logging and display purposes at startup.
name = "My Sword App"

# Optional environment name (e.g., "development", "production", "staging").
# You can use this variable to condition your application's behavior
# based on the environment it's running in.
environment = "development"
```

## Environment Variable Interpolation

Sword supports environment variable interpolation directly in the configuration file. This is useful for keeping sensitive information out of version control:

```toml
[application]
host = "${HOST:127.0.0.1}"          # Uses HOST variable, or 127.0.0.1 if not set
port = "${PORT:8080}"                # Uses PORT variable, or 8080 as default
database_url = "${DATABASE_URL}"     # Uses DATABASE_URL variable (required)
```

The syntax is: `${VARIABLE_NAME:default_value}`. If you don't specify a default value and the variable doesn't exist, configuration loading will fail.
