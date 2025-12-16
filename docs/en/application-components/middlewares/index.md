---
title: Middlewares - Sword Framework
description: Understand middleware in Sword for request processing, authentication, logging, and more. Learn about global and route-specific middleware.
keywords: ["middleware", "request interceptor", "authentication", "logging", "sword framework", "http middleware"]
---

# What is a Middleware?

A middleware is a component that sits between an incoming request and the controller that handles that request. It allows you to intercept, modify, or process HTTP requests and responses either globally or specifically for certain routes.

## Why Use Middlewares?

Middlewares are useful for:

- Authentication and authorization
- Request logging and monitoring
- Request validation

## Types of Middlewares

Sword provides three types of middlewares:

- Middlewares
- Middlewares with configuration
- Tower middlewares

Each type of middleware has its own characteristics and use cases, which are described in the following sections.

## Frequently Asked Questions

### Why must middlewares be structs?

Middlewares in Sword have the ability to access dependencies injected through the dependency container. By being structs, you can inject services or components needed for middleware logic directly into their attributes.

