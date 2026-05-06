---
title: "Application Types"
description: "Sword distinguishes between two types of applications to suit your needs."
outline: [2, 3]
---
# Application Types

Sword distinguishes between two types of applications to suit your needs.

## Web App

The Web App is based on Axum and is built using these feature flags:

- `web`: Enables HTTP controllers. Requires importing `sword::web::*`.
- `socketio`: Enables real-time controllers. Requires importing `sword::socketio::*`.

You can choose one or both, depending on whether you want to build a traditional web application or a real-time application with Socket.IO.

## gRPC App

The gRPC App corresponds to:

- `grpc`: Enables gRPC controllers based on `tonic`. Requires importing `sword::grpc::*`.

Sword uses `tonic` as its gRPC runtime and integrates:

- Module-based controller registration.
- Async interceptors (`OnRequest`, `OnRequestWithConfig`).
- Health service (`grpc.health.v1.Health`) enabled by default.
- Optional reflection via `enable-tonic-reflection`.
- Message limits via `[grpc.body-limit]`.

## Complementary Feature Flags

The following flags do not define an application type but provide additional functionality:

- `multipart`
- `validation-validator`
- `hot-reload`

## Configuration

The [Application Configuration](/en/fundamental-concepts/configuration/application) page documents the `[application]` section for both runtimes (Web and gRPC).
