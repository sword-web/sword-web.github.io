---
title: Using Dependencies - Sword Framework
description: Learn how to inject dependencies into Controllers and Interceptors. See practical examples of dependency injection in action.
keywords:
    [
        "using dependencies",
        "controller injection",
        "interceptor injection",
        "sword framework",
        "dependency usage",
        "service injection",
    ]
---

# Dependency Injection in `Controllers` and `Interceptors`

Once you have defined and registered your `Providers` and `Components`, you can inject them into `Controllers` and `Interceptors` following the same pattern as in previous examples.

This is possible because, under the hood, these are also `Components`. This means they are automatically constructed based on their dependencies.

However, you cannot inject controllers or interceptors into other controllers or interceptors.
