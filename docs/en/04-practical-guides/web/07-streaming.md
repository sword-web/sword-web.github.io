---
title: "Streaming"
description: "How to handle streaming in Sword: StreamRequest for an unbuffered body and Server-Sent Events (SSE) for real-time responses."
outline: [2, 3]
---

# Streaming

Sword exposes two forms of streaming: `StreamRequest`, for working with the request body as a stream without buffering it in memory, and Server-Sent Events (SSE), for sending real-time responses from the server to the client.

## StreamRequest

`StreamRequest` is the streaming variant of `Request` for when you don't want to buffer the entire body in memory. It keeps the body as an Axum stream and lets you decide when and how to consume it.

- Use `Request` when you want ergonomic access to the body, query, params, cookies, and extraction helpers.
- Use `StreamRequest` when you need to work with the body as a stream to avoid loading it entirely into memory.

### Interceptors for streaming

When the handler receives a `StreamRequest` instead of a `Request`, the web interceptor must implement the corresponding streaming trait.

#### The `OnRequestStream` Trait

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamTagInterceptor;

impl OnRequestStream for StreamTagInterceptor {
    async fn on_request(&self, mut req: StreamRequest) -> WebInterceptorResult {
        req.extensions.insert("stream-ok".to_string());
        req.next().await
    }
}
```

#### The `OnRequestStreamWithConfig` Trait

```rust
use sword::prelude::*;
use sword::web::*;

#[derive(Interceptor)]
struct StreamConfigInterceptor;

impl OnRequestStreamWithConfig<&'static str> for StreamConfigInterceptor {
    async fn on_request(
        &self,
        config: &'static str,
        mut req: StreamRequest,
    ) -> WebInterceptorResult {
        req.extensions.insert(config.to_string());
        req.next().await
    }
}
```

:::info Important Note on `StreamRequest`

Routes using `StreamRequest` cannot be combined with Sword interceptors defined at the controller level. In that case, apply the interceptor directly to the route.

:::

## Server-Sent Events (SSE)

Server-Sent Events (SSE) is a server push technology that lets a client receive automatic updates from the server over an HTTP connection.

In Sword it is declared with the `#[sse]` attribute. The handler returns an `Sse` wrapping a stream of events, and the route is served over `GET` with a `text/event-stream` content type.

```rust
use async_stream::stream;
use std::time::Duration;
use tokio::time::sleep;

use sword::prelude::*;
use sword::web::*;

#[controller(kind = Controller::Web, path = "/sse")]
struct SseController;

impl SseController {
    #[sse("/countdown")]
    async fn countdown(&self) -> Sse<impl EventStream + use<>> {
        let events = stream! {
            for i in (1..=5).rev() {
                sleep(Duration::from_millis(250)).await;
                yield Ok(Event::default().event("countdown").data(i.to_string()));
            }

            yield Ok(Event::default().event("done").data("The countdown has finished!"));
        };

        Sse::new(events)
    }
}
```

The stream is built with the `stream!` macro: each `yield` produces an event that is sent to the client. `Event::default()` creates an event, `.event(name)` defines its type and `.data(value)` its content.

The return type **MUST** be `Sse<impl EventStream + use<>>`, which avoids having to name the concrete stream type.

On long-lived connections, `.keep_alive(KeepAlive::default())` keeps the connection alive by sending periodic comments.

:::warning Note on `request-timeout`

SSE connections are long-lived. If `request-timeout` is enabled in the configuration, the global timeout layer will terminate the stream.

:::
