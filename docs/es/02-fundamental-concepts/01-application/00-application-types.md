# Tipos de aplicación

Sword distingue dos tipos de aplicación que se pueden ajustar a tus necesidades.

## Web app

La web app se basa en axum y se construye a partir de estas feature flags:

- `web-controllers`: Habilita controladores HTTP. Requiere importar `sword::web::*`.
- `socketio-controllers`: Habilita controladores de tiempo real. Requiere importar `sword::socketio::*`.

Puedes elegir una o ambas, dependiendo de si quieres construir una aplicación web tradicional o una aplicación en tiempo real con Socket.IO.

## gRPC app

La grpc app corresponde a:

- `grpc-controllers`: Habilita controladores gRPC basados en `tonic`. Requiere importar `sword::grpc::*`.

Sword usa `tonic` como runtime gRPC e integra:

- registro de controladores por módulos,
- interceptores async (`OnRequest`, `OnRequestWithConfig`),
- health service (`grpc.health.v1.Health`) habilitado por defecto,
- reflection opcional con `enable-tonic-reflection`,
- límites de mensaje via `[application.body-limit]`.

## Feature flags complementarias

Estas flags no definen un tipo de aplicación:

- `multipart`
- `validation-validator`
- `hot-reload`

## Configuración

La página [Configuración de la Aplicación](/es/fundamental-concepts/configuration/application) documenta la sección `[application]` para ambos runtimes (web y gRPC).
