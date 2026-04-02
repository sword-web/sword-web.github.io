# Tipos de aplicación

Sword distingue dos tipos de aplicación que se pueden ajustar a tus necesidades.

## Web app

La web app se basa en axum y se construye a partir de estas feature flags:

- `web-controllers`
- `socketio-controllers`

Puedes elegir una o ambas, dependiendo de si quieres construir una aplicación web tradicional o una aplicación en tiempo real con Socket.IO.

## gRPC app

La grpc app corresponde a:

- `grpc-controllers`

Actualmente esta opción se mantiene en desarrollo. Se basará en tonic y su ecosistema.

## Feature flags complementarias

Estas flags no definen un tipo de aplicación:

- `multipart`
- `validation-validator`
- `hot-reload`

## Configuración

La página [Configuración de la Aplicación](/es/fundamental-concepts/configuration/application) documenta la configuración de la web app actual.
